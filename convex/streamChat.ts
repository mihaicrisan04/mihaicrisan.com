import type { ActionCtx } from "./_generated/server";
import { portfolioAgent } from "./agent";
import { createContextualTools } from "./tools";

// Event types for the streaming protocol (SSE to frontend)
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
  | { type: "reasoning:start" }
  | { type: "reasoning:delta"; content: string }
  | { type: "reasoning:done" };

// Helper to format SSE data
function formatSSE(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

// Main streaming chat function using the Convex Agent
export async function streamChat(
  ctx: ActionCtx,
  { threadId, message }: { threadId?: string; message: string }
): Promise<Response> {
  // Create tools with Convex context (for RAG search)
  const contextualTools = createContextualTools(ctx);

  // Create or continue thread
  let currentThreadId = threadId;
  if (!currentThreadId) {
    const { threadId: newThreadId } = await portfolioAgent.createThread(
      ctx,
      {}
    );
    currentThreadId = newThreadId;
  }

  // Continue the thread to get the thread object
  const { thread } = await portfolioAgent.continueThread(ctx, {
    threadId: currentThreadId,
  });

  // Use the Agent's streamText with saveStreamDeltas for persistence
  // This automatically saves messages with reasoning, metadata, etc.
  const result = await thread.streamText(
    {
      prompt: message,
      tools: contextualTools,
    },
    {
      saveStreamDeltas: {
        returnImmediately: true, // Return stream immediately for HTTP response
      },
      // Save all messages including intermediate tool calls
      storageOptions: {
        saveMessages: "all",
      },
    }
  );

  // Create a readable stream to pipe SSE events to the client
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Track state for proper event sequencing
        let hasStartedReasoning = false;
        const activeToolCalls = new Map<string, string>();

        // Iterate over the full stream from the Agent
        for await (const part of result.fullStream) {
          switch (part.type) {
            case "reasoning-start": {
              hasStartedReasoning = true;
              controller.enqueue(
                encoder.encode(formatSSE({ type: "reasoning:start" }))
              );
              break;
            }

            case "reasoning-delta": {
              if (part.text) {
                controller.enqueue(
                  encoder.encode(
                    formatSSE({
                      type: "reasoning:delta",
                      content: part.text,
                    })
                  )
                );
              }
              break;
            }

            case "reasoning-end": {
              hasStartedReasoning = false;
              controller.enqueue(
                encoder.encode(formatSSE({ type: "reasoning:done" }))
              );
              break;
            }

            case "tool-call": {
              // Close reasoning if we were in it
              if (hasStartedReasoning) {
                hasStartedReasoning = false;
                controller.enqueue(
                  encoder.encode(formatSSE({ type: "reasoning:done" }))
                );
              }

              activeToolCalls.set(part.toolCallId, part.toolName);
              controller.enqueue(
                encoder.encode(
                  formatSSE({
                    type: "step:start",
                    step: {
                      type: "tool_call",
                      toolCallId: part.toolCallId,
                      name: part.toolName,
                      args: part.input as Record<string, unknown> | undefined,
                    },
                  })
                )
              );
              break;
            }

            case "tool-result": {
              const toolName =
                activeToolCalls.get(part.toolCallId) || "unknown";
              const resultValue = JSON.stringify(part.output);

              // Extract resultsCount for searchPortfolio
              let resultsCount: number | undefined;
              if (toolName === "searchPortfolio" && part.output) {
                const outputObj = part.output as { resultsCount?: number };
                resultsCount = outputObj.resultsCount;
              }

              controller.enqueue(
                encoder.encode(
                  formatSSE({
                    type: "step:complete",
                    step: {
                      type: "tool_call",
                      toolCallId: part.toolCallId,
                      result: resultValue,
                      resultsCount,
                    },
                  })
                )
              );
              break;
            }

            case "text-delta": {
              // Close reasoning if we were in it
              if (hasStartedReasoning) {
                hasStartedReasoning = false;
                controller.enqueue(
                  encoder.encode(formatSSE({ type: "reasoning:done" }))
                );
              }

              if (part.text) {
                controller.enqueue(
                  encoder.encode(
                    formatSSE({
                      type: "text:delta",
                      content: part.text,
                    })
                  )
                );
              }
              break;
            }

            case "error": {
              console.error("[streamChat] Stream error:", part.error);
              throw part.error || new Error("Unknown stream error");
            }

            // Ignore other event types (start, finish, etc.)
            default:
              break;
          }
        }

        // Stream complete - send done event with thread ID
        controller.enqueue(
          encoder.encode(
            formatSSE({
              type: "text:done",
              threadId: currentThreadId,
            })
          )
        );

        controller.close();
      } catch (error) {
        console.error("[streamChat] Error:", error);
        controller.enqueue(
          encoder.encode(
            formatSSE({
              type: "error",
              message:
                error instanceof Error ? error.message : "An error occurred",
            })
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
