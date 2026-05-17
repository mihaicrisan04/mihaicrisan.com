"use client";

import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AIChatTrigger } from "@/components/ai-chat-trigger";

interface HomeLink {
  label: string;
  href: string;
  hint?: string;
  external?: boolean;
  kbd?: string;
}

const links: HomeLink[] = [
  { label: "work", href: "/work", kbd: "W" },
  { label: "my setup", href: "/setup", kbd: "S" },
  // { label: "blog", href: "/blog", kbd: "B" }, // hidden until i actually write something
  { label: "cv", href: "/cv.pdf", external: true },
];

function HomeRow({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FancyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      className="relative inline-block text-muted-foreground transition-colors hover:text-foreground"
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
      <motion.span
        animate={{ scaleX: hovered ? 1 : 0 }}
        className="absolute right-0 -bottom-0.5 left-0 h-px origin-left bg-current"
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </a>
  );
}

const socials = [
  { label: "x", href: "https://x.com/mitzaqe" },
  { label: "github", href: "https://github.com/mihaicrisan04" },
  {
    label: "crisanmihai2004@gmail.com",
    href: "mailto:crisanmihai2004@gmail.com",
  },
];

function LinkRow({ link, index }: { link: HomeLink; index: number }) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <motion.div
      animate={{ x: hovered ? 4 : 0 }}
      className="group flex items-center justify-between border-border/40 border-b py-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ duration: 0.2 }}
    >
      <span className="flex items-baseline gap-4">
        <span className="font-mono text-muted-foreground/50 text-sm tabular-nums">
          0{index + 1}
        </span>
        <span className="text-base text-foreground">{link.label}</span>
      </span>
      <span className="flex items-center gap-3">
        {link.kbd && (
          <kbd className="hidden font-mono text-muted-foreground/50 text-sm sm:inline">
            {link.kbd}
          </kbd>
        )}
        <motion.span
          animate={{
            opacity: hovered ? 1 : 0.5,
            x: hovered ? 2 : 0,
          }}
          className="text-muted-foreground"
          transition={{ duration: 0.2 }}
        >
          {link.external ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <span className="font-mono text-sm">→</span>
          )}
        </motion.span>
      </span>
    </motion.div>
  );

  if (link.external) {
    return (
      <a href={link.href} rel="noopener noreferrer" target="_blank">
        {inner}
      </a>
    );
  }

  return <Link href={link.href}>{inner}</Link>;
}

function AIRow({ index }: { index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <AIChatTrigger className="w-full text-left">
      <motion.div
        animate={{ x: hovered ? 4 : 0 }}
        className="group flex items-center justify-between border-border/40 border-b py-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        transition={{ duration: 0.2 }}
      >
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-muted-foreground/50 text-sm tabular-nums">
            0{index + 1}
          </span>
          <span className="text-base text-foreground">ask zuzu</span>
          <span className="font-mono text-muted-foreground/60 text-sm">
            ai assistant
          </span>
        </span>
        <span className="flex items-center gap-3">
          <kbd className="hidden font-mono text-muted-foreground/50 text-sm sm:inline">
            ⌘I
          </kbd>
          <motion.span
            animate={{
              opacity: hovered ? 1 : 0.5,
              x: hovered ? 2 : 0,
            }}
            className="font-mono text-muted-foreground text-sm"
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </span>
      </motion.div>
    </AIChatTrigger>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      aria-label="toggle theme"
      className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      {mounted && theme === "dark" ? (
        <Moon className="h-3.5 w-3.5" />
      ) : (
        <Sun className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function HomeClient() {
  return (
    <div className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-lg px-6">
        <HomeRow delay={0.05}>
          <h1 className="font-medium text-foreground text-xl tracking-tight">
            mihai crisan
          </h1>
          <p className="mt-2 font-mono text-muted-foreground text-base">
            software engineer · cluj-napoca
          </p>
          <p className="mt-1 font-mono text-muted-foreground text-base">
            currently at{" "}
            <FancyLink href="https://wolfpack-digital.com">
              wolfpack digital
            </FancyLink>
          </p>
        </HomeRow>

        <div className="mt-10 border-border/40 border-t">
          {links.map((link, i) => (
            <HomeRow delay={0.15 + i * 0.05} key={link.href}>
              <LinkRow index={i} link={link} />
            </HomeRow>
          ))}
          <HomeRow delay={0.15 + links.length * 0.05}>
            <AIRow index={links.length} />
          </HomeRow>
        </div>

        <HomeRow delay={0.15 + (links.length + 1) * 0.05}>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm">
            {socials.map((social, i) => (
              <span className="flex items-center gap-x-3" key={social.href}>
                {i > 0 && (
                  <span aria-hidden className="text-muted-foreground/40">
                    ·
                  </span>
                )}
                <FancyLink href={social.href}>{social.label}</FancyLink>
              </span>
            ))}
          </div>
        </HomeRow>
      </div>

      <motion.div
        animate={{ opacity: 1 }}
        className="absolute right-6 bottom-6 z-10 flex items-center gap-3"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <kbd className="hidden font-mono text-muted-foreground/50 text-sm sm:inline">
          L
        </kbd>
        <ThemeToggle />
      </motion.div>

      <motion.div
        animate={{ opacity: 1 }}
        className="absolute bottom-6 left-6 z-10 font-mono text-muted-foreground/50 text-xs"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        © 2026
      </motion.div>
    </div>
  );
}
