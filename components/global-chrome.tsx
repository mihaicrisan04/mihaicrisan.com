"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import { ThemeToggle } from "@/components/theme-toggle";

const EMAIL = "crisanmihai2004@gmail.com";

function EmailCopy() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    navigator.clipboard.writeText(EMAIL).catch(() => {
      // clipboard access can fail in some environments — non-critical
    });
    setCopied(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setCopied(false), 1800);
  };

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  return (
    <span className="relative inline-block">
      <button
        className="cursor-pointer transition-colors hover:text-foreground"
        onClick={handleClick}
        type="button"
      >
        email
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            aria-hidden
            className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border/60 bg-popover px-2 py-1 text-foreground shadow-lg"
            exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }}
            initial={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
          >
            email copied
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function GlobalChrome() {
  const pathname = usePathname();
  const showFade = pathname !== "/";

  return (
    <>
      {showFade && (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-32 sm:hidden"
          >
            <ProgressiveBlur
              blurIntensity={1.1}
              blurLayers={6}
              className="absolute inset-0"
              direction="bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>

          <div
            aria-hidden
            className="pointer-events-none fixed bottom-0 left-0 z-40 hidden h-32 w-[480px] sm:block"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, black 55%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, black 55%, transparent 100%)",
            }}
          >
            <ProgressiveBlur
              blurIntensity={1.1}
              blurLayers={6}
              className="absolute inset-0"
              direction="bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          </div>
        </>
      )}

      <motion.div
        animate={{ opacity: 1 }}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-4 font-mono text-muted-foreground/60 text-xs"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="text-muted-foreground/50">© 2026</span>
        <span aria-hidden className="text-muted-foreground/30">
          /
        </span>
        <Link className="transition-colors hover:text-foreground" href="/work">
          work
        </Link>
        <Link className="transition-colors hover:text-foreground" href="/setup">
          setup
        </Link>
        <a
          className="transition-colors hover:text-foreground"
          href="/cv.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >
          cv
        </a>
        <EmailCopy />
      </motion.div>

      <motion.div
        animate={{ opacity: 1 }}
        className="fixed right-6 bottom-[18px] z-50 lg:right-4"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <ThemeToggle />
      </motion.div>
    </>
  );
}
