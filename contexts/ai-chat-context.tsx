"use client";

import { useAction, useMutation } from "convex/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

interface AIChatState {
  isOpen: boolean;
  threadId: string | null;
  isLoading: boolean;
  open: () => void;
  close: () => void;
  newChat: () => void;
  sendMessage: (question: string) => void;
  stop: () => void;
}

const AIChatContext = createContext<AIChatState | null>(null);

export function useAIChat() {
  const ctx = useContext(AIChatContext);
  if (!ctx) {
    throw new Error("useAIChat must be used within AIChatProvider");
  }
  return ctx;
}

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createThread = useMutation(api.agent.createThread);
  const sendMessageAction = useAction(api.streamChat.sendMessage);
  const stopStreaming = useMutation(api.threads.stopStreaming);

  // Set when the user hits stop, so the aborted action doesn't toast an error
  const stopRequestedRef = useRef(false);

  const sendMessage = useCallback(
    async (question: string) => {
      setIsLoading(true);
      stopRequestedRef.current = false;

      try {
        let currentThreadId = threadId;

        // create thread first (instant mutation) so useUIMessages can subscribe
        if (!currentThreadId) {
          const result = await createThread({});
          currentThreadId = result.threadId;
          setThreadId(currentThreadId);
        }

        // now stream into the thread (useUIMessages is already subscribed)
        await sendMessageAction({
          threadId: currentThreadId,
          message: question,
        });
      } catch {
        // stopping is intentional — keep the partial text, no error toast
        if (!stopRequestedRef.current) {
          toast.error("Failed to get a response. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [threadId, createThread, sendMessageAction]
  );

  const stop = useCallback(() => {
    if (!threadId) {
      return;
    }
    stopRequestedRef.current = true;
    // optimistic: the UI goes idle immediately, the abort lands server-side
    setIsLoading(false);
    stopStreaming({ threadId }).catch(() => {
      // nothing to abort (already finished) — fine either way
    });
  }, [threadId, stopStreaming]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const newChat = useCallback(() => setThreadId(null), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      threadId,
      isLoading,
      open,
      close,
      newChat,
      sendMessage,
      stop,
    }),
    [isOpen, threadId, isLoading, open, close, newChat, sendMessage, stop]
  );

  return <AIChatContext value={value}>{children}</AIChatContext>;
}
