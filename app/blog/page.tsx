"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { BlogPostItem } from "@/components/blog-post-item"

interface BlogPost {
  slug: string
  title: string
  description?: string
  date: string
}

export default function BlogPage() {
  const blogPosts = useQuery(api.blog.getAllBlogPosts) || []
  
  return (
    <div className="max-w-xl mx-auto px-6">
      <div className="min-h-[55vh] flex flex-col justify-start py-8">
        <div className="mb-4">
          <p className="text-muted-foreground">
            Cool stuff i find on the internet mostly, or thoughts on things.
          </p>
        </div>
        
        <div className="space-y-3">
          {blogPosts.map((post: any, index: number) => (
            <BlogPostItem 
              key={post.slug} 
              post={post} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  )
} 
