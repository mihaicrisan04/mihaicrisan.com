import { mutation } from "./_generated/server";

export const addSampleBlogPost = mutation({
	handler: async (ctx) => {
		const blogPost = await ctx.db.insert("blogPosts", {
			title: "Building with Convex",
			slug: "building-with-convex",
			content: `# Building with Convex

Convex is a powerful backend-as-a-service that makes it easy to build real-time applications.

## Key Benefits

- **Real-time updates**: Changes sync instantly across all clients
- **Type safety**: Full TypeScript support with generated types
- **Easy queries**: Simple, powerful query API
- **Serverless**: No infrastructure to manage

## Getting Started

Setting up a Convex backend is straightforward:

\`\`\`typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    content: v.string(),
  }),
});
\`\`\`

## Conclusion

Convex simplifies backend development while providing powerful features for modern applications.`,
			description:
				"An introduction to building applications with Convex backend-as-a-service",
			date: "2024-01-15",
			status: "published",
		});

		return { id: blogPost, message: "Sample blog post added successfully" };
	},
});
