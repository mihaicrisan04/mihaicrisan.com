"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const posterSrc = project.preview?.image ?? project.images[0]?.src ?? null;
  const videoSrc = project.preview?.video;
  const gifSrc = project.preview?.gif;

  useEffect(() => {
    const video = videoRef.current;
    if (!(video && videoSrc)) {
      return;
    }
    if (hovered) {
      video.play().catch(() => {
        /* autoplay blocked, no-op */
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [hovered, videoSrc]);

  if (!(posterSrc || videoSrc || gifSrc)) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: decorative hover-to-play on a media container, no actionable behavior
    <div
      aria-label={`${project.name} hero`}
      className="group relative mb-12 aspect-[3/2] overflow-hidden bg-muted/30"
      onBlur={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        <video
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          loop
          muted
          playsInline
          preload="metadata"
          ref={videoRef}
          src={videoSrc}
        />
      )}

      {!videoSrc && gifSrc && (
        <Image
          alt=""
          aria-hidden
          className={`object-cover transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          src={gifSrc}
          unoptimized
        />
      )}
    </div>
  );
}
