"use client"

import { motion, AnimatePresence } from "motion/react"
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogDescription,
} from "@/components/motion-primitives/morphing-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Github, Calendar, Tag, X } from "lucide-react"

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
  highlights?: string[]
}

interface ProjectDetailDialogProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function ProjectDetailDialog({ project, isOpen, onClose, children }: ProjectDetailDialogProps) {
  if (!project) return children

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-400'
      case 'in-progress': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case 'planning': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
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
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.1,
        duration: 0.4
      }}
    >
      <MorphingDialogTrigger>
        {children}
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="max-w-4xl w-[90vw] max-h-[85vh] overflow-hidden bg-background border border-border rounded-xl shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Header with Project Image */}
            <div className="relative h-48 overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <img 
                  src={project.images[0].url} 
                  alt={project.images[0].alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Close Button */}
              <MorphingDialogClose 
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors rounded-full p-2"
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.8 }
                }}
              >
                <X className="w-4 h-4" />
              </MorphingDialogClose>

              {/* Project Title Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <MorphingDialogTitle className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                  {project.name}
                </MorphingDialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                  {project.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Description */}
              <MorphingDialogDescription 
                className="text-muted-foreground leading-relaxed"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 20 }
                }}
              >
                {project.fullDescription}
              </MorphingDialogDescription>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-muted/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Timeline</span>
                </div>
                <p className="text-foreground">
                  {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                </p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>

              {/* Key Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <Separator />

              {/* Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
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
              </motion.div>
            </div>
          </div>
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
} 