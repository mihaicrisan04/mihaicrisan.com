import Image from "next/image";
import Link from "next/link";
import { HoverVideo } from "@/components/hover-video";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import { Reveal } from "@/components/reveal";
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
    hash = (hash * 31 + ch.charCodeAt(0)) % 2_147_483_647;
  }
  return FALLBACK_MESSAGES[Math.abs(hash) % FALLBACK_MESSAGES.length];
}

function getYear(date: string) {
  return new Date(date).getFullYear();
}

const HOVER_FADE =
  "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100";
const MEDIA_FADE = `${HOVER_FADE} transition-opacity duration-500`;
const OVERLAY_TIMING = "duration-300 ease-snappy";
const OVERLAY_FADE = `${HOVER_FADE} transition-opacity ${OVERLAY_TIMING}`;

export function ProjectThumbnail({ project, index }: ProjectThumbnailProps) {
  const posterSrc = project.preview?.image ?? project.images[0]?.src ?? null;
  const videoSrc = project.preview?.video;
  const gifSrc = project.preview?.gif;

  return (
    <Reveal
      as="li"
      className="scroll-mt-16 list-none"
      delay={Math.min(index, 6) * 0.05}
      id={`work-${project.slug}`}
    >
      <Link
        aria-label={project.name}
        className="group relative block aspect-[3/2] overflow-hidden bg-muted/30"
        href={`/work/${project.slug}`}
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
          <HoverVideo
            className={`absolute inset-0 h-full w-full object-cover ${MEDIA_FADE}`}
            src={videoSrc}
          />
        )}

        {!videoSrc && gifSrc && (
          <Image
            alt=""
            aria-hidden
            className={`object-cover ${MEDIA_FADE}`}
            fill
            sizes="(min-width: 768px) 640px, 100vw"
            src={gifSrc}
            unoptimized
          />
        )}

        <ProgressiveBlur
          blurIntensity={0.7}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          direction="bottom"
          layerClassName={OVERLAY_FADE}
        />

        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent ${OVERLAY_FADE}`}
        />

        <div
          className={`pointer-events-none absolute right-5 bottom-5 left-5 translate-y-2 transition-[opacity,translate] ${OVERLAY_TIMING} [text-shadow:_0_1px_3px_rgba(0,0,0,0.45)] group-hover:translate-y-0 group-focus-visible:translate-y-0 ${HOVER_FADE}`}
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
        </div>
      </Link>
    </Reveal>
  );
}
