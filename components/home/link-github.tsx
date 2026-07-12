"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GithubContributionChart } from "./github-contribution-chart";

interface LinkGithubProps {
  usernames: string[];
  href: string;
  children: React.ReactNode;
}

export function LinkGithub({ usernames, href, children }: LinkGithubProps) {
  const weeks = usernames.length > 1 ? 16 : 20;
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
