"use client"

import { motion, AnimatePresence } from "motion/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Github, Calendar, Tag } from "lucide-react"

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
  highlights?: string[]
}

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'source':
        return <Github className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold mb-2">
                  {project.name}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {project.shortDescription}
                </DialogDescription>
              </div>
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('-', ' ')}
              </Badge>
            </div>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Project Timeline */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span>Timeline</span>
              </div>
              <p>
                {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
              </p>
            </CardContent>
          </Card>

          {/* Full Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About This Project</h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4" />
              <h3 className="text-lg font-semibold">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {project.techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Badge variant="secondary">
                      {tech.name}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Key Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {project.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Links</h3>
            <div className="flex flex-wrap gap-3">
              {project.links.map((link, index) => (
                <motion.div
                  key={link.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getLinkIcon(link.type)}
                      {link.name}
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 