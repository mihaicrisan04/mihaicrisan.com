"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

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

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getAllProjects)

  if (!projects) {
    return (
      <div className="max-w-xl mx-auto px-6">
        <div className="min-h-[55vh] flex flex-col justify-center items-center">
          {/* empty state */}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6">
      <div className="min-h-[55vh] flex flex-col justify-start py-8">
        <div className="space-y-3">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Link href={`/projects/${project.slug}`}>
                <motion.div
                  className="flex items-center justify-between group hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors cursor-pointer"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-sm hover:text-foreground transition-colors">
                    {project.name}
                  </span>
                  <motion.svg 
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 
