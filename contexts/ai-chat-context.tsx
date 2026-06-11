"use client";

import { useAction, useMutation, useQuery } from "convex/react";
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

const THREAD_STORAGE_KEY = "zuzu:thread-id";
const THREAD_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // ~7 days

// All storage access is SSR-guarded and failure-tolerant: any problem
// (corrupted JSON, disabled storage, expired entry) reads as "no thread".
function readStoredThreadId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(THREAD_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { id?: unknown; savedAt?: unknown };
    if (typeof parsed.id !== "string" || typeof parsed.savedAt !== "number") {
      window.localStorage.removeItem(THREAD_STORAGE_KEY);
      return null;
    }
    if (Date.now() - parsed.savedAt > THREAD_MAX_AGE_MS) {
      window.localStorage.removeItem(THREAD_STORAGE_KEY);
      return null;
    }
    return parsed.id;
  } catch {
    return null;
  }
}

function writeStoredThreadId(id: string) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(
      THREAD_STORAGE_KEY,
      JSON.stringify({ id, savedAt: Date.now() })
    );
  } catch {
    // storage full/blocked — persistence is best-effort
  }
}

function clearStoredThreadId() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(THREAD_STORAGE_KEY);
  } catch {
    // ignore
  }
}

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
  // Persisted thread id awaiting server-side validation before we subscribe
  const [candidateThreadId, setCandidateThreadId] = useState<string | null>(
    null
  );

  const createThread = useMutation(api.agent.createThread);
  const sendMessageAction = useAction(api.streamChat.sendMessage);
  const stopStreaming = useMutation(api.threads.stopStreaming);

  // Rehydrate from localStorage on mount (client only)
  useEffect(() => {
    const stored = readStoredThreadId();
    if (stored) {
      setCandidateThreadId(stored);
    }
  }, []);

  // Validate before adopting — a stale id would throw inside useUIMessages
  const candidateIsValid = useQuery(
    api.threads.validateThread,
    candidateThreadId ? { threadId: candidateThreadId } : "skip"
  );

  useEffect(() => {
    if (!candidateThreadId || candidateIsValid === undefined) {
      return;
    }
    if (candidateIsValid) {
      // don't clobber a thread the user already started while we validated
      setThreadId((current) => current ?? candidateThreadId);
    } else {
      clearStoredThreadId();
    }
    setCandidateThreadId(null);
  }, [candidateThreadId, candidateIsValid]);

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
          writeStoredThreadId(currentThreadId);
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
  const newChat = useCallback(() => {
    setThreadId(null);
    setCandidateThreadId(null);
    clearStoredThreadId();
  }, []);

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
