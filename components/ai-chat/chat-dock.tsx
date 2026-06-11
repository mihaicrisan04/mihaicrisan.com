"use client";

import { useUIMessages } from "@convex-dev/agent/react";
import { MessageCircle, Plus, X } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAIChat } from "@/contexts/ai-chat-context";
import { api } from "@/convex/_generated/api";
import type { UIMessage } from "@/lib/chat-types";
import { AIChatInput } from "./ai-chat-input";
import { AIChatMessages } from "./ai-chat-messages";

const ICON_BUTTON_CLS =
  "inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground";

// Same spring as motion-primitives/morphing-popover — proven morph feel in-repo
const MORPH_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.4,
};

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeToDesktop(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

// matchMedia via useSyncExternalStore — correct from the first client frame
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true
  );
}

export function ChatDock() {
  const { isOpen, open, close, newChat, threadId, isLoading, sendMessage } =
    useAIChat();
  const isDesktop = useIsDesktop();
  const [input, setInput] = useState("");
  const [optimisticMsg, setOptimisticMsg] = useState<string | null>(null);
  const [lastSendTimestamp, setLastSendTimestamp] = useState<number | null>(
    null
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

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

  // Focus input when chat opens; return focus to the trigger on close
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    if (wasOpenRef.current) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  // Track previous open state (after the focus effect reads it)
  useEffect(() => {
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Lock body scroll while open on mobile only (desktop widget is non-modal)
  useEffect(() => {
    if (!isOpen || isDesktop) {
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isDesktop]);

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

  const handleNewChat = useCallback(() => {
    newChat();
    setOptimisticMsg(null);
    setLastSendTimestamp(null);
    setInput("");
    inputRef.current?.focus();
  }, [newChat]);

  return (
    <MotionConfig transition={MORPH_TRANSITION}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            aria-expanded={isOpen}
            aria-label="open chat (⌘I)"
            className={`${ICON_BUTTON_CLS} ${isOpen ? "pointer-events-none" : ""}`.trim()}
            layoutId="chat-dock"
            onClick={isOpen ? close : open}
            ref={triggerRef}
            tabIndex={isOpen ? -1 : 0}
            type="button"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent className="font-mono" side="top" sideOffset={6}>
          chat · ⌘I
        </TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            aria-label="chat with zuzu"
            aria-modal={isDesktop ? undefined : true}
            className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-svh w-auto flex-col overflow-hidden bg-background/95 backdrop-blur-md md:top-auto md:right-6 md:bottom-6 md:left-auto md:h-[min(75svh,44rem)] md:w-[360px] md:rounded-2xl md:border md:shadow-lg"
            role={isDesktop ? undefined : "dialog"}
            style={{ borderRadius: isDesktop ? 16 : 0 }}
            // On mobile the button→fullscreen layout morph reads as a smear —
            // use a slide-up fade there instead and keep the morph on desktop
            {...(isDesktop
              ? { layoutId: "chat-dock" }
              : {
                  initial: { opacity: 0, y: 24 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 24 },
                  transition: {
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1] as const,
                  },
                })}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full min-h-0 flex-col"
              exit={{
                opacity: 0,
                transition: { duration: 0.1, ease: "easeOut" },
              }}
              initial={{ opacity: 0, y: 8 }}
              transition={{
                delay: 0.08,
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <header className="flex items-center justify-between border-border/40 border-b py-1.5 pr-1.5 pl-4">
                <span className="font-mono text-muted-foreground text-xs">
                  zuzu
                </span>
                <div className="flex items-center">
                  <button
                    aria-label="new chat"
                    className={ICON_BUTTON_CLS}
                    onClick={handleNewChat}
                    type="button"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="close chat"
                    className={ICON_BUTTON_CLS}
                    onClick={close}
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
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

              <div className="px-3 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3">
                <AIChatInput
                  inputRef={inputRef}
                  isStreaming={isLoading}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  placeholder="ask zuzu anything..."
                  value={input}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
