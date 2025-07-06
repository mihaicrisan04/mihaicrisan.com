"use client"

import { motion } from "motion/react"
import { ProjectGridItem } from "@/components/project-grid-item"
import projectsData from "@/data/projects.json"

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

export default function ProjectsPage() {
  const projects = projectsData as Project[]

  return (
    <div className="py-8 space-y-8">
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Projects
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A collection of projects I've worked on, showcasing various technologies and approaches to problem-solving.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ProjectGridItem project={project} />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 