"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { portfolioAgent } from "./agent";
import { createContextualTools } from "./tools";

export const sendMessage = action({
  args: {
    threadId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const contextualTools = createContextualTools(ctx);

    const { thread } = await portfolioAgent.continueThread(ctx, {
      threadId: args.threadId,
    });

    const result = await thread.streamText(
      {
        prompt: args.message,
        tools: contextualTools,
      },
      {
        saveStreamDeltas: {
          chunking: "word",
          throttleMs: 50,
        },
      }
    );
    await result.consumeStream();
  },
});
