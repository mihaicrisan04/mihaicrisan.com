// Stream event types matching the backend protocol
export type StreamEvent =
  | {
      type: "step:start";
      step: {
        type: "tool_call";
        toolCallId: string;
        name: string;
        args?: Record<string, unknown>;
      };
    }
  | {
      type: "step:complete";
      step: {
        type: "tool_call";
        toolCallId: string;
        result: string;
        resultsCount?: number;
      };
    }
  | { type: "text:delta"; content: string }
  | { type: "text:done"; threadId: string }
  | { type: "error"; message: string }
  // Reasoning events (for models with reasoning/thinking capabilities)
  | { type: "reasoning:start" }
  | { type: "reasoning:delta"; content: string }
  | { type: "reasoning:done" };

// Chat step types for UI state
// "portfolio_search" is a special type for the searchPortfolio tool to display nicely
export interface ChatStep {
  id: string;
  toolCallId?: string;
  type: "portfolio_search" | "tool_call";
  status: "loading" | "complete";
  // Tool call info
  name?: string;
  args?: Record<string, unknown>;
  result?: string;
  // Portfolio search specific (extracted from args/result)
  query?: string;
  resultsCount?: number;
}

// Parse SSE data line into a StreamEvent
export function parseSSELine(line: string): StreamEvent | null {
  if (!line.startsWith("data: ")) {
    return null;
  }

  try {
    const jsonStr = line.slice(6); // Remove "data: " prefix
    return JSON.parse(jsonStr) as StreamEvent;
  } catch {
    console.error("Failed to parse SSE line:", line);
    return null;
  }
}

// Create an async generator that yields parsed events from an SSE stream
export async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<StreamEvent, void, unknown> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    // Process complete lines
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue; // Skip empty lines
      }

      const event = parseSSELine(trimmed);
      if (event) {
        yield event;
      }
    }
  }

  // Process any remaining data in buffer
  if (buffer.trim()) {
    const event = parseSSELine(buffer.trim());
    if (event) {
      yield event;
    }
  }
}

// Helper to generate unique step IDs
export function generateStepId(): string {
  return `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Callbacks interface for streaming chat
export interface StreamCallbacks {
  onStepStart: (step: ChatStep) => void;
  onStepComplete: (stepId: string, data: Partial<ChatStep>) => void;
  onTextDelta: (content: string) => void;
  onReasoningStart?: () => void;
  onReasoningDelta?: (content: string) => void;
  onReasoningDone?: () => void;
  onComplete: (threadId: string) => void;
  onError: (error: string) => void;
}

// Streaming chat function for the frontend
export async function streamingChat(
  convexUrl: string,
  message: string,
  threadId: string | null,
  callbacks: StreamCallbacks
): Promise<void> {
  const activeSteps = new Map<string, string>(); // Maps step key to step ID

  try {
    const response = await fetch(`${convexUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();

    let completeCalled = false;
    let lastThreadId = "";

    for await (const event of parseSSEStream(reader)) {
      switch (event.type) {
        case "step:start": {
          const stepId = generateStepId();
          const toolName = event.step.name;
          const toolArgs = event.step.args;
          const toolCallId = event.step.toolCallId;

          activeSteps.set(toolCallId, stepId);

          // Special handling for searchPortfolio tool - show as portfolio search
          if (toolName === "searchPortfolio") {
            const query =
              toolArgs && typeof toolArgs.query === "string"
                ? toolArgs.query
                : undefined;
            callbacks.onStepStart({
              id: stepId,
              toolCallId,
              type: "portfolio_search",
              status: "loading",
              name: toolName,
              args: toolArgs,
              query,
            });
          } else {
            callbacks.onStepStart({
              id: stepId,
              toolCallId,
              type: "tool_call",
              status: "loading",
              name: toolName,
              args: toolArgs,
            });
          }
          break;
        }

        case "step:complete": {
          const toolCallId = event.step.toolCallId;
          const stepId = activeSteps.get(toolCallId);

          if (stepId) {
            const resultsCount = event.step.resultsCount;

            callbacks.onStepComplete(stepId, {
              status: "complete",
              result: event.step.result,
              ...(resultsCount != null && { resultsCount }),
            });

            activeSteps.delete(toolCallId);
          }
          break;
        }

        case "text:delta":
          callbacks.onTextDelta(event.content);
          break;

        case "text:done":
          lastThreadId = event.threadId;
          completeCalled = true;
          callbacks.onComplete(event.threadId);
          break;

        case "error":
          console.error("[streamParser] Stream error:", event.message);
          callbacks.onError(event.message);
          break;

        case "reasoning:start":
          callbacks.onReasoningStart?.();
          break;

        case "reasoning:delta":
          callbacks.onReasoningDelta?.(event.content);
          break;

        case "reasoning:done":
          callbacks.onReasoningDone?.();
          break;

        default:
          break;
      }
    }
    // Safety: if text:done was never received, still call onComplete to clean up UI state
    if (!completeCalled) {
      console.warn(
        "[streamParser] text:done event was never received, calling onComplete as fallback"
      );
      callbacks.onComplete(lastThreadId || "fallback");
    }
  } catch (error) {
    callbacks.onError(error instanceof Error ? error.message : "Stream failed");
  }
}
