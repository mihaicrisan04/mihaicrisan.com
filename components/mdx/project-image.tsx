"use client";

import { X } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogTrigger,
} from "@/components/motion-primitives/morphing-dialog";
import { Spotlight } from "@/components/motion-primitives/spotlight";

interface ProjectImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ProjectImage({ src, alt, caption }: ProjectImageProps) {
  return (
    <div className="">
      <MorphingDialog
        transition={{
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <MorphingDialogTrigger>
          <div className="relative">
            <Spotlight size={150} />
            <MorphingDialogImage
              alt={alt}
              className="aspect-3/2 w-full cursor-pointer rounded-xs object-cover"
              src={src}
              style={{ willChange: "transform, opacity" }}
            />
          </div>
        </MorphingDialogTrigger>
        <MorphingDialogContainer>
          <MorphingDialogContent className="relative">
            <MorphingDialogImage
              alt={alt}
              className="h-auto w-full max-w-[90vw] rounded-xs object-cover lg:h-[90vh]"
              src={src}
            />
          </MorphingDialogContent>
          <MorphingDialogClose
            className="fixed top-6 right-6 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-border/20 bg-muted/20 text-muted-foreground/90 transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
            transition={{
              opacity: { delay: 0.05, duration: 0.15, ease: [0.4, 0, 0.2, 1] },
              scale: { type: "spring", stiffness: 700, damping: 15 },
            }}
            variants={{
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.8 },
            }}
            whileHover={{ scale: 1.15 }}
          >
            <X className="h-4 w-4" />
          </MorphingDialogClose>
        </MorphingDialogContainer>
      </MorphingDialog>
      {caption && (
        <p className="mt-2 text-center text-muted-foreground text-sm">
          {caption}
        </p>
      )}
    </div>
  );
}
