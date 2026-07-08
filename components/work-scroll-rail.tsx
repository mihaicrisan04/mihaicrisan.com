"use client";

import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";

export interface WorkRailItem {
  slug: string;
  name: string;
  year: number;
  image?: string;
  description?: string;
}

interface WorkScrollRailProps {
  items: WorkRailItem[];
}

const TICK_BASE = 12;
const TICK_GROWTH = 16;
// how far (px) the magnification wave reaches around the pointer;
// keep at 4x the row pitch so the falloff always spans 3 rows
const WAVE_RADIUS = 48;

interface RailTickProps {
  item: WorkRailItem;
  isActive: boolean;
  newYear: boolean;
  mouseY: MotionValue<number>;
  hovered: boolean;
  onHover: (slug: string | null) => void;
}

function RailTick({
  item,
  isActive,
  newYear,
  mouseY,
  hovered,
  onHover,
}: RailTickProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const width = useSpring(
    useTransform(mouseY, (y) => {
      const bounds = ref.current?.getBoundingClientRect();
      if (!bounds) {
        return TICK_BASE;
      }
      const distance = Math.abs(y - (bounds.top + bounds.height / 2));
      if (distance > WAVE_RADIUS) {
        return TICK_BASE;
      }
      // sharpened cosine falloff: 100% under the pointer, ~70% one row out,
      // ~20% two rows out, dead after ~3 rows (rows are 12px apart)
      const falloff =
        ((Math.cos((distance / WAVE_RADIUS) * Math.PI) + 1) / 2) ** 2.2;
      return TICK_BASE + TICK_GROWTH * falloff;
    }),
    { damping: 30, stiffness: 600 }
  );

  const jumpTo = () => {
    document
      .getElementById(`work-${item.slug}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      aria-current={isActive ? "true" : undefined}
      aria-label={`${item.name} (${item.year})`}
      className={`group relative flex items-center py-[5px] pr-3 pl-12 outline-none ${
        newYear ? "mt-3" : ""
      }`}
      onBlur={() => onHover(null)}
      onClick={jumpTo}
      onFocus={() => onHover(item.slug)}
      onMouseEnter={() => onHover(item.slug)}
      onMouseLeave={() => onHover(null)}
      ref={ref}
      type="button"
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute right-13"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {item.image ? (
              <span className="relative block aspect-[3/2] w-64 overflow-hidden rounded-lg border border-border/60 bg-muted/30 shadow-lg">
                <Image
                  alt={item.name}
                  className="object-cover"
                  fill
                  sizes="256px"
                  src={item.image}
                />
                <ProgressiveBlur
                  blurIntensity={0.5}
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                  direction="bottom"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                />
                <span className="pointer-events-none absolute right-2.5 bottom-2 left-2.5 [text-shadow:_0_1px_3px_rgba(0,0,0,0.45)]">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-white text-xs">
                      {item.name}
                    </span>
                    <span className="font-mono text-[10px] text-white/80 tabular-nums">
                      {item.year}
                    </span>
                  </span>
                  {item.description && (
                    <span className="mt-0.5 line-clamp-2 block text-[10px] text-white/85 leading-snug">
                      {item.description}
                    </span>
                  )}
                </span>
              </span>
            ) : (
              <span className="flex items-baseline gap-2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2.5 py-1 shadow-sm">
                <span className="text-popover-foreground text-xs">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {item.year}
                </span>
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        className={`block h-[2px] rounded-full ${
          isActive
            ? "bg-foreground"
            : "bg-muted-foreground/30 group-hover:bg-muted-foreground/70 group-focus-visible:bg-muted-foreground/70"
        }`}
        style={{ width }}
      />
    </button>
  );
}

// Codex-style jump rail: one tick per project, dock-like magnification wave
// under the pointer, hover shows a mini project card. Desktop only.
export function WorkScrollRail({ items }: WorkScrollRailProps) {
  const [activeSlugs, setActiveSlugs] = useState<string[]>([]);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const mouseY = useMotionValue(Number.POSITIVE_INFINITY);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      // every project with at least a third of its thumbnail on screen is "in view"
      const vh = window.innerHeight;
      const inView: string[] = [];
      for (const item of items) {
        const el = document.getElementById(`work-${item.slug}`);
        if (!el) {
          continue;
        }
        const rect = el.getBoundingClientRect();
        const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visible >= rect.height * 0.35) {
          inView.push(item.slug);
        }
      }
      setActiveSlugs((prev) =>
        prev.length === inView.length && prev.every((s, i) => s === inView[i])
          ? prev
          : inView
      );
    };

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [items]);

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: pointer tracking only drives the decorative magnification; the buttons inside remain the interactive elements
    <nav
      aria-label="jump to project"
      className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col items-end lg:flex"
      onMouseLeave={() => mouseY.set(Number.POSITIVE_INFINITY)}
      onMouseMove={(e) => mouseY.set(e.clientY)}
    >
      {items.map((item, i) => (
        <RailTick
          hovered={hoveredSlug === item.slug}
          isActive={activeSlugs.includes(item.slug)}
          item={item}
          key={item.slug}
          mouseY={mouseY}
          newYear={i > 0 && item.year !== items[i - 1].year}
          onHover={setHoveredSlug}
        />
      ))}
    </nav>
  );
}
