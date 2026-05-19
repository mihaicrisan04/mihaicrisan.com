"use client";

import { useQuery } from "convex/react";
import { BlogPostItem } from "@/components/blog-post-item";
import { PageBack } from "@/components/page-back";
import { api } from "@/convex/_generated/api";

export default function BlogPage() {
  const blogPosts = useQuery(api.blog.getAllBlogPosts);

  return (
    <div className="mx-auto max-w-xl px-6 pt-12 pb-24">
      <div className="mb-12 flex items-center justify-between">
        <PageBack />
        <span className="font-mono text-muted-foreground/50 text-xs tabular-nums">
          {blogPosts ? String(blogPosts.length).padStart(2, "0") : ""}
        </span>
      </div>

      <header className="mb-10">
        <h1 className="mb-3 font-medium text-foreground text-lg tracking-tight">
          blog
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          notes, things i find, occasional rants.
        </p>
      </header>

      {blogPosts && blogPosts.length > 0 && (
        <div className="border-border/40 border-t">
          {blogPosts.map((post, index) => (
            <BlogPostItem index={index} key={post.slug} post={post} />
          ))}
        </div>
      )}
      {blogPosts && blogPosts.length === 0 && (
        <p className="font-mono text-muted-foreground/60 text-sm">empty.</p>
      )}
    </div>
  );
}
