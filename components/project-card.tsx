"use client"

import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, Star } from "lucide-react"

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
    caption?: string
  }>
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-border/50 hover:border-border group overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              {project.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </motion.div>
              )}
            </div>
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
              {project.shortDescription}
            </CardDescription>
          </div>
          <div className="flex-shrink-0">
            <Badge className={getStatusColor(project.status)} variant="outline">
              <span className="truncate">{project.status.replace('-', ' ')}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tech Stack Preview */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge 
                key={tech.name} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 truncate max-w-[80px]"
                title={tech.name}
              >
                {tech.name}
              </Badge>
            ))}
            {project.techStack.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 flex-shrink-0">
                +{project.techStack.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">
            {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
          </span>
        </div>

        {/* Category and Links */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground capitalize truncate">
            {project.category.replace('-', ' ')}
          </span>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0"
          >
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 opacity-70 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
} 