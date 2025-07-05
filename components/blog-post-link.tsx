import Link from "next/link"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"

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

interface BlogPostLinkProps {
  post: BlogPost
}

export function BlogPostLink({ post }: BlogPostLinkProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'ai': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'design': return 'bg-pink-500/10 text-pink-600 border-pink-500/20'
      case 'machine-learning': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'developer-tools': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/blog/${post.slug}`}>
          <div className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors cursor-pointer">
            <span className="text-sm hover:text-foreground transition-colors">
              {post.title}
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4" side="right" align="start">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground line-clamp-2">{post.title}</h4>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={`text-xs ${getCategoryColor(post.category)}`}>
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge variant="secondary" className="text-xs">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</h5>
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Meta Information */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{post.author.name}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 