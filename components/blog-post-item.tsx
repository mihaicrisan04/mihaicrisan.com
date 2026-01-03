"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  date: string;
}

interface BlogPostItemProps {
  post: BlogPost;
  index: number;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostItem({ post, index }: BlogPostItemProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <motion.div
          className="group -mx-2 flex cursor-pointer items-center justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50"
          transition={{ duration: 0.2 }}
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm transition-colors hover:text-foreground">
              {post.title}
            </span>
            <time className="text-muted-foreground text-xs">
              {formatDate(post.date)}
            </time>
          </div>
          <motion.svg
            aria-label="Go to post"
            className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
            fill="none"
            role="img"
            stroke="currentColor"
            transition={{ duration: 0.2 }}
            viewBox="0 0 24 24"
            whileHover={{ x: 4 }}
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </motion.svg>
        </motion.div>
      </Link>
    </motion.div>
  );
}
