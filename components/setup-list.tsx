"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { SetupGroup } from "@/data/setup";

interface SetupListProps {
  groups: SetupGroup[];
}

export function SetupList({ groups }: SetupListProps) {
  return (
    <div className="space-y-12">
      {groups.map((group, gi) => (
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 8 }}
          key={group.title}
          transition={{ duration: 0.5, delay: 0.1 + gi * 0.05 }}
        >
          <div className="mb-3 flex items-baseline justify-between border-border/40 border-b pb-2">
            <h2 className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
              {group.title}
            </h2>
            <span className="font-mono text-muted-foreground/50 text-xs tabular-nums">
              {String(group.items.length).padStart(2, "0")}
            </span>
          </div>

          <ul>
            {group.items.map((item) => {
              const inner = (
                <div className="group flex items-baseline justify-between py-2">
                  <span className="flex items-baseline gap-3">
                    <span className="text-base text-foreground">
                      {item.name}
                    </span>
                    {item.href && (
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </span>
                  <span className="font-mono text-muted-foreground text-sm">
                    {item.note}
                  </span>
                </div>
              );

              return (
                <li key={item.name}>
                  {item.href ? (
                    <a
                      className="-mx-3 block rounded-sm px-3 transition-colors hover:bg-muted/40"
                      href={item.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
          {group.footer && (
            <p className="mt-3 font-mono text-muted-foreground/70 text-sm">
              {group.footer}
            </p>
          )}
        </motion.section>
      ))}
    </div>
  );
}
