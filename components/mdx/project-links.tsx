import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { ReactNode } from "react";

interface ProjectLinksProps {
  children: ReactNode;
}

export function ProjectLinks({ children }: ProjectLinksProps) {
  return (
    <div className="relative my-10 flex w-full items-center justify-center py-24">
      <div className="relative z-10 flex flex-col items-center gap-3">
        {children}
      </div>
    </div>
  );
}

interface ProjectLinkButtonProps {
  type: "github" | "live" | "demo" | "download";
  href: string;
  label?: string;
}

const DEFAULT_LABELS: Record<ProjectLinkButtonProps["type"], string> = {
  github: "view on GitHub",
  live: "visit site",
  demo: "view demo",
  download: "download",
};

export function ProjectLinkButton({
  type,
  href,
  label,
}: ProjectLinkButtonProps) {
  const Icon = type === "github" ? Github : ExternalLink;
  const glow =
    type === "github"
      ? "0 0 15px 1px rgba(128, 128, 128, 0.2)"
      : "0 0 15px 1px rgba(0, 0, 0, 0.15)";

  return (
    <a
      className="group no-underline! relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-border bg-secondary/80 px-4 py-2 font-medium text-secondary-foreground text-xs transition-[color,background-color,border-color,transform] hover:border-foreground/20 hover:bg-secondary active:scale-[0.97]"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="relative z-10">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="relative z-10">{label || DEFAULT_LABELS[type]}</span>
      <span className="relative z-10 inline-flex transition-[translate] duration-200 group-hover:translate-x-[3px]">
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ boxShadow: glow }}
      />
    </a>
  );
}
