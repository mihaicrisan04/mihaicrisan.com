"use client";

import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import { CustomLink } from "@/components/custom-link";
import { mdxComponents } from "@/components/mdx";
import { PageBack } from "@/components/page-back";
import { ProjectHero } from "@/components/project-hero";
import { PromoVideoPlayer } from "@/components/promo-video-player";
import type { Project } from "@/lib/projects";

interface ProjectDetailClientProps {
  project: Project;
}

function formatDateRange(
  startDate: string,
  endDate: string | undefined,
  ongoing: boolean | undefined
) {
  const start = new Date(startDate)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
    .toLowerCase();
  if (endDate) {
    const end = new Date(endDate)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
      .toLowerCase();
    return `${start} → ${end}`;
  }
  if (ongoing) {
    return `${start} → present`;
  }
  return start;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [mdxSource, setMdxSource] = useState<Awaited<
    ReturnType<typeof serialize>
  > | null>(null);

  useEffect(() => {
    serialize(project.content).then(setMdxSource);
  }, [project.content]);

  return (
    <div className="mx-auto max-w-2xl px-6 pt-12 pb-24">
      <div className="mb-12">
        <PageBack href="/work" label="work" />
      </div>

      <header className="mb-12 border-border/40 border-b pb-8">
        <h1 className="mb-2 font-medium text-foreground text-lg tracking-tight">
          {project.website ? (
            <CustomLink
              className="font-medium text-foreground text-lg hover:text-foreground"
              external
              href={project.website}
            >
              {project.name}
            </CustomLink>
          ) : (
            project.name
          )}
        </h1>

        <p className="mb-6 font-mono text-muted-foreground text-sm">
          {formatDateRange(project.startDate, project.endDate, project.ongoing)}
        </p>

        <p className="text-base text-foreground/85 leading-relaxed">
          {project.shortDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
          {project.techStack.map((tech) => (
            <span
              className="font-mono text-muted-foreground/70 text-sm"
              key={tech.name}
            >
              {tech.name.toLowerCase()}
            </span>
          ))}
        </div>
      </header>

      {project.preview?.promoVideo ? (
        <div className="mb-12">
          <PromoVideoPlayer
            poster={project.preview.image}
            src={project.preview.promoVideo}
          />
        </div>
      ) : (
        <ProjectHero project={project} />
      )}

      {mdxSource && (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </div>
      )}
    </div>
  );
}
