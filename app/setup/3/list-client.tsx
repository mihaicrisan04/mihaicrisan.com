"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Row {
  name: string;
  note: string;
  why: string;
  href?: string;
}

interface Group {
  label: string;
  rows: Row[];
}

const GROUPS: Group[] = [
  {
    label: "hardware",
    rows: [
      {
        name: "macbook pro m1",
        note: "still going",
        why: "five years in, still does a full work day on battery. the last laptop that felt like a free lunch.",
      },
      {
        name: "airpods",
        note: "always on",
        why: "the only piece of hardware i replace without thinking.",
      },
    ],
  },
  {
    label: "shell",
    rows: [
      {
        name: "bun",
        note: "runtime + pm",
        why: "one tool, one install. node_modules drama, gone.",
        href: "https://bun.com",
      },
      {
        name: "mise",
        note: "tool versions",
        why: "asdf without the python pain. every runtime pinned per repo.",
        href: "https://mise.jdx.dev",
      },
      {
        name: "brew",
        note: "system pkgs",
        why: "boring, in the good way. brewfile in dotfiles, fresh mac in one command.",
        href: "https://brew.sh",
      },
      {
        name: "yazi",
        note: "files",
        why: "what finder should have been. preview pane, vim keys, leaves the terminal in the right cwd.",
        href: "https://yazi-rs.github.io",
      },
      {
        name: "cmux",
        note: "terminal",
        why: "panes that survive a laptop sleep. project-scoped sessions, restored on demand.",
        href: "https://github.com/manaflow-ai/cmux",
      },
    ],
  },
  {
    label: "editor",
    rows: [
      {
        name: "zed",
        note: "type",
        why: "fast enough that i forget it's there.",
        href: "https://zed.dev",
      },
      {
        name: "cursor",
        note: "delegate",
        why: "for exploratory work where the agent drives and i'm reading along.",
        href: "https://cursor.com",
      },
      {
        name: "datagrip",
        note: "db",
        why: "the only jetbrains app that survived the move to lighter editors.",
        href: "https://www.jetbrains.com/datagrip",
      },
    ],
  },
  {
    label: "ai",
    rows: [
      {
        name: "claude code",
        note: "main pair",
        why: "the real ide. agents in tmux panes do what i used to do in three tabs.",
        href: "https://claude.com/claude-code",
      },
      {
        name: "codex",
        note: "one-shots",
        why: "for small mechanical scripts. not where i think, where i delegate.",
        href: "https://github.com/openai/codex",
      },
    ],
  },
  {
    label: "apps",
    rows: [
      {
        name: "raycast",
        note: "launcher",
        why: "spotlight if it had taste. one hyper-key away from everything.",
        href: "https://raycast.com",
      },
      {
        name: "dia",
        note: "browser",
        why: "arc, but it stopped rearranging my tabs.",
        href: "https://www.diabrowser.com",
      },
      {
        name: "karabiner",
        note: "keys",
        why: "caps → escape, hold → hyper. one modifier to memorise.",
        href: "https://karabiner-elements.pqrs.org",
      },
      {
        name: "homerow",
        note: "mouse, retired",
        why: "click anything from the keyboard. mouse is for figma and nothing else.",
        href: "https://homerow.app",
      },
      {
        name: "shottr",
        note: "screenshots",
        why: "ocr, scroll capture, annotations. cmd+shift+4 retired.",
        href: "https://shottr.cc",
      },
      {
        name: "screen studio",
        note: "demos",
        why: "screencaps that look better than reality.",
        href: "https://screen.studio",
      },
    ],
  },
];

function ToolRow({
  row,
  open,
  onOpen,
  onClose,
}: {
  row: Row;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-6 py-2.5">
        <span className="text-base text-foreground">{row.name}</span>
        <span className="font-mono text-muted-foreground/70 text-xs">
          {row.note}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
            }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pb-3 font-serif text-[15px] text-muted-foreground italic leading-relaxed">
              {row.why}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (row.href) {
    return (
      <a
        className="block cursor-default"
        href={row.href}
        onBlur={onClose}
        onFocus={onOpen}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        rel="noopener noreferrer"
        target="_blank"
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      className="block w-full cursor-default text-left"
      onBlur={onClose}
      onFocus={onOpen}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      type="button"
    >
      {inner}
    </button>
  );
}

export function ListClient() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {GROUPS.map((group) => (
        <section key={group.label}>
          <div className="mb-1 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.18em]">
            {group.label}
          </div>
          <ul className="-mx-3">
            {group.rows.map((row) => {
              const key = `${group.label}-${row.name}`;
              return (
                <li
                  className="rounded-sm px-3 transition-colors hover:bg-muted/30"
                  key={key}
                >
                  <ToolRow
                    onClose={() => setOpenKey((k) => (k === key ? null : k))}
                    onOpen={() => setOpenKey(key)}
                    open={openKey === key}
                    row={row}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="pt-4 text-base text-muted-foreground leading-relaxed">
        the rest — aliases, configs, the rare ones — lives in{" "}
        <a
          className="font-medium text-foreground underline decoration-1 decoration-foreground/20 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-foreground/60"
          href="https://github.com/mihaicrisan04/dotfiles"
          rel="noopener noreferrer"
          target="_blank"
        >
          the dotfiles
        </a>
        .
      </p>
    </div>
  );
}
