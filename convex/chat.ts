import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { portfolioAgent } from "./agent";
import { rag } from "./rag";

// Step types for chain of thought UI
export type ChatStep =
  | { type: "rag_search"; query: string; resultsCount: number }
  | { type: "tool_call"; name: string; result?: string };

// Create a new conversation thread
export const createThread = mutation({
  args: {},
  handler: async (ctx) => {
    const { threadId } = await portfolioAgent.createThread(ctx, {});
    return { threadId };
  },
});

// Chat action - creates thread if needed and generates response
export const chat = action({
  args: {
    threadId: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, { threadId, message }) => {
    // Track steps for chain of thought UI
    const steps: ChatStep[] = [];

    // Create thread if not provided
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const result = await portfolioAgent.createThread(ctx, {});
      currentThreadId = result.threadId;
    }

    // Search RAG for relevant context
    let contextText = "";
    let ragResultsCount = 0;
    try {
      const searchResults = await rag.search(ctx, {
        namespace: "portfolio",
        query: message,
        limit: 5,
      });

      ragResultsCount = searchResults.results.length;

      // Build context from search results
      if (searchResults.results.length > 0) {
        contextText = searchResults.results
          .map((result, i) => {
            // Each result has content array with text items
            const text = result.content.map((c) => c.text).join(" ");
            return `[${i + 1}] ${text}`;
          })
          .join("\n\n");
      }

      // Add RAG search step
      steps.push({
        type: "rag_search",
        query: message,
        resultsCount: ragResultsCount,
      });
    } catch (error) {
      // RAG might be empty, continue without context
      console.log("RAG search failed, continuing without context:", error);
      // Still add the step to show it was attempted
      steps.push({
        type: "rag_search",
        query: message,
        resultsCount: 0,
      });
    }

    // Get the thread and generate response with context
    const { thread } = await portfolioAgent.continueThread(ctx, {
      threadId: currentThreadId,
    });

    // Generate response with context
    const promptWithContext = contextText
      ? `Relevant information from the knowledge base:\n${contextText}\n\nUser question: ${message}`
      : message;

    const result = await thread.generateText(
      {
        prompt: promptWithContext,
      },
      {}
    );

    // Extract tool calls from the result steps if any
    if (result.steps && result.steps.length > 0) {
      for (const step of result.steps) {
        if (step.toolCalls && step.toolCalls.length > 0) {
          for (const toolCall of step.toolCalls) {
            // Find matching tool result
            const matchingResult = step.toolResults?.find(
              (r: { toolCallId: string }) =>
                r.toolCallId === toolCall.toolCallId
            );

            steps.push({
              type: "tool_call",
              name: toolCall.toolName,
              result: matchingResult
                ? JSON.stringify(
                    (matchingResult as { output?: unknown }).output ??
                      matchingResult
                  )
                : undefined,
            });
          }
        }
      }
    }

    return {
      threadId: currentThreadId,
      text: result.text,
      steps,
    };
  },
});
