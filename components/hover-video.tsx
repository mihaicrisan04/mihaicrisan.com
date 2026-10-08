"use client";

import { useEffect, useRef } from "react";

interface HoverVideoProps {
  src: string;
  className?: string;
}

// Plays while the parent element is hovered or focused, rewinds on leave.
// The only client code on the work pages' critical path.
export function HoverVideo({ src, className }: HoverVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const parent = video?.parentElement;
    if (!(video && parent)) {
      return;
    }

    const play = () => {
      video.play().catch(() => {
        /* autoplay blocked, no-op */
      });
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };

    parent.addEventListener("mouseenter", play);
    parent.addEventListener("focusin", play);
    parent.addEventListener("mouseleave", stop);
    parent.addEventListener("focusout", stop);
    return () => {
      parent.removeEventListener("mouseenter", play);
      parent.removeEventListener("focusin", play);
      parent.removeEventListener("mouseleave", stop);
      parent.removeEventListener("focusout", stop);
    };
  }, []);

  return (
    <video
      aria-hidden
      className={className}
      loop
      muted
      playsInline
      preload="metadata"
      ref={ref}
      src={src}
    />
  );
}
