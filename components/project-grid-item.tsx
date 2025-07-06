"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur"
import Link from "next/link"

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

interface ProjectGridItemProps {
  project: Project
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ProjectGridItem({ project }: ProjectGridItemProps) {
  const [isHover, setIsHover] = useState(false)

  return (
    <Link href={`/projects/${generateSlug(project.name)}`}>
      <div
        className="relative aspect-square h-[300px] overflow-hidden rounded-[4px] cursor-pointer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
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
          className="pointer-events-none absolute bottom-0 left-0 h-[75%] w-full"
          blurIntensity={0.5}
          animate={isHover ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />

        <motion.div
          className="absolute bottom-0 left-0"
          animate={isHover ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-start gap-0 px-5 py-4">
            <p className="text-base font-medium text-white">{project.name}</p>
            <span className="text-base text-zinc-300">{project.shortDescription}</span>
          </div>
        </motion.div>
      </div>
    </Link>
  )
} 