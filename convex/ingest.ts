import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { rag } from "./rag";
import { api } from "./_generated/api";

// Work experience data (embedded since it's static)
const WORK_EXPERIENCE = [
  {
    id: "wolfpack-digital",
    company: "WolfPack Digital",
    position: "Fullstack Software Developer",
    startDate: "2025-07-01",
    endDate: null,
    description: "Building scalable web applications with deep focus on design and user experience.",
    current: true,
  },
  {
    id: "fullstack-developer",
    company: "Freelance",
    position: "Fullstack Software Developer",
    startDate: "2024-12-01",
    endDate: null,
    description: "Developed web applications for various clients, focusing on building scalable and efficient solutions.",
    current: false,
  },
];

// Helper to format project for RAG
function formatProjectForRag(project: {
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  techStack: { name: string; category: string }[];
  highlights?: string[];
  startDate: string;
  endDate?: string;
  status?: string;
}): string {
  const techNames = project.techStack.map((t) => t.name).join(", ");
  const highlights = project.highlights?.length
    ? `\nKey highlights:\n${project.highlights.map((h) => `- ${h}`).join("\n")}`
    : "";
  const status = project.status ? ` (${project.status})` : "";
  
  return `Project: ${project.name}${status}
Category: ${project.category}
Description: ${project.shortDescription}

${project.fullDescription}

Technologies used: ${techNames}${highlights}

Timeline: ${project.startDate}${project.endDate ? ` to ${project.endDate}` : " (ongoing)"}`;
}

// Helper to format blog post for RAG
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

// Helper to format work experience for RAG
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

// Store a document in the documents table
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
  },
  handler: async (ctx, args) => {
    // Check if document with same sourceId already exists
    if (args.sourceId) {
      const existing = await ctx.db
        .query("documents")
        .withIndex("by_sourceId", (q) => q.eq("sourceId", args.sourceId))
        .first();
      
      if (existing) {
        // Update existing document
        await ctx.db.patch(existing._id, {
          title: args.title,
          content: args.content,
        });
        return existing._id;
      }
    }
    
    // Create new document
    return await ctx.db.insert("documents", args);
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Get all documents
export const getAllDocuments = query({
  handler: async (ctx) => {
    return await ctx.db.query("documents").collect();
  },
});

// Get documents by source
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

// Ingest all projects into RAG
export const ingestProjects = action({
  handler: async (ctx) => {
    // Get all projects from database
    const projects = await ctx.runQuery(api.projects.getAllProjects, {});
    
    let ingested = 0;
    for (const project of projects) {
      const content = formatProjectForRag(project);
      
      // Store in documents table
      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Project: ${project.name}`,
        content,
        source: "project",
        sourceId: project._id,
      });
      
      // Add to RAG
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

// Ingest all blog posts into RAG
export const ingestBlogPosts = action({
  handler: async (ctx) => {
    // Get all published blog posts
    const posts = await ctx.runQuery(api.blog.getPublishedPosts, {});
    
    let ingested = 0;
    for (const post of posts) {
      const content = formatBlogPostForRag(post);
      
      // Store in documents table
      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Blog: ${post.title}`,
        content,
        source: "blog",
        sourceId: post._id,
      });
      
      // Add to RAG
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

// Ingest work experience into RAG
export const ingestWorkExperience = action({
  handler: async (ctx) => {
    let ingested = 0;
    
    for (const work of WORK_EXPERIENCE) {
      const content = formatWorkExperienceForRag(work);
      
      // Store in documents table
      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Work: ${work.position} at ${work.company}`,
        content,
        source: "work",
        sourceId: work.id,
      });
      
      // Add to RAG
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

// Ingest custom content into RAG
export const ingestCustomContent = action({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { title, content }): Promise<{ success: boolean; documentId: string }> => {
    const key = `custom:${Date.now()}`;
    
    // Store in documents table
    const docId = await ctx.runMutation(api.ingest.storeDocument, {
      title,
      content,
      source: "custom" as const,
      sourceId: key,
    });
    
    // Add to RAG
    await rag.add(ctx, {
      namespace: "portfolio",
      key,
      text: `${title}\n\n${content}`,
      title,
    });
    
    return { success: true, documentId: docId as string };
  },
});

// Ingest all data sources at once
export const ingestAll = action({
  handler: async (ctx): Promise<{
    total: number;
    breakdown: {
      projects: { ingested: number; type: string };
      blog: { ingested: number; type: string };
      work: { ingested: number; type: string };
    };
  }> => {
    const projectsResult = await ctx.runAction(api.ingest.ingestProjects, {});
    const blogResult = await ctx.runAction(api.ingest.ingestBlogPosts, {});
    const workResult = await ctx.runAction(api.ingest.ingestWorkExperience, {});
    
    return {
      total: projectsResult.ingested + blogResult.ingested + workResult.ingested,
      breakdown: {
        projects: projectsResult,
        blog: blogResult,
        work: workResult,
      },
    };
  },
});

// Clear all RAG data and re-ingest
export const refreshAllData = action({
  handler: async (ctx): Promise<{
    total: number;
    breakdown: {
      projects: { ingested: number; type: string };
      blog: { ingested: number; type: string };
      work: { ingested: number; type: string };
    };
  }> => {
    // Note: This will add new versions but the old versions will still exist
    // For a full refresh, you'd need to clear the RAG storage first
    const result = await ctx.runAction(api.ingest.ingestAll, {});
    return result;
  },
});
