"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createContext, type ReactNode, useContext, useEffect } from "react";

interface KeyboardShortcutsContextValue {
  shortcuts: {
    home: string;
    work: string;
    setup: string;
    blog: string;
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
    setup: "S",
    blog: "B",
    theme: "L",
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      const key = e.key.toLowerCase();
      const navigate = (target: string) => {
        if (pathname !== target && !pathname?.startsWith(`${target}/`)) {
          e.preventDefault();
          router.push(target);
        }
      };

      switch (key) {
        case "h":
          navigate("/");
          break;
        case "w":
          navigate("/work");
          break;
        case "s":
          navigate("/setup");
          break;
        case "b":
          navigate("/blog");
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
