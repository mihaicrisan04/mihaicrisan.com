import { Agent } from "@convex-dev/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { components } from "./_generated/api";
import { mutation } from "./_generated/server";
import { SYSTEM_INSTRUCTIONS, staticTools } from "./tools";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL_ID = "google/gemini-2.5-flash";

export const portfolioAgent = new Agent(components.agent, {
  name: "Portfolio Assistant",
  languageModel: openrouter.chat(MODEL_ID),
  instructions: SYSTEM_INSTRUCTIONS,
  tools: staticTools,
  maxSteps: 10,
  providerOptions: {
    openrouter: {
      reasoning: {
        effort: "medium",
      },
    },
  },
});

export const createThread = mutation({
  args: {},
  handler: async (ctx) => {
    const { threadId } = await portfolioAgent.createThread(ctx, {});
    return { threadId };
  },
});
