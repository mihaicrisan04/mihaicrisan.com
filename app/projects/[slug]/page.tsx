import { notFound } from "next/navigation"
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
  }>
  highlights?: string[]
}

interface ProjectPageProps {
  params: {
    slug: string
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // Find project by slug
  const project = (projectsData as Project[]).find(p => 
    generateSlug(p.name) === params.slug
  )

  if (!project) {
    notFound()
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {project.name}
        </h1>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return (projectsData as Project[]).map((project) => ({
    slug: generateSlug(project.name),
  }))
} 