"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { BlogPostLink } from "@/components/blog-post-link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import blogPostsData from "@/data/blog-posts.json"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  updatedAt: string
  status: string
  featured: boolean
  readTime: number
  category: string
  tags: string[]
  coverImage: {
    url: string
    alt: string
  }
  author: {
    name: string
    avatar: string
  }
}

const blogPosts = blogPostsData as BlogPost[]

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const publishedPosts = useMemo(() => {
    return blogPosts.filter(post => post.status === "published")
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(publishedPosts.map(post => post.category)))
    return ["all", ...cats]
  }, [publishedPosts])

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return publishedPosts
    return publishedPosts.filter(post => post.category === selectedCategory)
  }, [selectedCategory, publishedPosts])

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-8">
      {/* Blog Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">
          Thoughts, insights, and stories from my journey in software development, 
          AI, and technology. Each post explores different aspects of building 
          modern applications and solving interesting problems.
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
                {category !== "all" && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {publishedPosts.filter(post => post.category === category).length}
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Blog Posts List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-3"
      >
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <BlogPostLink post={post} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No blog posts found in this category.</p>
        </motion.div>
      )}
    </div>
  )
} 