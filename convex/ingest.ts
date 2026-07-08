import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

// RAG embedding disabled for now — the AI chat is paused and the OpenAI
// account behind OPENAI_API_KEY is inactive, which made rag.add crash the
// postbuild ingest (and with it every Vercel deploy). Re-enable the
// commented rag.add calls below once the key is funded again.
// import { rag } from "./rag";

// Work experience data (static — not yet sourced from MDX)
const WORK_EXPERIENCE = [
  {
    id: "wolfpack-digital",
    company: "WolfPack Digital",
    companyUrl: "https://wolfpack-digital.com",
    position: "Fullstack Software Developer",
    startDate: "2025-07-01",
    endDate: null,
    description:
      "Building scalable web applications with deep focus on design and user experience.",
    current: true,
  },
  {
    id: "fullstack-developer",
    company: "Freelance",
    companyUrl: undefined,
    position: "Fullstack Software Developer",
    startDate: "2024-12-01",
    endDate: null,
    description:
      "Developed web applications for various clients, focusing on building scalable and efficient solutions.",
    current: false,
  },
];

// Shape of a project payload sent in by the ingest script
const projectPayload = v.object({
  slug: v.string(),
  name: v.string(),
  shortDescription: v.string(),
  fullDescription: v.optional(v.string()),
  category: v.string(),
  status: v.optional(v.string()),
  startDate: v.string(),
  endDate: v.optional(v.string()),
  techStack: v.array(v.object({ name: v.string(), category: v.string() })),
  highlights: v.optional(v.array(v.string())),
  body: v.string(),
});

// Format a project into a single string that gets embedded into RAG
function formatProjectForRag(project: {
  name: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  techStack: { name: string; category: string }[];
  highlights?: string[];
  startDate: string;
  endDate?: string;
  status?: string;
  body: string;
}): string {
  const techNames = project.techStack.map((t) => t.name).join(", ");
  const highlights = project.highlights?.length
    ? `\nKey highlights:\n${project.highlights.map((h) => `- ${h}`).join("\n")}`
    : "";
  const status = project.status ? ` (${project.status})` : "";
  const fullDescription = project.fullDescription
    ? `\n${project.fullDescription}\n`
    : "";
  const body = project.body.trim() ? `\n\nFull writeup:\n${project.body}` : "";

  return `Project: ${project.name}${status}
Category: ${project.category}
Description: ${project.shortDescription}
${fullDescription}
Technologies used: ${techNames}${highlights}

Timeline: ${project.startDate}${project.endDate ? ` to ${project.endDate}` : " (ongoing)"}${body}`;
}

function formatBlogPostForRag(post: {
  title: string;
  content: string;
  description?: string;
  date: string;
}): string {
  return `Blog Post: ${post.title}
Date: ${post.date}
${post.description ? `Summary: ${post.description}\n` : ""}
Content:
${post.content}`;
}

function formatWorkExperienceForRag(work: {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}): string {
  const dateRange = work.endDate
    ? `${work.startDate} to ${work.endDate}`
    : `${work.startDate} to present`;
  const status = work.current ? " (Current Position)" : "";

  return `Work Experience: ${work.position} at ${work.company}${status}
Duration: ${dateRange}
Description: ${work.description}`;
}

// Store (or update) a document in the documents table
export const storeDocument = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    source: v.union(
      v.literal("project"),
      v.literal("blog"),
      v.literal("work"),
      v.literal("custom")
    ),
    sourceId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    if (args.sourceId) {
      const existing = await ctx.db
        .query("documents")
        .withIndex("by_sourceId", (q) => q.eq("sourceId", args.sourceId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          title: args.title,
          content: args.content,
          metadata: args.metadata,
        });
        return existing._id;
      }
    }

    return await ctx.db.insert("documents", args);
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const getAllDocuments = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

export const getDocumentBySourceId = query({
  args: { sourceId: v.string() },
  handler: async (ctx, { sourceId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_sourceId", (q) => q.eq("sourceId", sourceId))
      .first();
  },
});

export const getDocumentsBySource = query({
  args: {
    source: v.union(
      v.literal("project"),
      v.literal("blog"),
      v.literal("work"),
      v.literal("custom")
    ),
  },
  handler: async (ctx, { source }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_source", (q) => q.eq("source", source))
      .collect();
  },
});

// Ingest projects passed in from the local script (reads MDX, sends here).
// MDX is the single source of truth — this is just a derived index.
export const ingestProjects = action({
  args: { projects: v.array(projectPayload) },
  handler: async (ctx, { projects }) => {
    let ingested = 0;

    for (const project of projects) {
      const content = formatProjectForRag(project);
      const metadata = {
        name: project.name,
        slug: project.slug,
        category: project.category,
        shortDescription: project.shortDescription,
        techStack: project.techStack.map((t) => t.name),
      };

      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Project: ${project.name}`,
        content,
        source: "project",
        sourceId: project.slug,
        metadata,
      });

      // await rag.add(ctx, {
      //   namespace: "portfolio",
      //   key: `project:${project.slug}`,
      //   text: content,
      //   title: `Project: ${project.name}`,
      // });

      ingested++;
    }

    return { ingested, type: "projects" };
  },
});

export const ingestBlogPosts = action({
  handler: async (ctx) => {
    const posts = await ctx.runQuery(api.blog.getPublishedPosts, {});

    let ingested = 0;
    for (const post of posts) {
      const content = formatBlogPostForRag(post);

      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Blog: ${post.title}`,
        content,
        source: "blog",
        sourceId: post._id,
      });

      // await rag.add(ctx, {
      //   namespace: "portfolio",
      //   key: `blog:${post.slug}`,
      //   text: content,
      //   title: `Blog: ${post.title}`,
      // });

      ingested++;
    }

    return { ingested, type: "blog" };
  },
});

export const ingestWorkExperience = action({
  handler: async (ctx) => {
    let ingested = 0;

    for (const work of WORK_EXPERIENCE) {
      const content = formatWorkExperienceForRag(work);

      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Work: ${work.position} at ${work.company}`,
        content,
        source: "work",
        sourceId: work.id,
      });

      // await rag.add(ctx, {
      //   namespace: "portfolio",
      //   key: `work:${work.id}`,
      //   text: content,
      //   title: `Work: ${work.position} at ${work.company}`,
      // });

      ingested++;
    }

    return { ingested, type: "work" };
  },
});

export const ingestCustomContent = action({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (
    ctx,
    { title, content }
  ): Promise<{ success: boolean; documentId: string }> => {
    const key = `custom:${Date.now()}`;

    const docId = await ctx.runMutation(api.ingest.storeDocument, {
      title,
      content,
      source: "custom" as const,
      sourceId: key,
    });

    // await rag.add(ctx, {
    //   namespace: "portfolio",
    //   key,
    //   text: `${title}\n\n${content}`,
    //   title,
    // });

    return { success: true, documentId: docId as string };
  },
});
