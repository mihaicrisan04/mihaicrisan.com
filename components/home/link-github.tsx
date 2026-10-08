"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const GithubHoverCard = dynamic(
  () => import("./github-hover-card").then((m) => m.GithubHoverCard),
  { ssr: false }
);

interface LinkGithubProps {
  usernames: string[];
  href: string;
  children: React.ReactNode;
}

// The anchor ships in the HTML. The hover card (radix + contribution chart)
// is only downloaded on first hover/focus, so it never touches initial load.
export function LinkGithub({ usernames, href, children }: LinkGithubProps) {
  const [engaged, setEngaged] = useState(false);
  const engage = () => setEngaged(true);

  const anchor = (
    <a
      className="font-medium text-foreground transition-opacity hover:opacity-70"
      href={href}
      onFocus={engage}
      onMouseEnter={engage}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );

  if (!engaged) {
    return anchor;
  }

  return <GithubHoverCard usernames={usernames}>{anchor}</GithubHoverCard>;
}
