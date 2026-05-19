"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

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
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

export function BlogPostItem({ post, index }: BlogPostItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          className="flex items-baseline justify-between border-border/40 border-b py-4"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          transition={{ duration: 0.2 }}
        >
          <span className="flex items-baseline gap-4">
            <time className="font-mono text-muted-foreground text-sm tabular-nums">
              {formatDate(post.date)}
            </time>
            <span className="text-base text-foreground">{post.title}</span>
          </span>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0.5 }}
            className="font-mono text-muted-foreground text-sm"
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
