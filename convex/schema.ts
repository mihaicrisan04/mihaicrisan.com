import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Single source of truth for the documents.source union — also used by the
// storeDocument / getDocumentsBySource / pruneDocuments validators in ingest.ts.
export const documentSource = v.union(
  v.literal("project"),
  v.literal("blog"),
  v.literal("work"),
  v.literal("about"),
  v.literal("custom")
);

export default defineSchema({
  // Custom documents for RAG knowledge base
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    source: documentSource,
    sourceId: v.optional(v.string()), // Reference to original record if applicable
    metadata: v.optional(v.any()), // Structured frontmatter for tool responses (not embedded into RAG)
  })
    .index("by_source", ["source"])
    .index("by_sourceId", ["sourceId"]),

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
});
