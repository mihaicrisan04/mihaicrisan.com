"use client";

import { useAction, useMutation } from "convex/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
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

  const sendMessage = useCallback(
    async (question: string) => {
      setIsLoading(true);

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
        toast.error("Failed to get a response. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [threadId, createThread, sendMessageAction]
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const newChat = useCallback(() => setThreadId(null), []);

  const value = useMemo(
    () => ({ isOpen, threadId, isLoading, open, close, newChat, sendMessage }),
    [isOpen, threadId, isLoading, open, close, newChat, sendMessage]
  );

  return <AIChatContext value={value}>{children}</AIChatContext>;
}
