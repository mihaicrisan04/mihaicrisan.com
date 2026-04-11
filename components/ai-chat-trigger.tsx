"use client";

import { useEffect } from "react";
import { useAIChat } from "@/contexts/ai-chat-context";

export function AIChatTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { open, isOpen } = useAIChat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) {
          open();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isOpen]);

  return (
    <button
      aria-label="Ask Zuzu"
      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 font-medium text-foreground text-sm transition-all hover:bg-muted"
      onClick={(e) => {
        open();
        props.onClick?.(e);
      }}
      type="button"
      {...props}
    >
      <span className="font-bold text-sm tracking-tight">Z</span>
      <span className="hidden text-sm sm:inline">ask zuzu</span>
    </button>
  );
}
