import { Agent } from "@convex-dev/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { components } from "./_generated/api";
import { SYSTEM_INSTRUCTIONS, staticTools } from "./tools";

// Configure OpenRouter with reasoning support
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Model configuration - using Gemini Flash 2.0 with reasoning capabilities
const MODEL_ID = "google/gemini-2.0-flash-001";

// Portfolio agent with reasoning-capable model
// Uses Gemini Flash 2.0 for fast responses with good reasoning
export const portfolioAgent = new Agent(components.agent, {
  name: "Portfolio Assistant",
  languageModel: openrouter.chat(MODEL_ID),
  instructions: SYSTEM_INSTRUCTIONS,
  tools: staticTools,
  maxSteps: 5,
  // Provider options for reasoning (applied to all generations)
  providerOptions: {
    openrouter: {
      reasoning: {
        effort: "medium", // Balance between speed and reasoning quality
      },
    },
  },
});
