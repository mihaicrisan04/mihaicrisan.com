"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

const StyleLab =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () => import("@/components/dev/style-lab").then((m) => m.StyleLab),
        { ssr: false }
      )
    : () => null;

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
      <StyleLab />
    </ThemeProvider>
  );
}
