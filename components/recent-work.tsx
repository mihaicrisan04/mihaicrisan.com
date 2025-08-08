"use client"

import { motion } from "motion/react"
import { ProjectListItem } from "@/components/project-list-item"

interface Project {
  _id: string
  name: string
  slug: string
  shortDescription: string
  fullDescription: string
  status?: string
  category: string
  featured: boolean
  startDate: string
  endDate?: string | null
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

interface RecentWorkProps {
  projects: Project[]
}

export function RecentWork({ projects }: RecentWorkProps) {
  return (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ProjectListItem project={project} />
        </motion.div>
      ))}
    </div>
  )
} 
