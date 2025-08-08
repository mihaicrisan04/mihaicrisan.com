import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(), // markdown content
    description: v.optional(v.string()),
    date: v.string(), // ISO date string
    status: v.union(v.literal("published"), v.literal("draft")),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_date", ["date"]),
  
  projects: defineTable({
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    fullDescription: v.string(),
    status: v.optional(v.string()),
    category: v.string(),
    featured: v.boolean(),
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()), // ISO date string or null
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
      url: v.string(), // ImageKit URL path
      alt: v.string(),
    })),
    highlights: v.optional(v.array(v.string())),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_status", ["status"]),
});
