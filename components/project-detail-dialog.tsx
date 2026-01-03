"use client";

import { Calendar, ExternalLink, Github, Tag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/components/motion-primitives/morphing-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  status: string;
  category: string;
  featured: boolean;
  startDate: string;
  endDate: string | null;
  techStack: Array<{
    name: string;
    category: string;
  }>;
  links: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  images: Array<{
    url: string;
    alt: string;
  }>;
  highlights?: string[];
}

interface ProjectDetailDialogProps {
  project: Project | null;
  children: React.ReactNode;
}

export function ProjectDetailDialog({
  project,
  children,
}: ProjectDetailDialogProps) {
  if (!project) {
    return children;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "planning":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case "source":
        return <Github className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.1,
        duration: 0.4,
      }}
    >
      <MorphingDialogTrigger>{children}</MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="max-h-[85vh] w-[90vw] max-w-4xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="flex h-full flex-col">
            {/* Header with Project Image */}
            <div className="relative h-48 overflow-hidden">
              {project.images && project.images.length > 0 ? (
                <Image
                  alt={project.images[0].alt}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  src={project.images[0].url}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Close Button */}
              <MorphingDialogClose
                className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background/90"
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.8 },
                }}
              >
                <X className="h-4 w-4" />
              </MorphingDialogClose>

              {/* Project Title Overlay */}
              <div className="absolute right-6 bottom-4 left-6">
                <MorphingDialogTitle className="mb-2 font-bold text-2xl text-white drop-shadow-lg">
                  {project.name}
                </MorphingDialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace("-", " ")}
                  </Badge>
                  {project.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Project Description */}
              <MorphingDialogDescription
                className="text-muted-foreground leading-relaxed"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 20 },
                }}
              >
                {project.fullDescription}
              </MorphingDialogDescription>

              {/* Timeline */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-muted/30 p-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Timeline</span>
                </div>
                <p className="text-foreground">
                  {formatDate(project.startDate)} -{" "}
                  {project.endDate ? formatDate(project.endDate) : "Present"}
                </p>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <h3 className="font-semibold text-lg">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {project.techStack.map((tech, index) => (
                      <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        key={tech.name}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Badge variant="secondary">{tech.name}</Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Key Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="mb-3 font-semibold text-lg">Key Highlights</h3>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, index) => (
                      <motion.li
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        key={highlight}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span className="text-muted-foreground">
                          {highlight}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <Separator />

              {/* Links */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="mb-3 font-semibold text-lg">Links</h3>
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link, index) => (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      key={link.url}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        asChild
                        className="gap-2"
                        size="sm"
                        variant="outline"
                      >
                        <a
                          href={link.url}
                          rel="noopener noreferrer"
                          target="_blank"
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
  );
}
