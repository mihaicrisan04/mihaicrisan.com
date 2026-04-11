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
import { useEffect, useRef, useState } from "react";
import {
  Steps,
  StepsContent,
  StepsItem,
  StepsTrigger,
} from "@/components/ui/steps";
import type { MessagePart } from "@/lib/chat-types";
import { extractToolName, getToolLabel } from "./tool-labels";

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

function pluralize(count: number, singular: string): string {
  return `${count} ${singular}${count !== 1 ? "s" : ""}`;
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

function extractOutputField(output: unknown, field: string): unknown {
  if (output && typeof output === "object") {
    return (output as Record<string, unknown>)[field];
  }
  return undefined;
}

function Shimmer({ children }: { children: React.ReactNode }) {
  return (
    <span className="animate-[shimmer_4s_infinite_linear] bg-[length:200%_auto] bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function getActiveSubStep(
  toolName: string,
  input?: Record<string, unknown>
): string {
  switch (toolName) {
    case "searchPortfolio": {
      const query = input?.query;
      return typeof query === "string"
        ? `Querying "${query}"...`
        : "Querying knowledge base...";
    }
    case "listProjects":
      return "Fetching project list...";
    case "getProjectDetails": {
      const slug = input?.slug;
      return typeof slug === "string"
        ? `Loading ${slug}...`
        : "Loading project...";
    }
    case "getWorkExperience":
      return "Fetching work history...";
    case "getBlogPosts":
      return "Loading articles...";
    case "getCurrentTime":
      return "Checking clock...";
    default:
      return "Processing...";
  }
}

function getDoneSubStep(toolName: string, output?: unknown): string {
  const count = extractCount(output);

  switch (toolName) {
    case "searchPortfolio":
      return count !== undefined
        ? `Found ${pluralize(count, "result")}`
        : "Search complete";
    case "listProjects":
      return count !== undefined
        ? `Found ${pluralize(count, "project")}`
        : "Projects loaded";
    case "getProjectDetails": {
      const name = extractOutputField(output, "name");
      const found = extractOutputField(output, "found");
      if (found === false) {
        return "Project not found";
      }
      return typeof name === "string"
        ? `Loaded ${name}`
        : "Loaded project details";
    }
    case "getWorkExperience":
      return count !== undefined
        ? `Found ${pluralize(count, "position")}`
        : "Work history loaded";
    case "getBlogPosts":
      return count !== undefined
        ? `Found ${pluralize(count, "post")}`
        : "Blog posts loaded";
    case "getCurrentTime": {
      const formatted = extractOutputField(output, "formatted");
      return typeof formatted === "string" ? formatted : "Got the time";
    }
    default:
      return "Done";
  }
}

export interface ToolStepFromPartProps {
  part: MessagePart;
}

export function ToolStepFromPart({ part }: ToolStepFromPartProps) {
  const toolName = extractToolName(part) ?? "unknown";
  const isActive = isActiveState(part.state);
  const label = getToolLabel(toolName);

  // Start open if active, closed if already done (e.g. loaded from history)
  const [open, setOpen] = useState(isActive);
  // Track if we've already auto-closed once (so user can re-open without it closing again)
  const hasAutoClosedRef = useRef(!isActive);

  useEffect(() => {
    if (!(isActive || hasAutoClosedRef.current)) {
      hasAutoClosedRef.current = true;
      const timer = setTimeout(() => setOpen(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const triggerLabel = isActive ? (
    <Shimmer>{label.active}...</Shimmer>
  ) : (
    label.done
  );

  const subStep = isActive
    ? getActiveSubStep(toolName, part.input)
    : getDoneSubStep(toolName, part.output);

  return (
    <Steps onOpenChange={setOpen} open={open}>
      <StepsTrigger leftIcon={getStepIcon(toolName, isActive)}>
        {triggerLabel}
      </StepsTrigger>
      <StepsContent>
        <StepsItem>
          {isActive ? <Shimmer>{subStep}</Shimmer> : subStep}
        </StepsItem>
      </StepsContent>
    </Steps>
  );
}
