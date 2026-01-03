import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// Custom documents for RAG knowledge base
	documents: defineTable({
		title: v.string(),
		content: v.string(),
		source: v.union(
			v.literal("project"),
			v.literal("blog"),
			v.literal("work"),
			v.literal("custom"),
		),
		sourceId: v.optional(v.string()), // Reference to original record if applicable
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
