"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { MarqueeFade } from "@/components/ui/shadcn-io/marquee";
import { useAIChat } from "@/contexts/ai-chat-context";
import { useAIChatStream } from "@/hooks/use-ai-chat-stream";
import { AIChatInput } from "./ai-chat-input";
import { AIChatMessages } from "./ai-chat-messages";
import { SUGGESTIONS, WELCOME_MESSAGE } from "./constants";

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
  const { isOpen, close, threadId, setThreadId } = useAIChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<
    string | null
  >(null);

  const {
    messages,
    isStreaming,
    sendMessage,
    regenerateMessage,
    initializeWithWelcome,
  } = useAIChatStream({
    threadId,
    onThreadIdChange: setThreadId,
  });

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeWithWelcome(WELCOME_MESSAGE);
    }
  }, [isOpen, messages.length, initializeWithWelcome]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timeoutId = setTimeout(() => {
        const inputEl = inputRef.current;
        if (inputEl) {
          inputEl.focus();
          const length = inputEl.value.length;
          inputEl.setSelectionRange(length, length);
        }
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

  const handleSendMessage = async () => {
    const content = input.trim();
    setInput("");
    await sendMessage(content);
  };

  const handleRegenerate = async (messageId: string) => {
    setRegeneratingMessageId(messageId);
    await regenerateMessage(messageId);
    setRegeneratingMessageId(null);
  };

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

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
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Chat container */}
          <motion.div
            animate={{ opacity: 1 }}
            className="relative z-10 mx-auto flex h-full w-full max-w-2xl flex-col"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CloseButton onClick={close} />

            <MarqueeFade
              className="h-15 bg-linear-to-t from-background to-transparent"
              side="top"
            />

            {/* Messages area */}
            <motion.div
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative mt-15 flex-1 overflow-hidden"
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              transition={{
                delay: 0.05,
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="absolute inset-0">
                <AIChatMessages
                  copiedMessageId={copiedMessageId}
                  messages={messages}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerate}
                  regeneratingMessageId={regeneratingMessageId}
                />
              </div>
            </motion.div>

            <MarqueeFade
              className="absolute right-0 bottom-0 left-0 h-33 bg-linear-to-b from-background to-transparent"
              side="bottom"
            />

            {/* Input area */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 px-4 pb-4"
              exit={{ opacity: 0, y: 12 }}
              initial={{ opacity: 0, y: 12 }}
              transition={{
                delay: 0.1,
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <AIChatInput
                inputRef={inputRef}
                isStreaming={isStreaming}
                onChange={setInput}
                onSubmit={handleSendMessage}
                onSuggestionClick={setInput}
                suggestions={SUGGESTIONS}
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
