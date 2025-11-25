"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "motion/react";
import { BackButton } from "@/components/back-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { BlogPostWrapper } from "@/components/blog-post-wrapper";
import { BlogPostSkeleton } from "@/components/blog-post-skeleton";

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
        className="py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-2xl mx-auto px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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
            className="mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {blogPost.title}
            </h1>
            <time className="text-muted-foreground text-sm">
              {formatDate(blogPost.date)}
            </time>
            {blogPost.description && (
              <p className="text-foreground/80 mt-4 text-lg leading-relaxed">
                {blogPost.description}
              </p>
            )}
          </motion.header>

          {/* Blog Post Content */}
          <motion.article
            className="prose dark:prose-invert max-w-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <MarkdownRenderer content={blogPost.content} />
          </motion.article>

          {/* Bottom Spacing */}
          <div className="mt-24"></div>
        </div>
      </motion.div>
    </BlogPostWrapper>
  );
}

// Note: Static generation is not compatible with client components using Convex
// The page will be rendered dynamically
