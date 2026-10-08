"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableSystem={false}
      storageKey="theme"
    >
      <KeyboardShortcuts />
      {children}
    </ThemeProvider>
  );
}
