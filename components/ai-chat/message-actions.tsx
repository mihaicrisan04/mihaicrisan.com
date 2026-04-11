"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface MessageActionsBarProps {
  text: string;
  align?: "start" | "end";
  timestamp?: number;
  forceVisible?: boolean;
  className?: string;
}

function formatTimestamp(ts?: number): string | null {
  if (!ts) {
    return null;
  }
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) {
    return "just now";
  }
  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m ago`;
  }
  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)}h ago`;
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function MessageActionsBar({
  text,
  align = "start",
  timestamp,
  forceVisible = false,
  className,
}: MessageActionsBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const relativeTime = formatTimestamp(timestamp);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[11px] text-muted-foreground transition-opacity duration-100 ease-out",
        "group-focus-within:opacity-100 group-hover:opacity-100",
        forceVisible ? "opacity-100" : "opacity-0",
        align === "end" ? "justify-end" : "justify-start",
        className
      )}
    >
      <button
        aria-label={copied ? "Copied" : "Copy message"}
        className="inline-flex size-5 items-center justify-center rounded transition-colors hover:bg-muted hover:text-foreground"
        onClick={() => {
          handleCopy().catch(() => undefined);
        }}
        type="button"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </button>
      {relativeTime ? <span>{relativeTime}</span> : null}
    </div>
  );
}

MessageActionsBar.displayName = "MessageActionsBar";

export { MessageActionsBar };
