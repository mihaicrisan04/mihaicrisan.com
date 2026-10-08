"use client";

import { motion } from "motion/react";
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
    <button
      className="cursor-pointer transition-colors hover:text-foreground"
      onClick={handleClick}
      type="button"
    >
      {copied ? "copied" : "email"}
    </button>
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
        className="pointer-events-none fixed inset-x-6 bottom-6 z-50 flex items-center justify-between font-mono text-xs"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <nav className="pointer-events-auto flex items-center gap-4 text-muted-foreground/60">
          <Link
            className="transition-colors hover:text-foreground"
            href="/work"
          >
            work
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/setup"
          >
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
        </nav>

        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </motion.div>
    </>
  );
}
