"use client";

import {
  BookOpen,
  Briefcase,
  Clock,
  FileCode,
  FolderOpen,
  Search,
  UserRound,
  Wrench,
} from "lucide-react";
import type { MessagePart } from "@/lib/chat-types";
import { extractToolName, getToolLabel } from "./tool-labels";
import { ToolLayout, type ToolRenderState } from "./tool-layout";

function getToolIcon(toolName: string) {
  switch (toolName) {
    case "searchPortfolio":
      return <Search className="h-3.5 w-3.5" />;
    case "listProjects":
      return <FolderOpen className="h-3.5 w-3.5" />;
    case "getProjectDetails":
      return <FileCode className="h-3.5 w-3.5" />;
    case "getWorkExperience":
      return <Briefcase className="h-3.5 w-3.5" />;
    case "getAboutMihai":
      return <UserRound className="h-3.5 w-3.5" />;
    case "getBlogPosts":
      return <BookOpen className="h-3.5 w-3.5" />;
    case "getCurrentTime":
      return <Clock className="h-3.5 w-3.5" />;
    default:
      return <Wrench className="h-3.5 w-3.5" />;
  }
}

// AI SDK v6 tool part states: input-streaming, input-available,
// approval-requested, approval-responded, output-available, output-error,
// output-denied. Only the two input states count as "running"; everything
// else (including unknown future states) is terminal.
function extractRenderState(
  part: MessagePart,
  isStreaming?: boolean
): ToolRenderState {
  const state = (part as { state?: string }).state;
  const isRunningState =
    state === "input-streaming" || state === "input-available";

  return {
    running: isRunningState && (isStreaming ?? true),
    error:
      state === "output-error"
        ? ((part as { errorText?: string }).errorText ?? "Error")
        : undefined,
  };
}

function getActiveSummary(toolName: string, part: MessagePart): string {
  const input = (part as { input?: Record<string, unknown> }).input;
  switch (toolName) {
    case "searchPortfolio": {
      const query = input?.query;
      return typeof query === "string"
        ? `Querying "${query}"…`
        : "Querying knowledge base…";
    }
    case "listProjects":
      return "Fetching project list…";
    case "getProjectDetails": {
      const slug = input?.slug;
      return typeof slug === "string" ? `Loading ${slug}…` : "Loading project…";
    }
    case "getWorkExperience":
      return "Fetching work history…";
    case "getAboutMihai":
      return "Fetching bio & contact info…";
    case "getBlogPosts":
      return "Loading articles…";
    case "getCurrentTime":
      return "Checking clock…";
    default:
      return "Processing…";
  }
}

function getToolSummary(
  toolName: string,
  isActive: boolean,
  part: MessagePart
): string {
  if (isActive) {
    return getActiveSummary(toolName, part);
  }

  const output = (part as { output?: unknown }).output;
  const count =
    output && typeof output === "object"
      ? (((output as Record<string, unknown>).resultsCount as
          | number
          | undefined) ??
        ((output as Record<string, unknown>).count as number | undefined))
      : undefined;

  switch (toolName) {
    case "searchPortfolio":
      return count !== undefined
        ? `Found ${count} result${count !== 1 ? "s" : ""}`
        : "Search complete";
    case "listProjects":
      return count !== undefined
        ? `Found ${count} project${count !== 1 ? "s" : ""}`
        : "Projects loaded";
    case "getProjectDetails": {
      if (output && typeof output === "object") {
        const r = output as Record<string, unknown>;
        if (r.found === false) {
          return "Project not found";
        }
        if (typeof r.name === "string") {
          return `Loaded ${r.name}`;
        }
      }
      return "Loaded project details";
    }
    case "getWorkExperience":
      return count !== undefined
        ? `Found ${count} position${count !== 1 ? "s" : ""}`
        : "Work history loaded";
    case "getAboutMihai":
      return count !== undefined
        ? `Loaded ${count} note${count !== 1 ? "s" : ""}`
        : "Loaded background info";
    case "getBlogPosts":
      return count !== undefined
        ? `Found ${count} post${count !== 1 ? "s" : ""}`
        : "Blog posts loaded";
    case "getCurrentTime": {
      if (output && typeof output === "object") {
        const formatted = (output as Record<string, unknown>).formatted;
        if (typeof formatted === "string") {
          return formatted;
        }
      }
      return "Got the time";
    }
    default:
      return "Done";
  }
}

export interface ToolCallProps {
  part: MessagePart;
  isStreaming?: boolean;
}

export function ToolCall({ part, isStreaming }: ToolCallProps) {
  const toolName = extractToolName(part) ?? "unknown";
  const state = extractRenderState(part, isStreaming);
  const label = getToolLabel(toolName);
  const isActive = state.running;

  const summary = getToolSummary(toolName, isActive, part);

  return (
    <ToolLayout
      icon={getToolIcon(toolName)}
      name={isActive ? `${label.active}…` : label.done}
      state={state}
      summary={summary}
    />
  );
}
