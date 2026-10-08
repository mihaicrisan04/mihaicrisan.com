"use client";

import { type ReactNode, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GithubContributionChart } from "./github-contribution-chart";

interface GithubHoverCardProps {
  usernames: string[];
  children: ReactNode;
}

export function GithubHoverCard({ usernames, children }: GithubHoverCardProps) {
  // mounts lazily while the pointer is already over the trigger, so it
  // starts open and radix takes over from the next pointer event
  const [open, setOpen] = useState(true);
  const weeks = usernames.length > 1 ? 16 : 20;

  return (
    <HoverCard
      closeDelay={120}
      onOpenChange={setOpen}
      open={open}
      openDelay={150}
    >
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        align="end"
        alignOffset={8}
        className="w-auto rounded-xl border border-border/60 bg-popover p-2.5 shadow-lg"
        side="top"
        sideOffset={10}
      >
        <div className="flex items-stretch gap-2.5">
          {usernames.map((username, i) => (
            <div
              className={i > 0 ? "border-border/50 border-l pl-2.5" : undefined}
              key={username}
            >
              <GithubContributionChart username={username} weeks={weeks} />
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
