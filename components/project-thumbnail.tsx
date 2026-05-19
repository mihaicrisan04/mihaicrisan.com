"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import type { Project } from "@/lib/projects";

interface ProjectThumbnailProps {
  project: Project;
  index: number;
}

const FALLBACK_MESSAGES = [
  "probably a backend only here",
  "just wait for it. coming soon",
  "no pics here, sorry",
  "still taking pictures for this one haha",
] as const;

function fallbackMessageFor(slug: string) {
  let hash = 0;
  for (const ch of slug) {
    hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  }
  return FALLBACK_MESSAGES[Math.abs(hash) % FALLBACK_MESSAGES.length];
}

function getYear(date: string) {
  return new Date(date).getFullYear();
}

export function ProjectThumbnail({ project, index }: ProjectThumbnailProps) {
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

  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      className="list-none"
      initial={{ opacity: 0, y: 12 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        aria-label={project.name}
        className="group relative block aspect-[3/2] overflow-hidden bg-muted/30"
        href={`/work/${project.slug}`}
        onBlur={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {posterSrc ? (
          <Image
            alt={project.images[0]?.alt ?? project.name}
            className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.02]"
            fill
            priority={index === 0}
            sizes="(min-width: 768px) 640px, 100vw"
            src={posterSrc}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50">
            <span className="px-6 text-center font-mono text-muted-foreground/60 text-xs italic">
              {fallbackMessageFor(project.slug)}
            </span>
          </div>
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

        <ProgressiveBlur
          animate={{ opacity: hovered ? 1 : 0 }}
          blurIntensity={0.7}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          direction="bottom"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          className="pointer-events-none absolute right-5 bottom-5 left-5 [text-shadow:_0_1px_3px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-medium text-base text-white">{project.name}</h2>
            <span className="font-mono text-white/80 text-xs tabular-nums">
              {getYear(project.startDate)}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/85 leading-snug">
            {project.shortDescription}
          </p>
        </motion.div>
      </Link>
    </motion.li>
  );
}
