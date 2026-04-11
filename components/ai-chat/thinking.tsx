"use client";

import { BrainCircuit, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface ThinkingProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
}

const MIN_SHIMMER_MS = 800;

function Thinking({ text, isStreaming = false, className }: ThinkingProps) {
  const [open, setOpen] = useState(isStreaming);
  const [displayDone, setDisplayDone] = useState(!isStreaming);
  const mountedAt = useRef(Date.now());
  const doneRef = useRef(false);
  const wasStreamingRef = useRef(isStreaming);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming && !wasStreamingRef.current) {
      setOpen(true);
    }
    wasStreamingRef.current = isStreaming;
  }, [isStreaming]);

  useEffect(() => {
    if (doneRef.current) {
      return;
    }
    if (!isStreaming) {
      const elapsed = Date.now() - mountedAt.current;
      const remaining = Math.max(0, MIN_SHIMMER_MS - elapsed);
      const timer = setTimeout(() => {
        doneRef.current = true;
        setDisplayDone(true);
        setOpen(false);
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [isStreaming]);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (isStreaming && open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text, isStreaming, open]);

  const showAsActive = !displayDone;
  const hasText = text.trim().length > 0;

  return (
    <div className={cn("inline-flex flex-col", className)}>
      <Collapsible onOpenChange={setOpen} open={open}>
        <CollapsibleTrigger className="group/thinking -mx-1 inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-left text-muted-foreground text-sm transition-colors hover:text-foreground">
          <span className="inline-flex size-4 shrink-0 items-center justify-center">
            {showAsActive ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <BrainCircuit className="size-4" />
            )}
          </span>
          {showAsActive ? (
            <TextShimmer className="text-sm" duration={2}>
              Thinking...
            </TextShimmer>
          ) : (
            <span>Thought</span>
          )}
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 opacity-0 transition-all duration-150 group-hover/thinking:opacity-100",
              open && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {hasText ? (
            <div className="ml-[7px] grid grid-cols-[min-content_minmax(0,1fr)] items-start gap-x-3">
              <div className="h-full w-[2px] self-stretch bg-muted" />
              <div
                className="mask-t-from-95% mask-b-from-90% max-h-48 overflow-y-auto [scrollbar-color:var(--scrollbar-color)_transparent]"
                ref={scrollRef}
              >
                <div className="whitespace-pre-wrap text-[12px] text-muted-foreground/60 leading-relaxed">
                  {text}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/50 italic">
              No reasoning yet
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

Thinking.displayName = "Thinking";

export { Thinking };
