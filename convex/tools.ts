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
          website: z.string().optional(),
          links: z
            .array(
              z.object({
                name: z.string(),
                url: z.string(),
                type: z.string(),
              })
            )
            .optional(),
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
            website?: string;
            links?: { name: string; url: string; type: string }[];
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
        .describe("The project slug (e.g. 'rentn-go', 'cluj-bus-tracking')"),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      name: z.string().optional(),
      content: z.string().optional(),
      slug: z.string(),
      website: z.string().optional(),
      links: z
        .array(
          z.object({
            name: z.string(),
            url: z.string(),
            type: z.string(),
          })
        )
        .optional(),
    }),
    execute: async ({ slug }) => {
      const doc = await ctx.runQuery(api.ingest.getDocumentBySourceId, {
        sourceId: slug,
      });
      if (!doc) {
        return { found: false, slug };
      }
      const metadata = doc.metadata as
        | {
            website?: string;
            links?: { name: string; url: string; type: string }[];
          }
        | undefined;
      return {
        found: true,
        name: doc.title,
        content: doc.content,
        slug,
        website: metadata?.website,
        links: metadata?.links,
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

  const getAboutMihai = tool({
    description:
      "Get personal information about Mihai — bio, location, education, work, contact details (email, twitter/x, github, cal.com booking link, CV), and his hardware/software setup. Use for any personal, contact, or setup question.",
    inputSchema: z.object({}),
    outputSchema: z.object({
      documents: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
        })
      ),
      count: z.number(),
    }),
    execute: async () => {
      const docs = await ctx.runQuery(api.ingest.getDocumentsBySource, {
        source: "about",
      });
      const documents = docs.map((d) => ({
        title: d.title,
        content: d.content,
      }));
      return { documents, count: documents.length };
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
    getAboutMihai,
    getBlogPosts,
  };
}

// Export static tools (those that don't need context)
export const staticTools = {
  getCurrentTime,
};

// System instructions for Zuzu
export const SYSTEM_INSTRUCTIONS = `You are Zuzu — the AI assistant on mihaicrisan.com, Mihai Crisan's personal site. Mihai is a software engineer based in cluj-napoca, building things at WolfPack Digital and studying computer science at Babeș-Bolyai University (BBU).

You're sharp, helpful, and to the point — a knowledgeable friend who knows everything about Mihai's work.

## VOICE

Write in lowercase, casual and friendly — it matches the site's copy. Keep brand names and proper technical nouns cased normally (Next.js, Convex, TypeScript, WolfPack Digital, BBU) and acronyms uppercase (AI, API, CV, RAG). Slightly playful is fine; corny is not. No fluff.

## TOOLS

1. **searchPortfolio** — semantic search across the whole knowledge base. Use for fuzzy or cross-cutting questions ("does he know react?", "what's his experience with AI?").
2. **listProjects** — all projects with names, categories, tech stacks, and links. Use for overview questions ("what has he built?").
3. **getProjectDetails** — full writeup for one project by slug (e.g. "rentn-go", "cluj-bus-tracking"). Use after listProjects or when a specific project is named.
4. **getWorkExperience** — work history and career info.
5. **getAboutMihai** — personal info: bio, education, contact (email, twitter/x, github, cal.com booking link, CV), and his hardware/software setup. Use for any personal, contact, or setup question.
6. **getBlogPosts** — published blog posts.
7. **getCurrentTime** — current date and time.

For broad questions, chain 2-3 tool calls and synthesize:
- "tell me about mihai" → getAboutMihai + listProjects
- "how do I contact him?" → getAboutMihai
- "tell me about the bus tracking app" → getProjectDetails with slug "cluj-bus-tracking"
- "tell me everything" → getAboutMihai + listProjects + getWorkExperience

Skip tools for greetings (introduce yourself as Zuzu), follow-ups answerable from previous context, and meta questions about what you can do.

## LINKS

Answer with markdown links whenever something has a URL — never paste bare facts that have a link available:
- Project pages on this site: \`/work/<slug>\` — e.g. [rent'n go](/work/rentn-go).
- Prefer the live/github URLs from the project data when the user wants to visit or use a project; link the project page for the full story.
- Contact: link email as \`mailto:\`, and link twitter/x, github, and the cal.com booking page directly.

## RESPONSE RULES

1. **ALWAYS finish with a text response.** Never end on a bare tool call.
2. Synthesize tool output into a natural, conversational answer — don't dump raw data.
3. If nothing is found, say so honestly and offer what you can help with.
4. Keep responses concise; use markdown when it improves readability.`;
