"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GithubContributionChart } from "./github-contribution-chart";

interface LinkGithubProps {
  username: string;
  href: string;
  children: React.ReactNode;
}

export function LinkGithub({ username, href, children }: LinkGithubProps) {
  return (
    <HoverCard closeDelay={120} openDelay={150}>
      <HoverCardTrigger asChild>
        <a
          className="font-medium text-foreground transition-opacity hover:opacity-70"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        alignOffset={8}
        className="w-auto rounded-xl border border-border/60 bg-popover p-2.5 shadow-lg"
        side="top"
        sideOffset={10}
      >
        <GithubContributionChart username={username} />
      </HoverCardContent>
    </HoverCard>
  );
}
