"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useState } from "react";

interface ToolToken {
  name: string;
  href: string;
  why: string;
}

const TOOLS: Record<string, ToolToken> = {
  bun: {
    name: "bun",
    href: "https://bun.com",
    why: "one tool, one install. node_modules drama, gone.",
  },
  mise: {
    name: "mise",
    href: "https://mise.jdx.dev",
    why: "asdf without the python pain. every runtime pinned per repo.",
  },
  "claude code": {
    name: "claude code",
    href: "https://claude.com/claude-code",
    why: "the real ide. agents in tmux panes do what i used to do in three tabs.",
  },
  cmux: {
    name: "cmux",
    href: "https://github.com/manaflow-ai/cmux",
    why: "panes that survive a laptop sleep. project-scoped sessions, restored on demand.",
  },
  zed: {
    name: "zed",
    href: "https://zed.dev",
    why: "fast enough that i forget it's there.",
  },
  raycast: {
    name: "raycast",
    href: "https://raycast.com",
    why: "spotlight if it had taste. one hyper-space launches the rest.",
  },
};

interface Segment {
  id: string;
  text?: string;
  token?: string;
}

interface Paragraph {
  id: string;
  segments: Segment[];
}

const PARAGRAPHS: Paragraph[] = [
  {
    id: "para-machine",
    segments: [
      {
        id: "p1-a",
        text: "this machine runs on a small list i refuse to swap. ",
      },
      { id: "p1-bun", token: "bun" },
      { id: "p1-b", text: " and " },
      { id: "p1-mise", token: "mise" },
      { id: "p1-c", text: " keep the runtimes in line. " },
      { id: "p1-claude", token: "claude code" },
      { id: "p1-d", text: " does the heavy lifting from inside a " },
      { id: "p1-cmux", token: "cmux" },
      { id: "p1-e", text: " pane, and " },
      { id: "p1-zed", token: "zed" },
      { id: "p1-f", text: " picks up when i want to type. " },
      { id: "p1-raycast", token: "raycast" },
      {
        id: "p1-g",
        text: " is the only modifier i need to remember — hyper-space, and the rest is muscle memory.",
      },
    ],
  },
  {
    id: "para-caps",
    segments: [
      {
        id: "p2-a",
        text: "caps lock is escape, holding it is hyper, the mouse is for figma. every alias, every keybind, every config beyond that lives in ",
      },
      { id: "p2-dotfiles", text: "the dotfiles" },
      { id: "p2-b", text: "." },
    ],
  },
];

function Token({
  tool,
  active,
  onEnter,
  onLeave,
}: {
  tool: ToolToken;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <a
      className={`whitespace-nowrap font-medium text-foreground underline decoration-1 decoration-foreground/0 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-foreground/40 ${
        active ? "decoration-foreground/40" : ""
      }`}
      href={tool.href}
      onBlur={onLeave}
      onFocus={onEnter}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      rel="noopener noreferrer"
      target="_blank"
    >
      {tool.name}
    </a>
  );
}

export function ParagraphClient() {
  const [active, setActive] = useState<string | null>(null);
  const activeTool = active ? TOOLS[active] : null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="space-y-5 text-[1.05rem] text-foreground/90 leading-relaxed">
        {PARAGRAPHS.map((para) => (
          <p key={para.id}>
            {para.segments.map((seg) => {
              if (seg.token) {
                const tool = TOOLS[seg.token];
                return (
                  <Token
                    active={active === seg.token}
                    key={seg.id}
                    onEnter={() => setActive(seg.token ?? null)}
                    onLeave={() => setActive(null)}
                    tool={tool}
                  />
                );
              }
              if (seg.text === "the dotfiles") {
                return (
                  <a
                    className="font-medium text-foreground underline decoration-1 decoration-foreground/20 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-foreground/60"
                    href="https://github.com/mihaicrisan04/dotfiles"
                    key={seg.id}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {seg.text}
                  </a>
                );
              }
              return <Fragment key={seg.id}>{seg.text}</Fragment>;
            })}
          </p>
        ))}
      </div>

      <div className="mt-auto pt-16">
        <div className="h-px w-12 bg-border/60" />
        <div className="relative mt-5 min-h-[3rem]">
          <AnimatePresence mode="wait">
            {activeTool ? (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-0 top-0 font-serif text-base text-muted-foreground italic leading-relaxed"
                exit={{ opacity: 0, y: -2, transition: { duration: 0.15 } }}
                initial={{ opacity: 0, y: 4 }}
                key={activeTool.name}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-mono text-foreground/80 text-xs uppercase not-italic tracking-[0.18em]">
                  {activeTool.name}
                </span>
                <span className="ml-3 text-muted-foreground/40">·</span>
                <span className="ml-3">{activeTool.why}</span>
              </motion.p>
            ) : (
              <motion.p
                animate={{ opacity: 1 }}
                className="absolute inset-x-0 top-0 font-mono text-muted-foreground/40 text-xs tracking-wide"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                initial={{ opacity: 0 }}
                key="hint"
                transition={{ duration: 0.22 }}
              >
                hover a name to read why.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
