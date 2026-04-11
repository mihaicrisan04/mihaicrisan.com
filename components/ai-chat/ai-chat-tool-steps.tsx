"use client";

import {
  BookOpen,
  Briefcase,
  Clock,
  FileCode,
  FolderOpen,
  Loader2,
  Search,
  Wrench,
} from "lucide-react";
import {
  Steps,
  StepsContent,
  StepsItem,
  StepsTrigger,
} from "@/components/ui/steps";
import type { MessagePart } from "@/lib/chat-types";
import { extractToolName, getToolLabel } from "./tool-labels";

// States considered "active" (tool is still running)
const ACTIVE_STATES = new Set([
  "call",
  "partial-call",
  "input-streaming",
  "input-available",
]);

function isActiveState(state?: string): boolean {
  return ACTIVE_STATES.has(state ?? "call");
}

function getStepIcon(toolName: string, isActive: boolean) {
  if (isActive) {
    return <Loader2 className="size-4 animate-spin" />;
  }

  switch (toolName) {
    case "searchPortfolio":
      return <Search className="size-4" />;
    case "listProjects":
      return <FolderOpen className="size-4" />;
    case "getProjectDetails":
      return <FileCode className="size-4" />;
    case "getWorkExperience":
      return <Briefcase className="size-4" />;
    case "getBlogPosts":
      return <BookOpen className="size-4" />;
    case "getCurrentTime":
      return <Clock className="size-4" />;
    default:
      return <Wrench className="size-4" />;
  }
}

function getSubSteps(
  toolName: string,
  isActive: boolean,
  output?: unknown
): string[] {
  if (isActive) {
    switch (toolName) {
      case "searchPortfolio":
        return ["Querying knowledge base...", "Scanning documents..."];
      case "listProjects":
        return ["Fetching project list...", "Parsing project data..."];
      case "getProjectDetails":
        return ["Loading project info...", "Reading content..."];
      case "getWorkExperience":
        return ["Fetching work history...", "Parsing career data..."];
      case "getBlogPosts":
        return ["Checking blog posts...", "Loading articles..."];
      default:
        return ["Processing..."];
    }
  }

  const count = extractCount(output);
  switch (toolName) {
    case "searchPortfolio":
      return [
        "Queried knowledge base",
        `Found ${count ?? 0} result${(count ?? 0) !== 1 ? "s" : ""}`,
      ];
    case "listProjects":
      return [
        "Fetched project list",
        `Found ${count ?? 0} project${(count ?? 0) !== 1 ? "s" : ""}`,
      ];
    case "getProjectDetails":
      return ["Loaded project info", "Details ready"];
    case "getWorkExperience":
      return [
        "Fetched work history",
        `Found ${count ?? 0} position${(count ?? 0) !== 1 ? "s" : ""}`,
      ];
    case "getBlogPosts":
      return [
        "Checked blog posts",
        `Found ${count ?? 0} post${(count ?? 0) !== 1 ? "s" : ""}`,
      ];
    default:
      return ["Done"];
  }
}

function extractCount(output: unknown): number | undefined {
  if (output && typeof output === "object") {
    const obj = output as Record<string, unknown>;
    if (typeof obj.resultsCount === "number") {
      return obj.resultsCount;
    }
    if (typeof obj.count === "number") {
      return obj.count;
    }
  }
  return undefined;
}

export interface ToolStepFromPartProps {
  part: MessagePart;
}

export function ToolStepFromPart({ part }: ToolStepFromPartProps) {
  const toolName = extractToolName(part) ?? "unknown";
  const isActive = isActiveState(part.state);
  const label = getToolLabel(toolName);
  const subSteps = getSubSteps(toolName, isActive, part.output);

  const triggerLabel = isActive ? (
    <span className="animate-[shimmer_4s_infinite_linear] bg-[length:200%_auto] bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-clip-text text-transparent">
      {label.active}...
    </span>
  ) : (
    label.done
  );

  return (
    <Steps defaultOpen>
      <StepsTrigger
        leftIcon={getStepIcon(toolName, isActive)}
        swapIconOnHover={!isActive}
      >
        {triggerLabel}
      </StepsTrigger>
      <StepsContent>
        {subSteps.map((item) => (
          <StepsItem key={item}>{item}</StepsItem>
        ))}
      </StepsContent>
    </Steps>
  );
}
