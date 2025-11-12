"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BackButton } from "@/components/back-button";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogClose,
} from "@/components/motion-primitives/morphing-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/motion-primitives/carousel";
import { Spotlight } from "@/components/motion-primitives/spotlight";
import { XIcon } from "lucide-react";
import { Image } from "@imagekit/next";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateRange(
  startDate: string,
  endDate: string | null | undefined,
): string {
  const start = formatDate(startDate);
  if (!endDate) {
    return `${start} - Present`;
  }
  const end = formatDate(endDate);
  return `${start} - ${end}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "text-green-600 dark:text-green-400";
    case "in-progress":
      return "text-blue-600 dark:text-blue-400";
    case "planning":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-muted-foreground";
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = use(params);
  const project = useQuery(api.projects.getProjectBySlug, { slug });

  if (project === undefined) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-muted-foreground">Loading project...</div>
        </div>
      </div>
    );
  }

  if (project === null) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <BackButton />

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {project.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {formatDateRange(project.startDate, project.endDate)}
          </p>
        </div>

        {/* Image Carousel */}
        {project.images.length > 0 && (
          <div className="mb-12 px-4">
            <Carousel className="w-full" disableDrag={false}>
              <CarouselContent className="-ml-4">
                {project.images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-[85%] pl-4 sm:basis-[70%] md:basis-[60%] lg:basis-1/2"
                  >
                    <div className="relative">
                      <Spotlight size={150} />
                      <MorphingDialog
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                      >
                        <MorphingDialogTrigger>
                          <div className="aspect-video w-full">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={600}
                              height={400}
                              className="w-full h-full rounded-lg object-cover border border-border hover:border-border/60 transition-colors cursor-pointer"
                              transformation={[
                                {
                                  width: 600,
                                  height: 400,
                                  crop: "maintain_ratio",
                                },
                              ]}
                            />
                          </div>
                        </MorphingDialogTrigger>
                        <MorphingDialogContainer>
                          <MorphingDialogContent className="relative">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={1200}
                              height={800}
                              className="h-auto w-full max-w-[90vw] rounded-lg object-cover lg:h-[90vh]"
                              transformation={[
                                {
                                  width: 1200,
                                  height: 800,
                                  crop: "maintain_ratio",
                                },
                              ]}
                            />
                          </MorphingDialogContent>
                          <MorphingDialogClose
                            className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1"
                            variants={{
                              initial: { opacity: 0 },
                              animate: {
                                opacity: 1,
                                transition: { delay: 0.3, duration: 0.1 },
                              },
                              exit: { opacity: 0, transition: { duration: 0 } },
                            }}
                          >
                            <XIcon className="h-5 w-5 text-zinc-500" />
                          </MorphingDialogClose>
                        </MorphingDialogContainer>
                      </MorphingDialog>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {project.images.length > 1 && <CarouselNavigation />}
            </Carousel>
          </div>
        )}

        {/* Description as bullet points */}
        <div className="mb-16 max-w-2xl">
          {project.highlights && project.highlights.length > 0 ? (
            <ul className="space-y-3">
              {project.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="text-foreground/80 leading-relaxed flex"
                >
                  <span className="text-muted-foreground mr-3">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-foreground/80 leading-relaxed">
              {project.fullDescription}
            </p>
          )}
        </div>

        {/* Status */}
        {project.status && (
          <div className="mb-8">
            <span
              className={`text-sm font-medium px-3 py-1 rounded ${getStatusColor(project.status)} bg-secondary/50`}
            >
              {project.status.charAt(0).toUpperCase() +
                project.status.slice(1).replace("-", " ")}
            </span>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Links</h3>
            <div className="space-y-2">
              {project.links.map((link, index) => (
                <div key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm block"
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-24"></div>
      </div>
    </div>
  );
}
