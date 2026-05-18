"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

interface LinkStickerProps {
  href: string;
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  rotation?: number;
  size?: number;
  glowColor?: string;
}

export function LinkSticker({
  href,
  children,
  imageSrc,
  imageAlt,
  rotation = -8,
  size = 110,
  glowColor = "rgba(99, 102, 241, 0.18)",
}: LinkStickerProps) {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setVisible(true);
  };

  const scheduleHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    hideTimer.current = setTimeout(() => setVisible(false), 120);
  };

  return (
    <span className="relative inline-block">
      <a
        className="font-medium text-foreground transition-opacity hover:opacity-70"
        href={href}
        onBlur={scheduleHide}
        onFocus={show}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
      <AnimatePresence>
        {visible && (
          <motion.span
            animate={{ opacity: 1, x: 0, scale: 1, rotate: rotation }}
            className="pointer-events-auto absolute top-1/2 right-full z-50 -translate-y-1/2 pr-3"
            exit={{
              opacity: 0,
              x: 12,
              scale: 0.7,
              rotate: rotation - 8,
              transition: { duration: 0.18 },
            }}
            initial={{ opacity: 0, x: 18, scale: 0.55, rotate: rotation - 16 }}
            onMouseEnter={show}
            onMouseLeave={scheduleHide}
            style={{ transformOrigin: "100% 50%" }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 16,
              mass: 1,
            }}
          >
            <span
              className="relative block rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: [
                  // outer drop (depth)
                  "0 14px 24px -8px rgba(0, 0, 0, 0.4)",
                  "0 6px 10px -4px rgba(0, 0, 0, 0.18)",
                  // colored side glow (3d feel)
                  `-6px 8px 22px -2px ${glowColor}`,
                  // crisp edge
                  "0 0 0 1px rgba(0, 0, 0, 0.06)",
                  // inner top highlight (puff)
                  "inset 0 6px 6px -3px rgba(255, 255, 255, 1)",
                  // inner left highlight (puff)
                  "inset 4px 0 6px -4px rgba(255, 255, 255, 0.9)",
                  // inner bottom shadow (puff curvature)
                  "inset 0 -7px 10px -4px rgba(0, 0, 0, 0.22)",
                  // inner right shadow (puff curvature)
                  "inset -4px 0 8px -4px rgba(0, 0, 0, 0.12)",
                ].join(", "),
              }}
            >
              <Image
                alt={imageAlt}
                className="select-none object-contain"
                draggable={false}
                fill
                sizes={`${size}px`}
                src={imageSrc}
                style={{ padding: `${Math.round(size * 0.16)}px` }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 35% at 32% 18%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)",
                }}
              />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
