import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export interface ProgressiveBlurProps {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  layerClassName?: string;
  blurIntensity?: number;
  style?: CSSProperties;
}

// Stacked backdrop-filter layers with staggered masks, giving a blur that
// ramps up toward `direction`. Static markup, no runtime.
// Fade the layers (`layerClassName`), not the wrapper: a wrapper with
// opacity < 1 becomes a backdrop root and the layers blur nothing until it
// reaches 1.
export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  className,
  layerClassName,
  blurIntensity = 0.25,
  style,
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (blurLayers + 1);
  const angle = GRADIENT_ANGLES[direction];

  return (
    <div className={cn("relative", className)} style={style}>
      {Array.from({ length: layers }).map((_, index) => {
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`;

        return (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[inherit]",
              layerClassName
            )}
            // biome-ignore lint/suspicious/noArrayIndexKey: layers are positional and static
            key={index}
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${index * blurIntensity}px)`,
            }}
          />
        );
      })}
    </div>
  );
}
