"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useState,
} from "react";

interface AIChatContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  // Thread management for agent conversations
  threadId: string | null;
  setThreadId: (id: string | null) => void;
  resetThread: () => void;
}

const AIChatContext = createContext<AIChatContextValue | null>(null);

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const uniqueId = useId();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const resetThread = () => setThreadId(null);

  return (
    <AIChatContext.Provider
      value={{
        isOpen,
        open,
        close,
        setIsOpen,
        uniqueId,
        threadId,
        setThreadId,
        resetThread,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error("useAIChat must be used within AIChatProvider");
  }
  return context;
}
