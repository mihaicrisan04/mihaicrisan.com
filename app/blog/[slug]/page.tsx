import { notFound } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { getBlogMarkdown } from "@/lib/markdown"
import { BlogPostWrapper } from "@/components/blog-post-wrapper"

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  // Await params for Next.js 15 compatibility
  const { slug } = await params
  
  // Get blog post markdown content
  const markdownData = await getBlogMarkdown(slug)

  if (!markdownData) {
    notFound()
  }

  const { frontmatter, content } = markdownData

  return (
    <BlogPostWrapper>
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-6">
          {/* Back Button */}
          <BackButton />
          
          {/* Blog Post Header */}
          <header className="mb-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {frontmatter.title || 'Untitled Post'}
            </h1>
            {frontmatter.date && (
              <time className="text-muted-foreground text-sm">
                {formatDate(frontmatter.date)}
              </time>
            )}
            {frontmatter.description && (
              <p className="text-foreground/80 mt-4 text-lg leading-relaxed">
                {frontmatter.description}
              </p>
            )}
          </header>

          {/* Blog Post Content */}
          <article className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </article>

          {/* Bottom Spacing */}
          <div className="mt-24"></div>
        </div>
      </div>
    </BlogPostWrapper>
  )
}

export async function generateStaticParams() {
  const { getAllBlogMarkdownSlugs } = await import("@/lib/markdown")
  const slugs = getAllBlogMarkdownSlugs()
  
  return slugs.map((slug) => ({
    slug: slug,
  }))
} 
