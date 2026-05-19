"use client";

import {
  BookOpen,
  Briefcase,
  Clock,
  FileCode,
  FolderOpen,
  Search,
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
    case "getBlogPosts":
      return <BookOpen className="h-3.5 w-3.5" />;
    case "getCurrentTime":
      return <Clock className="h-3.5 w-3.5" />;
    default:
      return <Wrench className="h-3.5 w-3.5" />;
  }
}

function extractRenderState(
  part: MessagePart,
  isStreaming?: boolean
): ToolRenderState {
  const state =
    part.type === "tool-invocation"
      ? (part as { state?: string }).state
      : undefined;
  const isRunningState =
    state === "call" ||
    state === "partial-call" ||
    state === "input-streaming" ||
    state === "input-available";

  return {
    running: isRunningState && (isStreaming ?? true),
    error:
      state === "output-error"
        ? ((part as { errorText?: string }).errorText ?? "Error")
        : undefined,
  };
}

function getToolSummary(
  toolName: string,
  isActive: boolean,
  part: MessagePart
): string {
  if (isActive) {
    switch (toolName) {
      case "searchPortfolio": {
        const query = (part as { args?: Record<string, unknown> }).args?.query;
        return typeof query === "string"
          ? `Querying "${query}"…`
          : "Querying knowledge base…";
      }
      case "listProjects":
        return "Fetching project list…";
      case "getProjectDetails": {
        const slug = (part as { args?: Record<string, unknown> }).args?.slug;
        return typeof slug === "string"
          ? `Loading ${slug}…`
          : "Loading project…";
      }
      case "getWorkExperience":
        return "Fetching work history…";
      case "getBlogPosts":
        return "Loading articles…";
      case "getCurrentTime":
        return "Checking clock…";
      default:
        return "Processing…";
    }
  }

  const result = (part as { result?: unknown }).result;
  const count =
    result && typeof result === "object"
      ? (((result as Record<string, unknown>).resultsCount as
          | number
          | undefined) ??
        ((result as Record<string, unknown>).count as number | undefined))
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
      if (result && typeof result === "object") {
        const r = result as Record<string, unknown>;
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
    case "getBlogPosts":
      return count !== undefined
        ? `Found ${count} post${count !== 1 ? "s" : ""}`
        : "Blog posts loaded";
    case "getCurrentTime": {
      if (result && typeof result === "object") {
        const formatted = (result as Record<string, unknown>).formatted;
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
