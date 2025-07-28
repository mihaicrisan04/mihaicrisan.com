"use client"

import { motion } from "motion/react"
import Link from "next/link"

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
}

interface BlogPostItemProps {
  post: BlogPost
  index: number
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function BlogPostItem({ post, index }: BlogPostItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <motion.article
          className="group hover:bg-muted/50 -mx-2 px-2 py-3 rounded transition-colors cursor-pointer"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-base font-medium text-foreground group-hover:text-foreground transition-colors mb-1">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                {post.description}
              </p>
              <time className="text-xs text-muted-foreground">
                {formatDate(post.date)}
              </time>
            </div>
            <motion.svg 
              className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-4 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
} 
