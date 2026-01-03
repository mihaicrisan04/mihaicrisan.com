"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createContext, type ReactNode, useContext, useEffect } from "react";

interface KeyboardShortcutsContextValue {
  shortcuts: {
    home: string;
    work: string;
    theme: string;
  };
}

const KeyboardShortcutsContext =
  createContext<KeyboardShortcutsContextValue | null>(null);

export function KeyboardShortcutsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const shortcuts = {
    home: "H",
    work: "W",
    theme: "L",
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ignore if any modifier keys are pressed (except shift for uppercase)
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const key = e.key.toLowerCase();

      switch (key) {
        case "h":
          if (pathname !== "/") {
            e.preventDefault();
            router.push("/");
          }
          break;
        case "w":
          if (pathname !== "/work" && !pathname?.startsWith("/work/")) {
            e.preventDefault();
            router.push("/work");
          }
          break;
        case "l":
          e.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, pathname, theme, setTheme]);

  return (
    <KeyboardShortcutsContext.Provider value={{ shortcuts }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error(
      "useKeyboardShortcuts must be used within KeyboardShortcutsProvider"
    );
  }
  return context;
}
