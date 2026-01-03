"use client";

import { useQuery } from "convex/react";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import { use } from "react";
import { BackButton } from "@/components/back-button";
import { BlogPostSkeleton } from "@/components/blog-post-skeleton";
import { BlogPostWrapper } from "@/components/blog-post-wrapper";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { api } from "@/convex/_generated/api";

interface BlogPageProps {
	params: Promise<{
		slug: string;
	}>;
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default function BlogPostPage({ params }: BlogPageProps) {
	const { slug } = use(params);
	const blogPost = useQuery(api.blog.getBlogPostBySlug, { slug });

	if (blogPost === undefined) {
		return (
			<BlogPostWrapper>
				<BlogPostSkeleton />
			</BlogPostWrapper>
		);
	}

	if (blogPost === null) {
		notFound();
	}

	return (
		<BlogPostWrapper>
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="py-8"
				exit={{ opacity: 0, y: -10 }}
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
			>
				<div className="mx-auto max-w-2xl px-6">
					{/* Back Button */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 10 }}
						transition={{
							duration: 0.6,
							delay: 0.1,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						<BackButton />
					</motion.div>

					{/* Blog Post Header */}
					<motion.header
						animate={{ opacity: 1, y: 0 }}
						className="mb-12"
						initial={{ opacity: 0, y: 10 }}
						transition={{
							duration: 0.6,
							delay: 0.2,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						<h1 className="mb-4 font-bold text-2xl text-foreground">
							{blogPost.title}
						</h1>
						<time className="text-muted-foreground text-sm">
							{formatDate(blogPost.date)}
						</time>
						{blogPost.description && (
							<p className="mt-4 text-foreground/80 text-lg leading-relaxed">
								{blogPost.description}
							</p>
						)}
					</motion.header>

					{/* Blog Post Content */}
					<motion.article
						animate={{ opacity: 1, y: 0 }}
						className="prose dark:prose-invert max-w-none"
						initial={{ opacity: 0, y: 10 }}
						transition={{
							duration: 0.6,
							delay: 0.35,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						<MarkdownRenderer content={blogPost.content} />
					</motion.article>

					{/* Bottom Spacing */}
					<div className="mt-24" />
				</div>
			</motion.div>
		</BlogPostWrapper>
	);
}

// Note: Static generation is not compatible with client components using Convex
// The page will be rendered dynamically
