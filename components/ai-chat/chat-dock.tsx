"use client";

import { useUIMessages } from "@convex-dev/agent/react";
import { MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAIChat } from "@/contexts/ai-chat-context";
import { api } from "@/convex/_generated/api";
import type { UIMessage } from "@/lib/chat-types";
import { AIChatInput } from "./ai-chat-input";
import { AIChatMessages } from "./ai-chat-messages";

const ICON_BUTTON_CLS =
  "inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground";

export function ChatDock() {
  const { isOpen, open, close, threadId, isLoading, sendMessage } = useAIChat();
  const [input, setInput] = useState("");
  const [optimisticMsg, setOptimisticMsg] = useState<string | null>(null);
  const [lastSendTimestamp, setLastSendTimestamp] = useState<number | null>(
    null
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messagesResult = useUIMessages(
    api.queries.listThreadMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true }
  );

  const messages = (messagesResult?.results ?? []) as UIMessage[];

  // Clear optimistic message once the matching real user message shows up
  useEffect(() => {
    if (!optimisticMsg) {
      return;
    }
    const found = messages.some(
      (m) =>
        m.role === "user" &&
        m.parts.some(
          (p) =>
            p.type === "text" &&
            (p as { text: string }).text.trim() === optimisticMsg.trim()
        )
    );
    if (found) {
      setOptimisticMsg(null);
    }
  }, [messages, optimisticMsg]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, close]);

  const handleSend = useCallback(
    (question: string) => {
      setOptimisticMsg(question);
      setLastSendTimestamp(Date.now());
      sendMessage(question);
    },
    [sendMessage]
  );

  const handleSubmit = useCallback(() => {
    const content = input.trim();
    if (!content || isLoading) {
      return;
    }
    setInput("");
    handleSend(content);
  }, [input, isLoading, handleSend]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setInput("");
      handleSend(suggestion);
    },
    [handleSend]
  );

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-label="open chat (⌘I)"
        className={ICON_BUTTON_CLS}
        onClick={isOpen ? close : open}
        type="button"
      >
        <MessageCircle className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="fixed right-6 bottom-6 z-50 flex h-[min(75svh,44rem)] w-[360px] flex-col overflow-hidden rounded-2xl border bg-background/95 shadow-lg backdrop-blur-md">
          <header className="flex items-center justify-between border-border/40 border-b py-1.5 pr-1.5 pl-4">
            <span className="font-mono text-muted-foreground text-xs">
              zuzu
            </span>
            <button
              aria-label="close chat"
              className={ICON_BUTTON_CLS}
              onClick={close}
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </header>

          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0">
              <AIChatMessages
                isLoading={isLoading}
                lastSendTimestamp={lastSendTimestamp}
                messages={messages}
                onSuggestionClick={handleSuggestionClick}
                optimisticMsg={optimisticMsg}
              />
            </div>
          </div>

          <div className="px-3 pt-1 pb-3">
            <AIChatInput
              inputRef={inputRef}
              isStreaming={isLoading}
              onChange={setInput}
              onSubmit={handleSubmit}
              placeholder="ask zuzu anything..."
              value={input}
            />
          </div>
        </div>
      )}
    </>
  );
}
