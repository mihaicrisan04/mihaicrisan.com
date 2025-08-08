import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .order("desc")
      .collect();
  },
});

export const getFeaturedProjects = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .collect();
  },
});

export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getAllProjectSlugs = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .collect();
    
    return projects.map(project => project.slug);
  },
});

export const getProjectsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

export const createProject = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    status: v.optional(v.string()),
    category: v.string(),
    featured: v.boolean(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    techStack: v.array(v.object({
      name: v.string(),
      category: v.string(),
    })),
    links: v.array(v.object({
      name: v.string(),
      url: v.string(),
      type: v.string(),
    })),
    images: v.array(v.object({
      url: v.string(),
      alt: v.string(),
    })),
    highlights: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", args);
  },
});
