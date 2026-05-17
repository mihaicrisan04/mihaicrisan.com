"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/projects";

interface ProjectListClientProps {
  projects: Project[];
}

function getYear(date: string) {
  return new Date(date).getFullYear();
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/work/${project.slug}`}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: index * 0.04 }}
      >
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          className="flex items-baseline justify-between border-border/40 border-b py-4"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          transition={{ duration: 0.2 }}
        >
          <span className="flex items-baseline gap-4">
            <span className="font-mono text-muted-foreground/50 text-sm tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-base text-foreground">{project.name}</span>
          </span>
          <span className="flex items-baseline gap-4">
            <span className="hidden font-mono text-muted-foreground/60 text-sm sm:inline">
              {project.category}
            </span>
            <span className="font-mono text-muted-foreground text-sm tabular-nums">
              {getYear(project.startDate)}
            </span>
            <motion.span
              animate={{ opacity: hovered ? 1 : 0.5 }}
              className="font-mono text-muted-foreground text-sm"
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export function ProjectListClient({ projects }: ProjectListClientProps) {
  return (
    <div className="border-border/40 border-t">
      {projects.map((project, index) => (
        <ProjectRow index={index} key={project.slug} project={project} />
      ))}
    </div>
  );
}
