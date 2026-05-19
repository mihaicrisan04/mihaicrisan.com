"use client";

import { ArrowUp, Square } from "lucide-react";
import { type RefObject, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface AIChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  onStop?: () => void;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  placeholder?: string;
}

// Max height is roughly 3 visible lines
const MAX_LINES_HEIGHT = 150;

export function AIChatInput({
  value,
  onChange,
  onSubmit,
  isStreaming,
  onStop,
  inputRef: externalRef,
  placeholder = "Ask Zuzu anything...",
}: AIChatInputProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = externalRef ?? internalRef;

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = inputRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "0";
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(scrollHeight, MAX_LINES_HEIGHT);
    textarea.style.height = `${newHeight}px`;
  }, [inputRef]);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter (no shift) sends message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleSubmitClick = () => {
    if (isStreaming && onStop) {
      onStop();
    } else if (value.trim()) {
      onSubmit();
    }
  };

  const hasContent = value.trim().length > 0;

  return (
    <div className="rounded-2xl border border-border bg-muted">
      <div className="flex items-end gap-2 p-2">
        <textarea
          className="w-full flex-1 resize-none overflow-y-auto bg-transparent px-2 py-1.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
          disabled={isStreaming}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          rows={1}
          style={{ minHeight: "24px" }}
          value={value}
        />
        <button
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
            isStreaming || hasContent
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "cursor-not-allowed bg-muted-foreground/20 text-muted-foreground"
          )}
          disabled={!(isStreaming || hasContent)}
          onClick={handleSubmitClick}
          type="button"
        >
          {isStreaming ? (
            <Square className="size-3.5" />
          ) : (
            <ArrowUp className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
