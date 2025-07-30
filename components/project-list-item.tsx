"use client"

import { motion } from "motion/react"
import { Cursor } from "@/components/motion-primitives/cursor"
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur"
import Link from "next/link"

export interface Project {
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

interface ProjectListItemProps {
  project: Project
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ProjectListItem({ project }: ProjectListItemProps) {

  return (
    <div className="relative">
      <Cursor
        attachToParent
        variants={{
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0, opacity: 0 }
        }}
        transition={{ duration: 0.15 }}
        className="z-50"
      >
        <motion.div
          className="relative w-[300px] aspect-square rounded-lg overflow-hidden shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Background Image or Gradient */}
          {project.images && project.images.length > 0 ? (
            <img 
              src={project.images[0].url} 
              alt={project.images[0].alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted" />
          )}

          <ProgressiveBlur
            className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-full"
            blurIntensity={6}
          />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0">
            <div className="flex flex-col items-start gap-0 px-5 py-4">
              <p className="text-base font-medium text-white">{project.name}</p>
              <p className="text-base text-zinc-300">{project.shortDescription}</p>
            </div>
          </div>
        </motion.div>
      </Cursor>

      <Link href={`/projects/${generateSlug(project.name)}`}>
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
    </div>
  )
} 
