import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { rag } from "./rag";

// Work experience data (embedded since it's static)
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

// Static project data for RAG ingestion (mirrors MDX content)
const PROJECTS = [
  {
    id: "rngo-ro",
    name: "rngo.ro",
    slug: "rngo-ro",
    shortDescription: "Personal portfolio and blog website",
    fullDescription:
      "A modern personal portfolio and blog website showcasing projects, technical skills, and professional experience. Built with clean design principles and optimized for performance.",
    category: "portfolio",
    techStack: [
      { name: "Next.js", category: "framework" },
      { name: "TypeScript", category: "language" },
      { name: "Tailwind CSS", category: "styling" },
      { name: "Vercel", category: "deployment" },
      { name: "React", category: "frontend" },
    ],
    highlights: [
      "Modern responsive design with dark/light mode support",
      "Built with Next.js 14 and TypeScript for type safety",
      "Optimized for performance and SEO",
      "Clean, minimalist UI focusing on content",
      "Deployed on Vercel with automatic deployments",
    ],
    startDate: "2024-01-01",
    endDate: "2024-02-15",
    status: "completed",
  },
  {
    id: "cluj-bus-tracking",
    name: "Cluj-Napoca Bus Tracking App",
    slug: "cluj-bus-tracking",
    shortDescription:
      "Real-time public transportation tracking for Cluj-Napoca",
    fullDescription:
      "A real-time public transportation tracking application for Cluj-Napoca, focusing on fast data processing and user-friendly features.",
    category: "mobile-app",
    techStack: [
      { name: "Swift", category: "language" },
      { name: "SwiftUI", category: "framework" },
      { name: "TranzyAPI", category: "api" },
      { name: "iOS", category: "platform" },
    ],
    highlights: [
      "Near-instant data updates for bus locations",
      "Efficient network calls and optimized API data handling",
      "Reduced app refresh times significantly",
      "User-friendly interface for public transportation",
      "Real-time tracking of Cluj-Napoca public buses",
    ],
    startDate: "2023-09-01",
    endDate: "2024-01-20",
    status: "completed",
  },
  {
    id: "boccelute",
    name: "Boccelute",
    slug: "boccelute",
    shortDescription: "Full-stack e-commerce website for tote bag sales",
    fullDescription:
      "A full-stack e-commerce website specializing in tote bag sales, overseeing all aspects from database implementation to frontend design.",
    category: "e-commerce",
    techStack: [
      { name: "JavaScript", category: "language" },
      { name: "PHP", category: "backend" },
      { name: "MySQL", category: "database" },
      { name: "HTML/CSS", category: "frontend" },
    ],
    highlights: [
      "Full-stack e-commerce solution from database to frontend",
      "Robust user account management system",
      "Secure encryption of sensitive user data",
      "Seamless user signup and authentication",
      "Complete product catalog and shopping cart functionality",
    ],
    startDate: "2022-06-01",
    endDate: "2023-02-15",
    status: "completed",
  },
  {
    id: "obstruction-game",
    name: "Obstruction Game",
    slug: "obstruction-game",
    shortDescription:
      "Strategic board game with AI opponent using Minimax algorithm",
    fullDescription:
      "Engineered the Obstruction game with a scalable and easily modifiable codebase by employing a layered architecture.",
    category: "game",
    techStack: [
      { name: "Python", category: "language" },
      { name: "PyGame", category: "framework" },
      { name: "Minimax Algorithm", category: "algorithm" },
      { name: "Alpha-Beta Pruning", category: "optimization" },
    ],
    highlights: [
      "Scalable layered architecture for easy modifications",
      "Advanced AI opponent using Minimax algorithm",
      "Alpha-Beta Pruning for efficient AI decision making",
      "Nearly unbeatable AI gaming experience",
      "Clean, modular codebase for future enhancements",
    ],
    startDate: "2023-03-01",
    endDate: "2023-06-15",
    status: "completed",
  },
  {
    id: "medlog-healthcare",
    name: "Medlog - Healthcare Communication Platform",
    slug: "medlog-healthcare",
    shortDescription:
      "Doctor-patient communication and healthcare workflow optimization",
    fullDescription:
      "Led the design and development endeavors in a collaborative team of 5 individuals for the Medlog project.",
    category: "healthcare",
    techStack: [
      { name: "JavaScript", category: "language" },
      { name: "React", category: "framework" },
      { name: "Node.js", category: "backend" },
      { name: "MongoDB", category: "database" },
    ],
    highlights: [
      "50% improvement in user efficiency through navigation optimization",
      "Responsive design for all screen sizes",
      "Streamlined doctor-patient communication",
      "Healthcare workflow optimization",
      "Collaborative team development of 5 members",
    ],
    startDate: "2021-09-01",
    endDate: "2022-06-30",
    status: "completed",
  },
  {
    id: "kindergarten-automation",
    name: "Kindergarten Automation System",
    slug: "kindergarten-automation",
    shortDescription:
      "Google Sheets automation for administrative processes and parent communication",
    fullDescription:
      "Developed a Google Sheets automation system using Apps Script, streamlining report generation.",
    category: "automation",
    techStack: [
      { name: "Google Apps Script", category: "automation" },
      { name: "Google Sheets", category: "platform" },
      { name: "JavaScript", category: "language" },
      { name: "Email Integration", category: "communication" },
    ],
    highlights: [
      "Streamlined report generation and administrative processes",
      "Email newsletter system for parent communication",
      "Digital transition from paper-based reporting",
      "Improved data accuracy and accessibility",
      "Environmentally sustainable practices",
    ],
    startDate: "2023-10-01",
    endDate: "2024-06-30",
    status: "completed",
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

// Ingest all projects into RAG (from static data)
export const ingestProjects = action({
  handler: async (ctx) => {
    let ingested = 0;
    for (const project of PROJECTS) {
      const content = formatProjectForRag(project);

      // Store in documents table
      await ctx.runMutation(api.ingest.storeDocument, {
        title: `Project: ${project.name}`,
        content,
        source: "project",
        sourceId: project.id,
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
  handler: async (
    ctx,
    { title, content }
  ): Promise<{ success: boolean; documentId: string }> => {
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
  handler: async (
    ctx
  ): Promise<{
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
      total:
        projectsResult.ingested + blogResult.ingested + workResult.ingested,
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
  handler: async (
    ctx
  ): Promise<{
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
