import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye, Download, FileText, Clock } from "lucide-react"

interface Project {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  status: string
  category: string
  featured: boolean
  startDate: string
  endDate: string | null
  techStack: Array<{
    name: string
    category: string
  }>
  links: Array<{
    name: string
    url: string
    type: string
  }>
  images: Array<{
    url: string
    alt: string
  }>
}

interface ProjectLinkProps {
  project: Project
}

export function ProjectLink({ project }: ProjectLinkProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'in-progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'planning': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'demo': return <ExternalLink className="w-3 h-3" />
      case 'code': return <Github className="w-3 h-3" />
      case 'preview': return <Eye className="w-3 h-3" />
      case 'download': return <Download className="w-3 h-3" />
      case 'docs': return <FileText className="w-3 h-3" />
      default: return <ExternalLink className="w-3 h-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const primaryLink = project.links.find(link => link.type === 'demo') || project.links[0]

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors cursor-pointer">
          <span className="text-sm hover:text-foreground transition-colors">
            {project.name}
          </span>
          <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-0 h-64" side="right" align="start">
        <div className="relative w-full h-full">
          {/* Background Image */}
          {project.images && project.images.length > 0 ? (
            <img 
              src={project.images[0].url} 
              alt={project.images[0].alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50" />
          )}
          
          {/* Soft Blur Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-30 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-[1px]" />
          
          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h4 className="font-semibold text-white text-base drop-shadow-lg">{project.name}</h4>
            <p className="text-white/95 text-sm mt-2 drop-shadow-md line-clamp-2 leading-relaxed">{project.shortDescription}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 