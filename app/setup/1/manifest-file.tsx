"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

type Line =
  | { type: "comment"; text: string }
  | { type: "blank" }
  | { type: "section"; name: string }
  | {
      type: "kv";
      key: string;
      value: string;
      comment?: string;
      href?: string;
    };

const LINES: Line[] = [
  { type: "comment", text: "# software engineer, cluj-napoca." },
  {
    type: "comment",
    text: "# the bits below are the ones i bring to every new mac.",
  },
  { type: "comment", text: "# the rest lives in the dotfiles." },
  { type: "blank" },
  { type: "section", name: "[hardware]" },
  {
    type: "kv",
    key: "machine",
    value: "macbook pro m1",
    comment: "still a full work day on battery, five years in",
  },
  {
    type: "kv",
    key: "audio",
    value: "airpods",
    comment: "the only piece i replace without thinking",
  },
  { type: "blank" },
  { type: "section", name: "[shell]" },
  {
    type: "kv",
    key: "runtime",
    value: "bun",
    href: "https://bun.com",
    comment: "one tool, one install. node_modules drama, gone",
  },
  {
    type: "kv",
    key: "versions",
    value: "mise",
    href: "https://mise.jdx.dev",
    comment: "every runtime pinned per repo. asdf, retired",
  },
  {
    type: "kv",
    key: "packages",
    value: "brew",
    href: "https://brew.sh",
    comment: "boring, in the good way",
  },
  {
    type: "kv",
    key: "files",
    value: "yazi",
    href: "https://yazi-rs.github.io",
    comment: "the finder i wish i had",
  },
  { type: "blank" },
  { type: "section", name: "[editor]" },
  {
    type: "kv",
    key: "primary",
    value: "zed",
    href: "https://zed.dev",
    comment: "fast enough i forget it's there",
  },
  {
    type: "kv",
    key: "delegate",
    value: "cursor",
    href: "https://cursor.com",
    comment: "when the agent drives and i review",
  },
  {
    type: "kv",
    key: "database",
    value: "datagrip",
    href: "https://www.jetbrains.com/datagrip",
    comment: "the only jetbrains app i still defend",
  },
  { type: "blank" },
  { type: "section", name: "[ai]" },
  {
    type: "kv",
    key: "main_pair",
    value: "claude code",
    href: "https://claude.com/claude-code",
    comment: "agents in tmux panes. this is the real ide",
  },
  {
    type: "kv",
    key: "one_shots",
    value: "codex",
    href: "https://github.com/openai/codex",
    comment: "mechanical scripts, not deep thought",
  },
  { type: "blank" },
  { type: "section", name: "[apps]" },
  {
    type: "kv",
    key: "launcher",
    value: "raycast",
    href: "https://raycast.com",
    comment: "hyper-space. one modifier to rule them all",
  },
  {
    type: "kv",
    key: "terminal",
    value: "cmux",
    href: "https://github.com/manaflow-ai/cmux",
    comment: "panes that survive a laptop sleep",
  },
  {
    type: "kv",
    key: "browser",
    value: "dia",
    href: "https://www.diabrowser.com",
    comment: "arc, but it stopped rearranging my tabs",
  },
  {
    type: "kv",
    key: "keys",
    value: "karabiner",
    href: "https://karabiner-elements.pqrs.org",
    comment: "caps → escape · hold → hyper",
  },
  {
    type: "kv",
    key: "mouse",
    value: "homerow",
    href: "https://homerow.app",
    comment: "click without lifting a hand",
  },
  {
    type: "kv",
    key: "menubar",
    value: "thaw",
    href: "https://github.com/stonerl/Thaw",
    comment: "doesn't phone home",
  },
  {
    type: "kv",
    key: "screencap",
    value: "shottr",
    href: "https://shottr.cc",
    comment: "ocr + scroll + annotations",
  },
  {
    type: "kv",
    key: "demos",
    value: "screen studio",
    href: "https://screen.studio",
    comment: "screencaps that look better than reality",
  },
  { type: "blank" },
  {
    type: "comment",
    text: "# everything stowed → github.com/mihaicrisan04/dotfiles",
  },
];

const KEY_WIDTH = 10;
const VALUE_WIDTH = 16;

function pad(text: string, width: number) {
  if (text.length >= width) {
    return text;
  }
  return text + " ".repeat(width - text.length);
}

export function ManifestFile() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-md border border-border/40 bg-background"
      initial={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between border-border/40 border-b bg-muted/20 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/60 tracking-wide">
          setup.toml — 1:1
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/40 tabular-nums">
          {LINES.length} ln
        </span>
      </div>

      <div className="overflow-x-auto py-4">
        <pre className="px-4 font-mono text-sm leading-relaxed">
          {LINES.map((line, i) => {
            const n = String(i + 1).padStart(2, "0");

            if (line.type === "blank") {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable line order
                <div className="flex" key={i}>
                  <span className="select-none pr-4 text-muted-foreground/25 tabular-nums">
                    {n}
                  </span>
                  <span>&nbsp;</span>
                </div>
              );
            }

            if (line.type === "comment") {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable line order
                <div className="flex whitespace-pre" key={i}>
                  <span className="select-none pr-4 text-muted-foreground/25 tabular-nums">
                    {n}
                  </span>
                  <span className="text-muted-foreground/60 italic">
                    {line.text}
                  </span>
                </div>
              );
            }

            if (line.type === "section") {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable line order
                <div className="flex whitespace-pre" key={i}>
                  <span className="select-none pr-4 text-muted-foreground/25 tabular-nums">
                    {n}
                  </span>
                  <span className="font-medium text-foreground">
                    {line.name}
                  </span>
                </div>
              );
            }

            const value = `"${line.value}"`;
            const rowKey = `kv-${line.key}-${i}`;

            return (
              <div
                className="group flex whitespace-pre hover:bg-muted/30"
                key={rowKey}
              >
                <span className="select-none pr-4 text-muted-foreground/25 tabular-nums">
                  {n}
                </span>
                <span className="text-foreground">
                  {pad(line.key, KEY_WIDTH)}
                </span>
                <span className="text-muted-foreground/40">{"= "}</span>
                {line.href ? (
                  <a
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    href={line.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {value}
                    <ArrowUpRight className="-mt-0.5 ml-0.5 inline h-3 w-3 text-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">{value}</span>
                )}
                {line.comment && (
                  <span className="pl-2 text-muted-foreground/40">
                    {pad("", Math.max(0, VALUE_WIDTH - value.length))}
                    {`# ${line.comment}`}
                  </span>
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </motion.div>
  );
}
