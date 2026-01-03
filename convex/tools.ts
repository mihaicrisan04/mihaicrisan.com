import { tool } from "ai";
import { z } from "zod";
import type { ActionCtx } from "./_generated/server";
import { rag } from "./rag";

// Define output schema for the time tool
const timeOutputSchema = z.object({
	currentTime: z.string(),
	formatted: z.string(),
	timezone: z.string(),
});

// Simple tool to get current time information
export const getCurrentTime = tool({
	description:
		"Gets the current date and time. Use this when the user asks about the current time, date, or when they need time-related information.",
	inputSchema: z.object({}),
	outputSchema: timeOutputSchema,
	execute: (): z.infer<typeof timeOutputSchema> => {
		const now = new Date();
		return {
			currentTime: now.toISOString(),
			formatted: now.toLocaleString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				timeZoneName: "short",
			}),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	},
});

// Define output schema for the portfolio search tool
const portfolioSearchOutputSchema = z.object({
	found: z.boolean(),
	resultsCount: z.number(),
	results: z.array(
		z.object({
			content: z.string(),
			relevance: z.number().optional(),
		}),
	),
	summary: z.string(),
});

// Factory function to create tools that need Convex context
export function createContextualTools(ctx: ActionCtx) {
	const searchPortfolio = tool({
		description: `Search Mihai's portfolio knowledge base for specific information about his projects, skills, work experience, or blog posts.

USE THIS TOOL WHEN:
- User asks about Mihai's projects or what he has built
- User asks about his skills, technologies, or tech stack
- User asks about his work experience or background
- User asks about his blog posts or writings
- User asks specific questions about his portfolio

DO NOT USE THIS TOOL FOR:
- General greetings (hello, hi, how are you)
- Questions about the current time (use getCurrentTime instead)
- Generic questions not related to Mihai's work`,
		inputSchema: z.object({
			query: z
				.string()
				.describe(
					"The search query to find relevant information about Mihai's portfolio",
				),
		}),
		outputSchema: portfolioSearchOutputSchema,
		execute: async ({
			query,
		}): Promise<z.infer<typeof portfolioSearchOutputSchema>> => {
			try {
				const searchResults = await rag.search(ctx, {
					namespace: "portfolio",
					query,
					limit: 5,
				});

				if (searchResults.results.length === 0) {
					return {
						found: false,
						resultsCount: 0,
						results: [],
						summary:
							"No relevant information found in the portfolio knowledge base.",
					};
				}

				const results = searchResults.results.map((result) => ({
					content: result.content.map((c) => c.text).join(" "),
					relevance: result.score,
				}));

				return {
					found: true,
					resultsCount: results.length,
					results,
					summary: `Found ${results.length} relevant result(s) in the portfolio knowledge base.`,
				};
			} catch (error) {
				console.error("Portfolio search error:", error);
				return {
					found: false,
					resultsCount: 0,
					results: [],
					summary: "Unable to search the portfolio at this time.",
				};
			}
		},
	});

	return {
		getCurrentTime,
		searchPortfolio,
	};
}

// Export static tools (those that don't need context)
export const staticTools = {
	getCurrentTime,
};

// System instructions for the portfolio assistant
export const SYSTEM_INSTRUCTIONS = `You are a helpful portfolio assistant for Mihai Crisan, a Fullstack Software Developer.

Your role is to help users learn about Mihai's work, including his projects, skills, experience, and writings.

## AVAILABLE TOOLS:

1. **searchPortfolio**: Search Mihai's knowledge base for information about:
   - His projects and what he has built
   - His technical skills and technologies
   - His work experience and professional background
   - His blog posts and writings

2. **getCurrentTime**: Get the current date and time

## WHEN TO USE TOOLS:

**USE searchPortfolio when:**
- User asks about Mihai's projects ("What has he built?", "Tell me about his projects")
- User asks about skills/technologies ("What technologies does he use?", "What's his tech stack?")
- User asks about experience ("Where has he worked?", "What's his background?")
- User asks about blog posts or writings
- Any specific question about Mihai's portfolio

**USE getCurrentTime when:**
- User asks about the current time or date

**DON'T USE ANY TOOLS when:**
- User says hello, hi, or other greetings → Just respond warmly
- User asks how you are → Respond conversationally
- User asks what you can help with → Explain your capabilities
- User asks a follow-up that you can answer from previous context

## CRITICAL RESPONSE RULES:

1. **ALWAYS provide a final text response.** Never end with just a tool call.

2. **After using searchPortfolio:**
   - If results found: Synthesize the information into a natural, conversational answer
   - If no results: Be honest and suggest what you CAN help with

3. **After using getCurrentTime:**
   - Present the time in a friendly, readable format

4. **For greetings and simple questions:**
   - Respond directly without using tools
   - Be warm and helpful
   - Mention what you can help users learn about Mihai

## TONE:
- Friendly and professional
- Concise but helpful
- Use markdown formatting when it improves readability`;
