import { getAllBlogPosts } from "@/lib/markdown"
import { BlogPostItem } from "@/components/blog-post-item"

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
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Technical insights, project deep-dives, and development thoughts.
          </p>
        </div>
        
        <div className="space-y-6">
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
