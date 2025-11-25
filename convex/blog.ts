import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllBlogPosts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

export const getBlogPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("status"), "published"))
      .first();
  },
});

export const getAllBlogSlugs = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    
    return posts.map(post => post.slug);
  },
});

// Alias for ingest compatibility
export const getPublishedPosts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

export const createBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    status: v.union(v.literal("published"), v.literal("draft")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", args);
  },
});
