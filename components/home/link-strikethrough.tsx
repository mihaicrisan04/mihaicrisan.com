"use client";

import { SiX } from "@icons-pack/react-simple-icons";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface LinkStrikethroughProps {
  href: string;
  children: React.ReactNode;
}

export function LinkStrikethrough({ href, children }: LinkStrikethroughProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      className="relative inline-block font-medium text-foreground"
      href={href}
      onBlur={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{children}</span>
      <AnimatePresence>
        {hovered && (
          <motion.svg
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-0 h-[0.55em] w-full -translate-y-1/2 overflow-visible"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            initial={{ opacity: 0 }}
            preserveAspectRatio="none"
            role="presentation"
            viewBox="0 0 100 10"
          >
            <title>strikethrough</title>
            <motion.path
              animate={{ pathLength: 1 }}
              d="M 1 6 Q 12 2 24 5 T 48 4 T 72 6 T 99 4"
              fill="none"
              initial={{ pathLength: 0 }}
              stroke="#dc2626"
              strokeLinecap="round"
              strokeWidth={2.5}
              transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hovered && (
          <motion.span
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            aria-hidden
            className="pointer-events-none absolute"
            exit={{
              opacity: 0,
              scale: 0.7,
              rotate: -18,
              transition: { duration: 0.14 },
            }}
            initial={{ opacity: 0, y: 6, scale: 0.6, rotate: -28 }}
            style={{
              top: "-0.65em",
              right: "-0.85em",
              transformOrigin: "50% 100%",
            }}
            transition={{
              type: "spring",
              stiffness: 520,
              damping: 12,
              mass: 0.8,
              delay: 0.34,
            }}
          >
            <SiX className="h-[0.95em] w-[0.95em] text-foreground" />
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}
