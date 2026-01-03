"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";

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

interface ProjectGridItemProps {
  project: Project;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectGridItem({ project }: ProjectGridItemProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      href={`/work/${generateSlug(project.name)}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative aspect-square h-[300px] cursor-pointer overflow-hidden rounded-[4px]">
        {/* Background Image or Gradient */}
        {project.images && project.images.length > 0 ? (
          <Image
            alt={project.images[0].alt}
            className="absolute inset-0 h-full w-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={project.images[0].url}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted" />
        )}

        <ProgressiveBlur
          animate={isHover ? "visible" : "hidden"}
          blurIntensity={0.5}
          className="pointer-events-none absolute bottom-0 left-0 h-[75%] w-full"
          transition={{ duration: 0.2, ease: "easeOut" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        />

        <motion.div
          animate={isHover ? "visible" : "hidden"}
          className="absolute bottom-0 left-0"
          transition={{ duration: 0.2, ease: "easeOut" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          <div className="flex flex-col items-start gap-0 px-5 py-4">
            <p className="font-medium text-base text-white">{project.name}</p>
            <span className="text-base text-zinc-300">
              {project.shortDescription}
            </span>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
