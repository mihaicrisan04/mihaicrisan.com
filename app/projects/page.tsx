"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { ProjectCard } from "@/components/project-card"
import { ProjectModal } from "@/components/project-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
}

const projects = projectsData as Project[]

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map(p => p.category)))
    return ["all", ...cats]
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects
    return projects.filter(p => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-8">
      {/* Projects Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold mb-4">Projects</h1>
        <p className="text-muted-foreground">
          A collection of projects I've worked on, ranging from web applications to 
          full-stack solutions. Each project represents a learning journey and exploration 
          of different technologies and concepts.
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
                {category !== "all" && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {projects.filter(p => p.category === category).length}
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No projects found in this category.</p>
        </motion.div>
      )}

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
} 