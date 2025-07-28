import { notFound } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { 
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogClose
} from "@/components/motion-primitives/morphing-dialog"
import { XIcon } from 'lucide-react'
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = formatDate(startDate)
  if (!endDate) {
    return `${start} - Present`
  }
  const end = formatDate(endDate)
  return `${start} - ${end}`
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-600 dark:text-green-400'
    case 'in-progress':
      return 'text-blue-600 dark:text-blue-400'
    case 'planning':
      return 'text-yellow-600 dark:text-yellow-400'
    default:
      return 'text-muted-foreground'
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = (projectsData as Project[]).find(p => 
    generateSlug(p.name) === params.slug
  )

  if (!project) {
    notFound()
  }

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto px-6">
        <BackButton />
        
        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-xl font-bold text-foreground mb-2">
            {project.name}
          </h1>
          <p className="text-muted-foreground mb-4">
            {formatDateRange(project.startDate, project.endDate)}
          </p>
          <div className="mb-6">
            <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
            </span>
          </div>
          <p className="text-foreground/80 leading-relaxed">
            {project.fullDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Screenshots */}
          <div className="lg:col-span-2 space-y-8">
            {project.images.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-foreground mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <MorphingDialog
                      key={index}
                      transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                      }}
                    >
                      <MorphingDialogTrigger>
                        <MorphingDialogImage
                          src={image.url}
                          alt={image.alt}
                          className='w-full h-48 rounded-lg object-cover border border-border hover:border-border/60 transition-colors'
                        />
                      </MorphingDialogTrigger>
                      <MorphingDialogContainer>
                        <MorphingDialogContent className='relative'>
                          <MorphingDialogImage
                            src={image.url}
                            alt={image.alt}
                            className='h-auto w-full max-w-[90vw] rounded-lg object-cover lg:h-[90vh]'
                          />
                        </MorphingDialogContent>
                        <MorphingDialogClose
                          className='fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1'
                          variants={{
                            initial: { opacity: 0 },
                            animate: {
                              opacity: 1,
                              transition: { delay: 0.3, duration: 0.1 },
                            },
                            exit: { opacity: 0, transition: { duration: 0 } },
                          }}
                        >
                          <XIcon className='h-5 w-5 text-zinc-500' />
                        </MorphingDialogClose>
                      </MorphingDialogContainer>
                    </MorphingDialog>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-foreground mb-4">Key Highlights</h2>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="text-foreground/80 leading-relaxed">
                      • {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tech Stack */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Category</h2>
              <p className="text-foreground/80 capitalize">
                {project.category.replace('-', ' ')}
              </p>
            </div>

            {/* Links */}
            {project.links.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-foreground mb-4">Links</h2>
                <div className="space-y-2">
                  {project.links.map((link, index) => (
                    <div key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {link.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24"></div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return (projectsData as Project[]).map((project) => ({
    slug: generateSlug(project.name),
  }))
} 
