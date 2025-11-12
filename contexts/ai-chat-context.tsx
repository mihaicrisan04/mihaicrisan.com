'use client';

import { createContext, useContext, useState, ReactNode, useId } from 'react';

type AIChatContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
};

const AIChatContext = createContext<AIChatContextValue | null>(null);

export function AIChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <AIChatContext.Provider
      value={{ isOpen, open, close, setIsOpen, uniqueId }}
    >
      {children}
    </AIChatContext.Provider>
  );
}

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within AIChatProvider');
  }
  return context;
}