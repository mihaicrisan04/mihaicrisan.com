"use client";

import Link from "next/link";

const VARIATIONS = [
  { n: "01", slug: "1", label: "manifest" },
  { n: "02", slug: "2", label: "paragraph" },
  { n: "03", slug: "3", label: "list" },
  { n: "04", slug: "4", label: "keymap" },
  { n: "05", slug: "5", label: "principles" },
] as const;

interface VariationNavProps {
  current: "1" | "2" | "3" | "4" | "5";
}

export function VariationNav({ current }: VariationNavProps) {
  const active = VARIATIONS.find((v) => v.slug === current);

  return (
    <nav
      aria-label="setup design variations"
      className="font-mono text-muted-foreground/70 text-xs"
    >
      <div className="flex items-center gap-3">
        <span className="hidden text-muted-foreground/40 sm:inline">
          variation
        </span>
        <ul className="flex items-center gap-1.5">
          {VARIATIONS.map((v) => {
            const isActive = v.slug === current;
            return (
              <li key={v.slug}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`tabular-nums transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/40 hover:text-foreground"
                  }`}
                  href={`/setup/${v.slug}`}
                >
                  {v.n}
                </Link>
              </li>
            );
          })}
        </ul>
        {active && (
          <span className="hidden text-muted-foreground/40 sm:inline">
            / {active.label}
          </span>
        )}
      </div>
    </nav>
  );
}
