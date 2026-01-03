"use client";

import { useQuery } from "convex/react";
import { BlogPostItem } from "@/components/blog-post-item";
import { api } from "@/convex/_generated/api";

export default function BlogPage() {
	const blogPosts = useQuery(api.blog.getAllBlogPosts) || [];

	return (
		<div className="mx-auto max-w-xl px-6">
			<div className="flex min-h-[55vh] flex-col justify-start py-8">
				<div className="mb-4">
					<p className="text-muted-foreground">
						Cool stuff i find on the internet mostly, or thoughts on things.
					</p>
				</div>

				<div className="space-y-3">
					{blogPosts.map((post, index) => (
						<BlogPostItem index={index} key={post.slug} post={post} />
					))}
				</div>
			</div>
		</div>
	);
}
