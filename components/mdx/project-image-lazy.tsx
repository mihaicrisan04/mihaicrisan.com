"use client";

import { useLazyComponent } from "@/hooks/use-lazy-component";

interface ProjectImageProps {
  src: string;
  alt: string;
  caption?: string;
}

const loadLightbox = () =>
  import("./project-image").then((m) => m.ProjectImage);

// Server renders the plain figure; the morphing lightbox (motion) replaces it
// after hydration, so motion never sits on the critical path.
export function ProjectImageLazy(props: ProjectImageProps) {
  const Lightbox = useLazyComponent(loadLightbox);

  if (Lightbox) {
    return <Lightbox {...props} />;
  }

  return (
    <div>
      {/* biome-ignore lint/performance/noImgElement: mirrors the lightbox markup it is swapped for */}
      <img
        alt={props.alt}
        className="aspect-3/2 w-full rounded-xs object-cover"
        height={300}
        src={props.src}
        width={400}
      />
      {props.caption && (
        <p className="mt-2 text-center text-muted-foreground text-sm">
          {props.caption}
        </p>
      )}
    </div>
  );
}
