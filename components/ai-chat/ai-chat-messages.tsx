"use client";

import { isReasoningUIPart, isToolUIPart } from "ai";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import type { MessagePart, UIMessage } from "@/lib/chat-types";
import { cn } from "@/lib/utils";
import { AIChatMessage } from "./ai-chat-message";
import { SUGGESTIONS } from "./constants";

function hasRenderableAssistantPart(part: MessagePart): boolean {
  if (part.type === "text") {
    return (part as { text: string }).text.length > 0;
  }
  if (isToolUIPart(part)) {
    return true;
  }
  if (isReasoningUIPart(part)) {
    return (
      part.text.length > 0 || (part as { state?: string }).state === "streaming"
    );
  }
  return false;
}

function shouldShowThinkingIndicator(options: {
  isLoading: boolean;
  hasOptimistic: boolean;
  lastMessage: UIMessage | undefined;
}): boolean {
  const { isLoading, hasOptimistic, lastMessage } = options;
  if (!(isLoading || hasOptimistic)) {
    return false;
  }
  if (!lastMessage || lastMessage.role !== "assistant") {
    return true;
  }
  return !lastMessage.parts.some(hasRenderableAssistantPart);
}

function useDelayedShow(shouldShow: boolean, delayMs = 1000): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!shouldShow) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [shouldShow, delayMs]);

  return visible;
}

export interface AIChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  optimisticMsg: string | null;
  onSuggestionClick: (suggestion: string) => void;
  lastSendTimestamp: number | null;
}

export function AIChatMessages({
  messages,
  isLoading,
  optimisticMsg,
  onSuggestionClick,
  lastSendTimestamp,
}: AIChatMessagesProps) {
  const { containerRef, isAtBottom, scrollToBottom } =
    useScrollToBottom<HTMLDivElement>();

  const isEmpty = messages.length === 0 && !optimisticMsg && !isLoading;

  const lastMsg = messages.at(-1);
  const showThinking = useDelayedShow(
    shouldShowThinkingIndicator({
      isLoading,
      hasOptimistic: !!optimisticMsg,
      lastMessage: lastMsg,
    })
  );

  return (
    <div className="relative h-full">
      <div
        className="absolute inset-0 overflow-y-auto [scrollbar-color:var(--scrollbar-color)_transparent]"
        ref={containerRef}
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-6 pb-6">
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
              <div className="text-center text-muted-foreground">
                <p className="mx-auto mb-2 font-bold text-2xl tracking-tight opacity-15">
                  Z
                </p>
                <p className="font-semibold text-sm">Zuzu</p>
                <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed opacity-70">
                  Mihai's AI assistant. Ask about his projects, skills,
                  experience, or writings.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    className="rounded-full border border-border px-3 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                    key={s}
                    onClick={() => onSuggestionClick(s)}
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((msg, index) => {
            const key = msg.id ?? `msg-${index}`;
            const isMessageStreaming =
              isLoading &&
              index === messages.length - 1 &&
              msg.role === "assistant";

            const startedAt =
              isMessageStreaming && lastSendTimestamp
                ? new Date(lastSendTimestamp).toISOString()
                : null;

            return (
              <AIChatMessage
                isStreaming={isMessageStreaming}
                key={key}
                message={msg}
                startedAt={startedAt}
              />
            );
          })}

          {optimisticMsg ? (
            <div className="fade-in slide-in-from-bottom-1 flex animate-in flex-col items-end gap-1 duration-200">
              <div className="flex min-w-0 justify-end py-2">
                <div className="w-fit min-w-0 max-w-[80%]">
                  <div className="rounded-3xl bg-secondary px-4 py-2">
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {optimisticMsg}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {showThinking ? (
            <div className="my-1.5 border border-transparent py-0.5">
              <div className="inline-flex items-center gap-2 rounded-md py-px text-muted-foreground text-sm">
                <span className="flex size-3.5 shrink-0 items-center justify-center">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                </span>
                <span className="leading-none">Thinking…</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <button
        aria-label="Scroll to bottom"
        className={cn(
          "absolute right-6 bottom-3 z-20 flex size-7 items-center justify-center rounded-full border bg-background shadow-sm transition-opacity duration-150",
          isAtBottom ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        onClick={() => scrollToBottom()}
        type="button"
      >
        <ChevronDown className="size-3.5" />
      </button>
    </div>
  );
}
