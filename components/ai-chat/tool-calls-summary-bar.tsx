"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatusWordPair {
  present: string;
  past: string;
}

const STATUS_WORD_PAIRS: StatusWordPair[] = [
  { present: "Pondering", past: "Pondered" },
  { present: "Crafting", past: "Crafted" },
  { present: "Vibing", past: "Vibed" },
  { present: "Simmering", past: "Simmered" },
  { present: "Marinating", past: "Marinated" },
  { present: "Philosophising", past: "Philosophised" },
  { present: "Ruminating", past: "Ruminated" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    // biome-ignore lint/suspicious/noBitwiseOperators: unsigned right shift for hash
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getStatusWordPair(seed: string | null): StatusWordPair {
  if (!seed) {
    return STATUS_WORD_PAIRS[0];
  }
  return STATUS_WORD_PAIRS[hashString(seed) % STATUS_WORD_PAIRS.length];
}

function formatElapsedTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) {
    return `${mins}m`;
  }
  return `${mins}m ${secs}s`;
}

function renderSegments(segments: string[]) {
  return segments.map((segment, _i) => (
    <span key={segment}>
      <span className="text-muted-foreground/40"> · </span>
      {segment}
    </span>
  ));
}

export function ToolCallsSummaryBar({
  isExpanded,
  onToggle,
  isStreaming,
  toolCallCount,
  startedAt,
  statusWordSeed,
}: {
  isExpanded: boolean;
  onToggle: () => void;
  isStreaming: boolean;
  toolCallCount: number;
  startedAt: string | null;
  statusWordSeed: string | null;
}) {
  const startMs = startedAt ? new Date(startedAt).getTime() : null;

  const computeLiveElapsed = () =>
    startMs != null
      ? Math.max(0, Math.floor((Date.now() - startMs) / 1000))
      : 0;

  const [liveElapsed, setLiveElapsed] = useState(computeLiveElapsed);

  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    setLiveElapsed(computeLiveElapsed());
    const interval = setInterval(() => {
      setLiveElapsed(computeLiveElapsed());
    }, 1000);

    return () => clearInterval(interval);
    // biome-ignore lint/correctness/useExhaustiveDependencies: stable per startMs
  }, [isStreaming, computeLiveElapsed]);

  const elapsedSeconds = liveElapsed;

  const statusWordPair = getStatusWordPair(statusWordSeed);
  const statusLabel = isStreaming
    ? `${statusWordPair.present}…`
    : statusWordPair.past;
  const toolCallLabel =
    toolCallCount > 0
      ? `${toolCallCount} tool call${toolCallCount !== 1 ? "s" : ""}`
      : null;

  const segments: string[] = [];

  if (elapsedSeconds > 0) {
    segments.push(formatElapsedTime(elapsedSeconds));
  }

  if (toolCallLabel) {
    segments.push(toolCallLabel);
  }

  const fullSummary = [statusLabel, ...segments].join(" · ");

  return (
    <div className="my-1.5 border border-transparent py-0.5">
      <button
        aria-label={fullSummary}
        className={cn(
          "group flex w-full max-w-full items-center gap-2 rounded-md py-px text-left text-muted-foreground text-sm tabular-nums transition-colors hover:text-foreground sm:inline-flex sm:w-auto",
          isStreaming && "text-foreground/90"
        )}
        onClick={onToggle}
        title={fullSummary}
        type="button"
      >
        <span className="flex size-3.5 shrink-0 items-center justify-center">
          <span
            className={cn(
              "inline-block size-2 rounded-full",
              isStreaming
                ? "animate-pulse bg-muted-foreground"
                : "bg-muted-foreground/50"
            )}
          />
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 overflow-hidden whitespace-nowrap leading-none sm:flex-none sm:overflow-visible sm:whitespace-normal",
            isStreaming && "animate-pulse motion-reduce:animate-none"
          )}
        >
          {statusLabel}
          {segments.length > 0 && (
            <span className="inline">{renderSegments(segments)}</span>
          )}
        </span>
        <ChevronRight
          className={cn(
            "size-3 shrink-0 text-muted-foreground/50 transition-transform duration-200 ease-out motion-reduce:transition-none",
            isExpanded && "rotate-90"
          )}
        />
      </button>
    </div>
  );
}
