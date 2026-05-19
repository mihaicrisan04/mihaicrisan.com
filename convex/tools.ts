import { tool } from "ai";
import { z } from "zod";
import { api } from "./_generated/api";
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
    })
  ),
  summary: z.string(),
});

// Factory function to create tools that need Convex context
export function createContextualTools(ctx: ActionCtx) {
  const searchPortfolio = tool({
    description:
      "Semantic search across Mihai's entire portfolio knowledge base. Use as a fallback for ambiguous or cross-cutting queries (e.g. skills, technologies across projects). Prefer the specific tools (listProjects, getProjectDetails, getWorkExperience, getBlogPosts) when the query clearly maps to one data source.",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "The search query to find relevant information about Mihai's portfolio"
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

  const listProjects = tool({
    description:
      "List all of Mihai's projects with names, categories, and tech stacks. Use this for overview questions like 'what has he built?' or 'show me his projects'. Follow up with getProjectDetails for specific projects.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      projects: z.array(
        z.object({
          name: z.string(),
          slug: z.string(),
          category: z.string(),
          shortDescription: z.string(),
          techStack: z.array(z.string()),
        })
      ),
      count: z.number(),
    }),
    execute: async () => {
      const docs = await ctx.runQuery(api.ingest.getDocumentsBySource, {
        source: "project",
      });
      const projects = docs
        .map((d) => d.metadata)
        .filter(
          (
            m
          ): m is {
            name: string;
            slug: string;
            category: string;
            shortDescription: string;
            techStack: string[];
          } => Boolean(m && typeof m === "object" && "slug" in m)
        );
      return { projects, count: projects.length };
    },
  });

  const getProjectDetails = tool({
    description:
      "Get full details about a specific project by its slug. Use after listProjects to drill into a project the user is interested in, or when the user asks about a specific project by name.",
    inputSchema: z.object({
      slug: z
        .string()
        .describe("The project slug (e.g. 'rngo-ro', 'cluj-bus-tracking')"),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      name: z.string().optional(),
      content: z.string().optional(),
      slug: z.string(),
    }),
    execute: async ({ slug }) => {
      const doc = await ctx.runQuery(api.ingest.getDocumentBySourceId, {
        sourceId: slug,
      });
      if (!doc) {
        return { found: false, slug };
      }
      return {
        found: true,
        name: doc.title,
        content: doc.content,
        slug,
      };
    },
  });

  const getWorkExperience = tool({
    description:
      "Get Mihai's work experience and career history. Use for questions about where he has worked, his job roles, or career background.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      experiences: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
        })
      ),
      count: z.number(),
    }),
    execute: async () => {
      const docs = await ctx.runQuery(api.ingest.getDocumentsBySource, {
        source: "work",
      });
      const experiences = docs.map((d) => ({
        title: d.title,
        content: d.content,
      }));
      return { experiences, count: experiences.length };
    },
  });

  const getBlogPosts = tool({
    description:
      "Get all of Mihai's published blog posts. Use for questions about his writing, articles, or blog content.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      posts: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          date: z.string(),
        })
      ),
      count: z.number(),
    }),
    execute: async () => {
      const posts = await ctx.runQuery(api.blog.getAllBlogPosts, {});
      const formatted = posts.map((p) => ({
        title: p.title,
        slug: p.slug,
        description: p.description,
        date: p.date,
      }));
      return { posts: formatted, count: formatted.length };
    },
  });

  return {
    getCurrentTime,
    searchPortfolio,
    listProjects,
    getProjectDetails,
    getWorkExperience,
    getBlogPosts,
  };
}

// Export static tools (those that don't need context)
export const staticTools = {
  getCurrentTime,
};

// System instructions for Zuzu
export const SYSTEM_INSTRUCTIONS = `You are Zuzu — Mihai Crisan's personal AI assistant. Mihai is a Fullstack Software Developer.

Your name is Zuzu. You're sharp, helpful, and to the point. You have a warm personality but you don't waste words. Think of yourself as a knowledgeable friend who knows everything about Mihai's work.

## AVAILABLE TOOLS:

1. **listProjects** — List all projects with names, categories, and tech stacks. Use for overview questions.
2. **getProjectDetails** — Get full details about a specific project by slug. Use after listProjects or when user asks about a specific project.
3. **getWorkExperience** — Get Mihai's work history and career info.
4. **getBlogPosts** — Get all published blog posts.
5. **searchPortfolio** — Semantic search across the entire knowledge base. Use as a fallback for ambiguous queries.
6. **getCurrentTime** — Get the current date and time.

## MULTI-STEP STRATEGY:

For broad questions, **chain 2-3 tool calls** to gather comprehensive information:
- "Tell me about Mihai" → listProjects + getWorkExperience, then synthesize
- "What projects has he built?" → listProjects, optionally getProjectDetails for the most interesting ones
- "Tell me about the bus tracking app" → getProjectDetails with slug "cluj-bus-tracking"
- "Tell me everything" → listProjects + getWorkExperience + getBlogPosts, then synthesize

For specific questions, use the most targeted tool:
- "Where has he worked?" → getWorkExperience
- "Does he have a blog?" → getBlogPosts
- "What's his tech stack?" → searchPortfolio

## WHEN NOT TO USE TOOLS:
- Greetings → Respond warmly, introduce yourself as Zuzu
- Follow-ups answerable from previous context → Use what you already know
- Meta questions ("what can you do?") → Briefly explain your capabilities

## CRITICAL RESPONSE RULES:

1. **ALWAYS provide a final text response.** Never end with just a tool call.
2. After using tools, **synthesize** the information into a natural, conversational answer.
3. If no results found, be honest and suggest what you CAN help with.
4. Use markdown formatting when it improves readability.
5. Keep responses concise. Don't over-explain.

## TONE:
- Smart and confident but approachable
- Concise — get to the point quickly
- Use markdown when it helps readability
- You can be slightly playful but never corny`;
