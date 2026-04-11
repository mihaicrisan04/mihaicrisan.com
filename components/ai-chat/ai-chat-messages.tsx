"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { type Ref, useEffect, useState } from "react";
import { useStickToBottom } from "use-stick-to-bottom";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MessagePart, UIMessage } from "@/lib/chat-types";
import { cn } from "@/lib/utils";
import { AIChatMessage } from "./ai-chat-message";
import { SUGGESTIONS } from "./constants";
import { Loader } from "./loader";
import { extractToolName } from "./tool-labels";

function isRenderablePart(p: MessagePart): boolean {
  if (p.type === "text") {
    return (p.text ?? "").trim().length > 0;
  }
  if (p.type === "reasoning") {
    return true;
  }
  if (extractToolName(p) !== null) {
    return true;
  }
  return false;
}

/** Shows typing dots after a delay, resets when shouldShow goes false */
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
}

export function AIChatMessages({
  messages,
  isLoading,
  optimisticMsg,
  onSuggestionClick,
}: AIChatMessagesProps) {
  const { scrollRef, contentRef, isAtBottom, scrollToBottom } =
    useStickToBottom({
      resize: "smooth",
      initial: "instant",
    });

  const isEmpty = messages.length === 0 && !optimisticMsg && !isLoading;

  const lastMsg = messages.at(-1);
  const waitingForFirstDelta =
    !!optimisticMsg ||
    !lastMsg ||
    lastMsg.role !== "assistant" ||
    !(lastMsg.parts ?? []).some(isRenderablePart);
  const shouldShowTyping =
    (isLoading || !!optimisticMsg) && waitingForFirstDelta;

  // Delay the typing indicator by 1s so it doesn't flash immediately
  const showTypingIndicator = useDelayedShow(shouldShowTyping);

  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i]?.role === "assistant") {
        return i;
      }
    }
    return -1;
  })();

  return (
    <div className="relative h-full">
      <ScrollArea
        className="absolute inset-0"
        scrollFade
        viewportRef={scrollRef as Ref<HTMLDivElement>}
      >
        <div
          className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-6 pb-6"
          ref={contentRef}
        >
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16">
              <div className="text-center text-muted-foreground">
                <Sparkles className="mx-auto mb-3 size-8 opacity-20" />
                <p className="font-semibold text-sm">Portfolio Assistant</p>
                <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed opacity-70">
                  Ask about Mihai's projects, skills, experience, or writings.
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
            const key = msg.id ?? msg.key ?? `msg-${index}`;
            const forceActions = index === lastAssistantIndex;
            return (
              <AIChatMessage
                forceActionsVisible={forceActions}
                key={key}
                message={msg}
              />
            );
          })}

          {optimisticMsg ? (
            <div className="group fade-in slide-in-from-bottom-1 flex animate-in flex-col items-end gap-1 duration-200">
              <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground text-sm leading-relaxed">
                {optimisticMsg}
              </div>
              {/* Reserve space matching MessageActionsBar height to prevent shift */}
              <div className="h-5" />
            </div>
          ) : null}

          {showTypingIndicator ? (
            <div className="fade-in animate-in py-1 duration-300">
              <Loader size="sm" variant="typing" />
            </div>
          ) : null}
        </div>
      </ScrollArea>

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
