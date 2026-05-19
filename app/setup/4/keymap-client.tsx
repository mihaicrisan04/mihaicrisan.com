"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Binding {
  keys: string[];
  action: string;
  note: string;
}

interface KeymapGroup {
  label: string;
  bindings: Binding[];
}

const GROUPS: KeymapGroup[] = [
  {
    label: "the modifier",
    bindings: [
      {
        keys: ["caps"],
        action: "escape",
        note: "tap. fastest key on the board, finally doing something useful.",
      },
      {
        keys: ["caps"],
        action: "hyper",
        note: "hold. ⌃⌥⌘⇧ all at once. karabiner handles the dual role.",
      },
    ],
  },
  {
    label: "launch",
    bindings: [
      {
        keys: ["hyper", "space"],
        action: "raycast",
        note: "the launcher. spotlight if it had taste.",
      },
      {
        keys: ["hyper", "t"],
        action: "cmux",
        note: "terminal. project session, restored.",
      },
      {
        keys: ["hyper", "b"],
        action: "dia",
        note: "browser. pinned tabs only.",
      },
      {
        keys: ["hyper", "c"],
        action: "claude code",
        note: "agent attaches to the current cmux pane.",
      },
    ],
  },
  {
    label: "move",
    bindings: [
      {
        keys: ["hyper", "w"],
        action: "window mgmt",
        note: "raycast layouts. left-half, right-half, max.",
      },
      {
        keys: ["hyper", "j"],
        action: "homerow",
        note: "click anything visible. the mouse, retired.",
      },
      {
        keys: ["⌘", "p"],
        action: "files",
        note: "fuzzy file finder in every editor i use. same key everywhere.",
      },
      {
        keys: ["⌘", "k"],
        action: "palette",
        note: "command palette, also universal. raycast included.",
      },
    ],
  },
  {
    label: "capture",
    bindings: [
      {
        keys: ["hyper", "4"],
        action: "shottr",
        note: "region screenshot with ocr and annotations baked in.",
      },
      {
        keys: ["⌃a", "d"],
        action: "detach",
        note: "leave a cmux session running. morning starts where i left off.",
      },
    ],
  },
];

function Kbd({ children, dim = false }: { children: string; dim?: boolean }) {
  return (
    <span
      className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-[3px] border border-border/60 bg-muted/30 px-1.5 font-pixel text-[10px] uppercase leading-none tracking-wider ${
        dim ? "text-muted-foreground/70" : "text-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function BindingRow({
  binding,
  bindingKey,
  open,
  onOpen,
  onClose,
}: {
  binding: Binding;
  bindingKey: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <li>
      <button
        className="-mx-3 block w-full cursor-default rounded-sm px-3 text-left transition-colors hover:bg-muted/30"
        onBlur={onClose}
        onFocus={onOpen}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        type="button"
      >
        <div className="flex items-center gap-4 py-2.5">
          <div className="flex flex-1 items-center gap-1.5">
            {binding.keys.map((k, ki) => (
              <span
                className="flex items-center gap-1.5"
                key={`${bindingKey}-slot-${ki === 0 ? "a" : "b"}`}
              >
                {ki > 0 && (
                  <span className="text-muted-foreground/30 text-xs">+</span>
                )}
                <Kbd>{k}</Kbd>
              </span>
            ))}
          </div>
          <span className="font-mono text-muted-foreground/30">→</span>
          <span className="min-w-[8rem] text-right text-base text-foreground">
            {binding.action}
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
              <div className="pb-3 font-mono text-muted-foreground/80 text-xs leading-relaxed">
                {binding.note}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </li>
  );
}

export function KeymapClient() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {GROUPS.map((group) => (
        <section key={group.label}>
          <div className="mb-3 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.18em]">
            {group.label}
          </div>
          <ul>
            {group.bindings.map((binding, bi) => {
              const key = `${group.label}-${binding.action}-${bi}`;
              return (
                <BindingRow
                  binding={binding}
                  bindingKey={key}
                  key={key}
                  onClose={() => setOpenKey((k) => (k === key ? null : k))}
                  onOpen={() => setOpenKey(key)}
                  open={openKey === key}
                />
              );
            })}
          </ul>
        </section>
      ))}

      <p className="pt-2 text-base text-muted-foreground leading-relaxed">
        the full keymap — karabiner profile, raycast, vim, zed — lives in{" "}
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
