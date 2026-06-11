"use node";

import { ConvexError, v } from "convex/values";
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

    try {
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
    } catch (err) {
      // ConvexError survives prod redaction, so the client can tell rate
      // limits apart from real failures
      const message = err instanceof Error ? err.message : String(err);
      if (/429|rate.?limit/i.test(message)) {
        throw new ConvexError({ code: "rate_limited" });
      }
      throw err;
    }
  },
});
