"use client";

import { motion } from "motion/react";
import { useState } from "react";

interface Principle {
  n: string;
  short: string;
  rest: string;
}

const PRINCIPLES: Principle[] = [
  {
    n: "01",
    short: "caps lock is escape.",
    rest: "holding it is hyper. one modifier to memorise, and the keyboard becomes useful again.",
  },
  {
    n: "02",
    short: "the mouse is for figma.",
    rest: "homerow does the rest. click anything visible without lifting a hand.",
  },
  {
    n: "03",
    short: "if it isn't in the dotfiles, it isn't mine yet.",
    rest: "one repo. brewfile on top. a fresh mac is one command away from home.",
  },
  {
    n: "04",
    short: "tools should vanish when i work.",
    rest: "fast editor, quiet launcher, one browser. nothing competes with the work for attention.",
  },
  {
    n: "05",
    short: "let the agent drive when it can.",
    rest: "claude code for refactors. cursor for new repos. i type when it's a design call.",
  },
  {
    n: "06",
    short: "one runtime. one launcher. one browser.",
    rest: "bun. raycast. dia. fewer choices, more time for the actual thinking.",
  },
  {
    n: "07",
    short: "leave the logs running.",
    rest: "cmux sessions detach, not close. tomorrow starts where today stopped.",
  },
];

function PrincipleRow({ p, active }: { p: Principle; active: boolean }) {
  return (
    <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 sm:grid-cols-[4rem_1fr]">
      <span className="font-pixel text-muted-foreground/40 text-xs tabular-nums">
        {p.n}
      </span>
      <p className="text-[1.05rem] text-foreground leading-relaxed">
        <span>{p.short}</span>{" "}
        <motion.span
          animate={{
            opacity: active ? 1 : 0.22,
            color: active ? "var(--foreground)" : "var(--muted-foreground)",
          }}
          className="inline"
          initial={false}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {p.rest}
        </motion.span>
      </p>
    </div>
  );
}

export function PrinciplesClient() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="space-y-10">
      {PRINCIPLES.map((p, i) => (
        <button
          aria-expanded={activeIndex === i}
          className="block w-full cursor-default text-left"
          key={p.n}
          onBlur={() => setActiveIndex(null)}
          onFocus={() => setActiveIndex(i)}
          onMouseEnter={() => setActiveIndex(i)}
          onMouseLeave={() => setActiveIndex(null)}
          type="button"
        >
          <PrincipleRow active={activeIndex === i} p={p} />
        </button>
      ))}

      <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 pt-12 sm:grid-cols-[4rem_1fr]">
        <span className="font-pixel text-muted-foreground/40 text-xs tabular-nums">
          —
        </span>
        <p className="text-base text-muted-foreground leading-relaxed">
          the rest of the rules — the ones i haven't written down — live in{" "}
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
    </div>
  );
}
