"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cls = `inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground ${className ?? ""}`;

  return (
    <button
      aria-label="toggle theme"
      className={cls.trim()}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      {mounted && theme === "dark" ? (
        <Moon className="h-3.5 w-3.5" />
      ) : (
        <Sun className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
