"use client";

import { useQuery } from "convex/react";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import { use } from "react";
import { BlogPostSkeleton } from "@/components/blog-post-skeleton";
import { BlogPostWrapper } from "@/components/blog-post-wrapper";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PageBack } from "@/components/page-back";
import { api } from "@/convex/_generated/api";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
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
        className="mx-auto max-w-2xl px-6 pt-12 pb-24"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-12">
          <PageBack href="/blog" label="blog" />
        </div>

        <header className="mb-12 border-border/40 border-b pb-8">
          <time className="block font-mono text-muted-foreground text-sm">
            {formatDate(blogPost.date)}
          </time>
          <h1 className="mt-3 mb-3 font-medium text-foreground text-lg tracking-tight">
            {blogPost.title}
          </h1>
          {blogPost.description && (
            <p className="text-base text-foreground/85 leading-relaxed">
              {blogPost.description}
            </p>
          )}
        </header>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <MarkdownRenderer content={blogPost.content} />
        </article>
      </motion.div>
    </BlogPostWrapper>
  );
}
