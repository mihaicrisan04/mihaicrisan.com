import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { rag } from "./rag";
import { documentSource } from "./schema";

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
  ongoing: v.optional(v.boolean()),
  featured: v.optional(v.boolean()),
  website: v.optional(v.string()),
  links: v.optional(
    v.array(v.object({ name: v.string(), url: v.string(), type: v.string() }))
  ),
  techStack: v.array(v.object({ name: v.string(), category: v.string() })),
  highlights: v.optional(v.array(v.string())),
  body: v.string(),
});

// Shape of a work experience entry sent in by the ingest script
// (source of truth: content/knowledge/work-experience.ts)
const workExperiencePayload = v.object({
  id: v.string(),
  company: v.string(),
  companyUrl: v.optional(v.string()),
  position: v.string(),
  startDate: v.string(),
  endDate: v.union(v.string(), v.null()),
  description: v.string(),
  current: v.boolean(),
});

// Format a project into a single string that gets embedded into RAG
function formatProjectForRag(project: {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  category: string;
  techStack: { name: string; category: string }[];
  highlights?: string[];
  startDate: string;
  endDate?: string;
  ongoing?: boolean;
  status?: string;
  website?: string;
  links?: { name: string; url: string; type: string }[];
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

  let timeline = project.startDate;
  if (project.endDate) {
    timeline = `${project.startDate} to ${project.endDate}`;
  } else if (project.ongoing) {
    timeline = `${project.startDate} (ongoing)`;
  } else if (project.status === "in-progress") {
    timeline = `${project.startDate} (in progress)`;
  }

  const linkLines = [`project page: /work/${project.slug}`];
  if (project.website) {
    linkLines.push(`website: ${project.website}`);
  }
  for (const link of project.links ?? []) {
    linkLines.push(`${link.type}: ${link.url}`);
  }
  const links = `\nLinks:\n${linkLines.join("\n")}`;

  return `Project: ${project.name}${status}
Category: ${project.category}
Description: ${project.shortDescription}
${fullDescription}
Technologies used: ${techNames}${highlights}

Timeline: ${timeline}
${links}${body}`;
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
  companyUrl?: string;
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
  const companyUrl = work.companyUrl
    ? `\nCompany website: ${work.companyUrl}`
    : "";

  return `Work Experience: ${work.position} at ${work.company}${status}
Duration: ${dateRange}${companyUrl}
Description: ${work.description}`;
}

// Store (or update) a document in the documents table
export const storeDocument = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    source: documentSource,
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
    source: documentSource,
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
        ...(project.website ? { website: project.website } : {}),
        ...(project.links?.length ? { links: project.links } : {}),
      };

      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Project: ${project.name}`,
        content,
        source: "project",
        sourceId: project.slug,
        metadata,
      });

      await rag.add(ctx, {
        namespace: "portfolio",
        key: `project:${project.slug}`,
        text: content,
        title: `Project: ${project.name}`,
      });

      ingested++;
    }

    return { ingested, type: "projects" };
  },
});

export const ingestBlogPosts = action({
  handler: async (ctx) => {
    const posts = await ctx.runQuery(api.blog.getAllBlogPosts, {});

    let ingested = 0;
    for (const post of posts) {
      const content = formatBlogPostForRag(post);

      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Blog: ${post.title}`,
        content,
        source: "blog",
        sourceId: post._id,
      });

      await rag.add(ctx, {
        namespace: "portfolio",
        key: `blog:${post.slug}`,
        text: content,
        title: `Blog: ${post.title}`,
      });

      ingested++;
    }

    return { ingested, type: "blog" };
  },
});

export const ingestWorkExperience = action({
  args: { entries: v.array(workExperiencePayload) },
  handler: async (ctx, { entries }) => {
    let ingested = 0;

    for (const work of entries) {
      const content = formatWorkExperienceForRag(work);

      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Work: ${work.position} at ${work.company}`,
        content,
        source: "work",
        sourceId: work.id,
      });

      await rag.add(ctx, {
        namespace: "portfolio",
        key: `work:${work.id}`,
        text: content,
        title: `Work: ${work.position} at ${work.company}`,
      });

      ingested++;
    }

    return { ingested, type: "work" };
  },
});

// Knowledge docs (about + setup), sent in by the ingest script.
// Keys double as sourceIds — deterministic, so re-ingest is idempotent.
export const ingestKnowledge = action({
  args: {
    docs: v.array(
      v.object({
        key: v.union(v.literal("about:me"), v.literal("about:setup")),
        title: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, { docs }) => {
    let ingested = 0;

    for (const doc of docs) {
      await ctx.runMutation(api.ingest.storeDocument, {
        title: doc.title,
        content: doc.content,
        source: "about",
        sourceId: doc.key,
      });

      await rag.add(ctx, {
        namespace: "portfolio",
        key: doc.key,
        text: doc.content,
        title: doc.title,
      });

      ingested++;
    }

    return { ingested, type: "about" };
  },
});

// Dashboard-only escape hatch for one-off content. `key` is an explicit,
// unprefixed identifier (e.g. "faq") so re-running with the same key upserts
// instead of piling up `custom:<timestamp>` duplicates.
export const ingestCustomContent = action({
  args: {
    key: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (
    ctx,
    { key, title, content }
  ): Promise<{ success: boolean; documentId: string }> => {
    const sourceId = `custom:${key}`;

    const docId = await ctx.runMutation(api.ingest.storeDocument, {
      title,
      content,
      source: "custom" as const,
      sourceId,
    });

    await rag.add(ctx, {
      namespace: "portfolio",
      key: sourceId,
      text: `${title}\n\n${content}`,
      title,
    });

    return { success: true, documentId: docId as string };
  },
});
