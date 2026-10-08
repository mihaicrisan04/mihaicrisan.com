import Image from "next/image";
import { HoverVideo } from "@/components/hover-video";
import type { Project } from "@/lib/projects";

interface ProjectHeroProps {
  project: Project;
}

const HOVER_FADE =
  "opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100";

export function ProjectHero({ project }: ProjectHeroProps) {
  const posterSrc = project.preview?.image ?? project.images[0]?.src ?? null;
  const videoSrc = project.preview?.video;
  const gifSrc = project.preview?.gif;

  if (!(posterSrc || videoSrc || gifSrc)) {
    return null;
  }

  return (
    <div
      aria-label={`${project.name} hero`}
      className="group relative mb-12 aspect-[3/2] overflow-hidden bg-muted/30"
      role="img"
    >
      {posterSrc && (
        <Image
          alt={project.images[0]?.alt ?? project.name}
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.02]"
          fill
          priority
          sizes="(min-width: 768px) 640px, 100vw"
          src={posterSrc}
        />
      )}

      {videoSrc && (
        <HoverVideo
          className={`absolute inset-0 h-full w-full object-cover ${HOVER_FADE}`}
          src={videoSrc}
        />
      )}

      {!videoSrc && gifSrc && (
        <Image
          alt=""
          aria-hidden
          className={`object-cover ${HOVER_FADE}`}
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          src={gifSrc}
          unoptimized
        />
      )}
    </div>
  );
}
