"use client";

import { useUIMessages } from "@convex-dev/agent/react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAIChat } from "@/contexts/ai-chat-context";
import { api } from "@/convex/_generated/api";
import type { UIMessage } from "@/lib/chat-types";
import { AIChatInput } from "./ai-chat-input";
import { AIChatMessages } from "./ai-chat-messages";

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      aria-label="Close chat"
      className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-border/20 bg-muted/20 text-muted-foreground/90 transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={onClick}
      transition={{
        opacity: { delay: 0.05, duration: 0.15, ease: [0.4, 0, 0.2, 1] },
        scale: { type: "spring", stiffness: 700, damping: 15 },
      }}
      type="button"
      whileHover={{ scale: 1.15 }}
    >
      <X className="h-4 w-4" />
    </motion.button>
  );
}

export function AIChatPopover() {
  const { isOpen, close, threadId, isLoading, sendMessage } = useAIChat();
  const [input, setInput] = useState("");
  const [optimisticMsg, setOptimisticMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Subscribe to thread messages via Convex Agent
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
        m.parts?.some(
          (p) =>
            p?.type === "text" && (p.text ?? "").trim() === optimisticMsg.trim()
        )
    );
    if (found) {
      setOptimisticMsg(null);
    }
  }, [messages, optimisticMsg]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <motion.div
            animate={{ backdropFilter: "blur(10px) opacity(1)" }}
            className="absolute inset-0 bg-background/90"
            exit={{ backdropFilter: "blur(0px) opacity(0)" }}
            initial={{ backdropFilter: "blur(0px) opacity(0)" }}
            onClick={close}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Chat container */}
          <motion.div
            animate={{ opacity: 1 }}
            className="relative z-10 flex h-full w-full flex-col"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CloseButton onClick={close} />

            {/* Messages area */}
            <motion.div
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative flex-1 overflow-hidden"
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              transition={{
                delay: 0.05,
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="absolute inset-0">
                <AIChatMessages
                  isLoading={isLoading}
                  messages={messages}
                  onSuggestionClick={handleSuggestionClick}
                  optimisticMsg={optimisticMsg}
                />
              </div>
            </motion.div>

            {/* Input area */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 mx-auto w-full max-w-2xl px-4 pb-4"
              exit={{ opacity: 0, y: 12 }}
              initial={{ opacity: 0, y: 12 }}
              transition={{
                delay: 0.1,
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <AIChatInput
                inputRef={inputRef}
                isStreaming={isLoading}
                onChange={setInput}
                onSubmit={handleSubmit}
                onSuggestionClick={handleSuggestionClick}
                suggestions={[]}
                value={input}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
