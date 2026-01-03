import { Download, ExternalLink, Eye, FileText, Github } from "lucide-react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  status: string;
  category: string;
  featured: boolean;
  startDate: string;
  endDate: string | null;
  techStack: Array<{
    name: string;
    category: string;
  }>;
  links: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  images: Array<{
    url: string;
    alt: string;
  }>;
}

interface ProjectLinkProps {
  project: Project;
}

export function ProjectLink({ project }: ProjectLinkProps) {
  const _getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "planning":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const _getLinkIcon = (type: string) => {
    switch (type) {
      case "demo":
        return <ExternalLink className="h-3 w-3" />;
      case "code":
        return <Github className="h-3 w-3" />;
      case "preview":
        return <Eye className="h-3 w-3" />;
      case "download":
        return <Download className="h-3 w-3" />;
      case "docs":
        return <FileText className="h-3 w-3" />;
      default:
        return <ExternalLink className="h-3 w-3" />;
    }
  };

  const _formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const _primaryLink =
    project.links.find((link) => link.type === "demo") || project.links[0];

  return (
    <HoverCard closeDelay={100} openDelay={200}>
      <HoverCardTrigger asChild>
        <button
          className="group -mx-2 flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 transition-colors hover:bg-muted/50"
          type="button"
        >
          <span className="text-sm transition-colors hover:text-foreground">
            {project.name}
          </span>
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="h-64 w-96 p-0" side="right">
        <div className="relative h-full w-full">
          {/* Background Image */}
          {project.images && project.images.length > 0 ? (
            <Image
              alt={project.images[0].alt}
              className="h-full w-full object-cover"
              src={project.images[0].url}
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-muted to-muted/50" />
          )}

          {/* Soft Blur Gradient Overlay */}
          <div className="absolute right-0 bottom-0 left-0 h-30 bg-linear-to-t from-black/80 via-black/50 to-transparent backdrop-blur-[1px]" />

          {/* Text Overlay */}
          <div className="absolute right-0 bottom-0 left-0 p-6">
            <h4 className="font-semibold text-base text-white drop-shadow-lg">
              {project.name}
            </h4>
            <p className="mt-2 line-clamp-2 text-sm text-white/95 leading-relaxed drop-shadow-md">
              {project.shortDescription}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
