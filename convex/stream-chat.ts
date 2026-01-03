import { openai } from "@ai-sdk/openai";
import { stepCountIs, streamText } from "ai";
import type { ActionCtx } from "./_generated/server";
import { createContextualTools, SYSTEM_INSTRUCTIONS } from "./tools";

// Regex for splitting text while preserving whitespace
const WHITESPACE_SPLIT_REGEX = /(\s+)/;

// Event types for the streaming protocol
export type StreamEvent =
  | { type: "step:start"; step: { type: "tool_call"; name: string } }
  | { type: "step:complete"; step: { type: "tool_call"; result: string } }
  | { type: "text:delta"; content: string }
  | { type: "text:done"; threadId: string }
  | { type: "error"; message: string };

// Helper to format SSE data
function formatSSE(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

// Helper to generate a fallback summary when AI doesn't generate text after tool calls
function generateToolResultSummary(
  toolResults: { name: string; result: string }[]
): string {
  const summaries: string[] = [];

  for (const { name, result } of toolResults) {
    try {
      const parsed = JSON.parse(result);

      switch (name) {
        case "getCurrentTime":
          if (parsed.formatted) {
            summaries.push(
              `The current time is **${parsed.formatted}** (${parsed.timezone}).`
            );
          } else {
            summaries.push(`The current time is ${parsed.currentTime}.`);
          }
          break;
        case "searchPortfolio":
          if (parsed.found && parsed.results?.length > 0) {
            const contentSummary = parsed.results
              .slice(0, 3)
              .map((r: { content: string }) => r.content.substring(0, 200))
              .join("\n\n");
            summaries.push(
              `Here's what I found about Mihai:\n\n${contentSummary}`
            );
          } else {
            summaries.push(
              "I couldn't find specific information about that in Mihai's portfolio. Feel free to ask about his projects, skills, or experience!"
            );
          }
          break;
        default:
          summaries.push(`Here's what I found: ${result}`);
      }
    } catch {
      summaries.push(`Here's the result: ${result}`);
    }
  }

  return summaries.join("\n\n");
}

// Main streaming chat function
export function streamChat(
  ctx: ActionCtx,
  { threadId, message }: { threadId?: string; message: string }
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  // Generate a thread ID if not provided (simplified - in production you'd persist this)
  const currentThreadId =
    threadId ||
    `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create tools with access to Convex context (for RAG search)
  const tools = createContextualTools(ctx);

  return new ReadableStream({
    async start(controller) {
      try {
        // Track state for fallback
        let hasReceivedText = false;
        const collectedToolResults: { name: string; result: string }[] = [];
        const activeToolCalls = new Map<string, string>(); // toolCallId -> toolName

        // Stream AI response using fullStream for proper event ordering
        // stopWhen: stepCountIs(2) allows the AI to first call tools, then generate text from results
        // Default is stepCountIs(1) which stops after tool calls without generating text
        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: SYSTEM_INSTRUCTIONS,
          prompt: message,
          tools,
          stopWhen: stepCountIs(2),
        });

        // Use fullStream to get all events in order
        console.log("[streamChat] Starting stream processing");
        for await (const part of result.fullStream) {
          console.log("[streamChat] Received part:", part.type);
          switch (part.type) {
            case "tool-call": {
              // Tool call starting
              console.log("[streamChat] Tool call:", part.toolName);
              activeToolCalls.set(part.toolCallId, part.toolName);
              controller.enqueue(
                encoder.encode(
                  formatSSE({
                    type: "step:start",
                    step: { type: "tool_call", name: part.toolName },
                  })
                )
              );
              break;
            }

            case "tool-result": {
              // Tool call completed
              const toolName =
                activeToolCalls.get(part.toolCallId) || "unknown";
              // AI SDK v5 uses 'output' property for tool results
              const output = (part as { output?: unknown }).output;
              const resultValue = JSON.stringify(output);
              console.log(
                "[streamChat] Tool result for:",
                toolName,
                "output:",
                resultValue?.substring(0, 100)
              );

              collectedToolResults.push({
                name: toolName,
                result: resultValue,
              });

              controller.enqueue(
                encoder.encode(
                  formatSSE({
                    type: "step:complete",
                    step: {
                      type: "tool_call",
                      result: resultValue,
                    },
                  })
                )
              );
              break;
            }

            case "text-delta": {
              // Text streaming - AI SDK v5 uses 'text' property for text-delta
              const textContent = (part as { text?: string }).text;
              console.log(
                "[streamChat] Text delta received:",
                textContent?.substring(0, 50)
              );
              if (textContent) {
                hasReceivedText = true;
                controller.enqueue(
                  encoder.encode(
                    formatSSE({
                      type: "text:delta",
                      content: textContent,
                    })
                  )
                );
              }
              break;
            }

            case "error": {
              console.error("[streamChat] Stream error:", part.error);
              throw part.error;
            }

            case "finish": {
              // Stream finished
              const finishPart = part as {
                finishReason?: string;
                totalUsage?: unknown;
              };
              console.log(
                "[streamChat] Finish event - reason:",
                finishPart.finishReason
              );
              break;
            }

            case "finish-step": {
              // A step finished (tool call or text generation)
              const stepPart = part as {
                finishReason?: string;
                usage?: unknown;
              };
              console.log(
                "[streamChat] Step finished - reason:",
                stepPart.finishReason
              );
              break;
            }

            case "start":
            case "start-step":
            case "text-start":
            case "text-end":
              // These are informational events, log but don't process
              console.log("[streamChat] Info event:", part.type);
              break;

            default: {
              // Log any other event types we might be missing
              console.log(
                "[streamChat] Other part type:",
                (part as { type: string }).type
              );
            }
          }
        }
        console.log(
          "[streamChat] Stream processing complete. hasReceivedText:",
          hasReceivedText,
          "toolResults:",
          collectedToolResults.length
        );

        // Safety fallback: if no text was generated but tools were called, generate a summary
        // Stream it in chunks to simulate natural streaming
        if (!hasReceivedText && collectedToolResults.length > 0) {
          const fallbackMessage =
            generateToolResultSummary(collectedToolResults);
          // Split into words and stream them with small delays for natural feel
          const words = fallbackMessage.split(WHITESPACE_SPLIT_REGEX); // Keep whitespace
          for (const word of words) {
            if (word) {
              controller.enqueue(
                encoder.encode(
                  formatSSE({
                    type: "text:delta",
                    content: word,
                  })
                )
              );
            }
          }
        }

        // Stream complete
        console.log("[streamChat] Sending text:done event");
        controller.enqueue(
          encoder.encode(
            formatSSE({
              type: "text:done",
              threadId: currentThreadId,
            })
          )
        );

        // Small delay to ensure all events are flushed to the client
        await new Promise((resolve) => setTimeout(resolve, 50));
        console.log("[streamChat] Closing controller");
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
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
}
