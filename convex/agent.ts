import { openai } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { SYSTEM_INSTRUCTIONS, staticTools } from "./tools";

// Portfolio agent using static tools (for non-streaming fallback)
// Note: For full functionality including portfolio search, use the streaming HTTP endpoint
export const portfolioAgent = new Agent(components.agent, {
	name: "Portfolio Assistant",
	languageModel: openai.chat("gpt-4o-mini"),
	instructions: SYSTEM_INSTRUCTIONS,
	tools: staticTools,
	maxSteps: 5,
});
