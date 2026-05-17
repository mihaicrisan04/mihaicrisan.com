"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import type React from "react";
import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ToolRenderState {
  running: boolean;
  error?: string;
}

export interface ToolLayoutProps {
  name: string;
  summary: ReactNode;
  summaryClassName?: string;
  meta?: ReactNode;
  rightAlignMeta?: boolean;
  state: ToolRenderState;
  expandedContent?: ReactNode;
  defaultExpanded?: boolean;
  icon?: ReactNode;
  nameClassName?: string;
}

function StatusIndicator({ state }: { state: ToolRenderState }) {
  if (state.running) {
    return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
  }

  const color = state.error ? "bg-red-500" : "bg-green-500";
  return <span className={cn("inline-block h-2 w-2 rounded-full", color)} />;
}

function hasRenderableContent(value: ReactNode) {
  return (
    value !== null && value !== undefined && value !== false && value !== ""
  );
}

const EXPANDED_CONTENT_TRANSITION_MS = 200;

export function ToolLayout({
  name,
  summary,
  summaryClassName,
  meta,
  rightAlignMeta = false,
  state,
  expandedContent,
  defaultExpanded = false,
  icon,
  nameClassName,
}: ToolLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasError = Boolean(state.error);
  const hasExpandedDetails = hasRenderableContent(expandedContent) || hasError;
  const hasMeta = hasRenderableContent(meta);
  const hasSummary =
    typeof summary === "string" ? summary.trim().length > 0 : summary != null;
  const isExpandedPanelVisible = isExpanded && hasExpandedDetails;
  const [shouldRenderExpandedContent, setShouldRenderExpandedContent] =
    useState(defaultExpanded && hasExpandedDetails);

  const showErrorHeader = hasError;
  const hasTrailingMeta = !showErrorHeader && hasMeta;

  useEffect(() => {
    if (!hasExpandedDetails) {
      setShouldRenderExpandedContent(false);
      return;
    }

    if (isExpandedPanelVisible) {
      setShouldRenderExpandedContent(true);
      return;
    }

    if (!shouldRenderExpandedContent) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShouldRenderExpandedContent(false);
    }, EXPANDED_CONTENT_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [hasExpandedDetails, isExpandedPanelVisible, shouldRenderExpandedContent]);

  const handleToggle = () => {
    if (!hasExpandedDetails) {
      return;
    }
    const nextExpanded = !isExpanded;
    if (nextExpanded) {
      setShouldRenderExpandedContent(true);
    }
    setIsExpanded(nextExpanded);
  };

  const isRunning = state.running;
  const resolvedIcon = isRunning ? (
    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
  ) : (
    (icon ?? <StatusIndicator state={state} />)
  );

  return (
    <div className="-mx-1.5 rounded-md border border-transparent bg-transparent">
      <div
        className={cn(
          "group flex min-w-0 select-none items-center gap-2 rounded-md px-1.5 py-1 text-sm",
          hasExpandedDetails &&
            "cursor-pointer transition-colors hover:bg-muted/50"
        )}
        {...(hasExpandedDetails && {
          onClick: handleToggle,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          },
          role: "button",
          tabIndex: 0,
          "aria-expanded": isExpanded,
        })}
      >
        {/* Icon area */}
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground/70">
          {hasExpandedDetails && !isRunning ? (
            <>
              <span className="group-hover:hidden">{resolvedIcon}</span>
              {isExpandedPanelVisible ? (
                <Minus className="hidden h-3.5 w-3.5 text-muted-foreground group-hover:block" />
              ) : (
                <Plus className="hidden h-3.5 w-3.5 text-muted-foreground group-hover:block" />
              )}
            </>
          ) : (
            resolvedIcon
          )}
        </span>

        {/* Name + summary */}
        <span
          className={cn(
            "min-w-0 shrink truncate font-medium leading-none",
            showErrorHeader ? "text-red-500" : "text-foreground",
            nameClassName
          )}
        >
          {name}
        </span>

        <div className="flex min-w-0 flex-1 items-baseline gap-1.5 overflow-hidden">
          {hasSummary && (
            <span
              className={cn(
                "min-w-0 shrink truncate font-mono text-[13px] leading-none",
                showErrorHeader ? "text-red-400/80" : "text-muted-foreground",
                summaryClassName
              )}
            >
              {summary}
            </span>
          )}

          {rightAlignMeta && <span className="flex-1" />}

          {hasTrailingMeta && (
            <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[12px] text-muted-foreground/60 leading-none">
              {meta}
            </span>
          )}
        </div>
      </div>

      {hasExpandedDetails && (
        <div
          aria-hidden={!isExpandedPanelVisible}
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity,margin-top] motion-reduce:transition-none",
            isExpandedPanelVisible
              ? "mt-1.5 grid-rows-[1fr] opacity-100 duration-200 ease-out"
              : "pointer-events-none grid-rows-[0fr] opacity-0 duration-150 ease-out"
          )}
          inert={isExpandedPanelVisible ? undefined : true}
        >
          <div className="min-h-0">
            {shouldRenderExpandedContent && (
              <div className="space-y-2 pb-1">
                {hasError && !hasRenderableContent(expandedContent) && (
                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2 font-mono text-red-400 text-xs leading-relaxed">
                    {state.error}
                  </pre>
                )}
                {expandedContent}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
