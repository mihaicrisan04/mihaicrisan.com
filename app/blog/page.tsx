import { getAllBlogPosts } from "@/lib/markdown"
import { BlogPostItem } from "@/components/blog-post-item"
import { AnimatedDescription } from "@/components/animated-description"

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
}

export default async function BlogPage() {
  // Get blog posts from markdown files
  const blogPosts: BlogPost[] = getAllBlogPosts()
  
  return (
    <div className="max-w-xl mx-auto px-6">
      <div className="min-h-[55vh] flex flex-col justify-start py-8">
        <AnimatedDescription>
          Cool stuff i find on the internet mostly, or thoughts on things.
        </AnimatedDescription>
        
        <div className="space-y-3">
          {blogPosts.map((post, index) => (
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
