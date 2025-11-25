import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { portfolioAgent } from "./agent";
import { rag } from "./rag";

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
    // Create thread if not provided
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const result = await portfolioAgent.createThread(ctx, {});
      currentThreadId = result.threadId;
    }

    // Search RAG for relevant context
    let contextText = "";
    try {
      const searchResults = await rag.search(ctx, {
        namespace: "portfolio",
        query: message,
        limit: 5,
      });

      // Build context from search results
      if (searchResults.results.length > 0) {
        contextText = searchResults.results
          .map((result, i) => {
            // Each result has content array with text items
            const text = result.content.map(c => c.text).join(" ");
            return `[${i + 1}] ${text}`;
          })
          .join("\n\n");
      }
    } catch (error) {
      // RAG might be empty, continue without context
      console.log("RAG search failed, continuing without context:", error);
    }

    // Get the thread and generate response with context
    const { thread } = await portfolioAgent.continueThread(ctx, {
      threadId: currentThreadId,
    });

    // Generate response with context
    const promptWithContext = contextText
      ? `Relevant information from the knowledge base:\n${contextText}\n\nUser question: ${message}`
      : message;

    const result = await thread.generateText({
      prompt: promptWithContext,
    });

    return {
      threadId: currentThreadId,
      text: result.text,
    };
  },
});
