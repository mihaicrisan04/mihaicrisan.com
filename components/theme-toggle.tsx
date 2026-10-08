"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // dark is the default theme, so assume it until next-themes resolves
  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <button
      aria-label="toggle theme"
      className="cursor-pointer text-muted-foreground/60 transition-colors hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      {isDark ? "dark" : "light"}
    </button>
  );
}
