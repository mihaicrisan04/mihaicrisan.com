"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Dev-only panel for tuning palette + font live. Loaded from providers in development only.

interface Tokens {
  bg: number;
  fg: number;
  muted: number;
  chroma: number;
  hue: number;
}

interface Palette {
  light: Tokens;
  dark: Tokens;
}

interface LabState extends Palette {
  font: string;
  size: number;
}

type ThemeName = "light" | "dark";

const neutral = (bg: number, fg: number, muted: number): Tokens => ({
  bg,
  fg,
  muted,
  chroma: 0,
  hue: 0,
});

// "current" mirrors globals.css; the rest are the alternatives explored before picking it
const PALETTES: Record<string, Palette> = {
  current: {
    light: neutral(0.97, 0.2, 0.46),
    dark: neutral(0.22, 0.95, 0.76),
  },
  previous: {
    light: neutral(0.9851, 0, 0.5452),
    dark: neutral(0.13, 1, 0.74),
  },
  contrast: {
    light: neutral(0.9851, 0, 0.45),
    dark: neutral(0.13, 1, 0.8),
  },
  softer: {
    light: neutral(0.945, 0.24, 0.45),
    dark: neutral(0.27, 0.93, 0.77),
  },
  warm: {
    light: { bg: 0.968, fg: 0.22, muted: 0.47, chroma: 0.008, hue: 80 },
    dark: { bg: 0.215, fg: 0.94, muted: 0.76, chroma: 0.006, hue: 75 },
  },
};

const DEFAULT_STATE: LabState = {
  ...PALETTES.current,
  font: "geist-mono",
  size: 16,
};

interface Font {
  label: string;
  family?: string;
  google?: string;
}

const FONTS: Record<string, Font> = {
  "geist-mono": { label: "Geist Mono" },
  geist: { label: "Geist", family: '"Geist"', google: "Geist:wght@400;500" },
  inter: {
    label: "Inter",
    family: '"Inter"',
    google: "Inter:wght@300;400;500",
  },
  plex: {
    label: "IBM Plex Sans",
    family: '"IBM Plex Sans"',
    google: "IBM+Plex+Sans:wght@300;400;500",
  },
  helvetica: { label: "Helvetica (trial)", family: '"Helvetica Lab"' },
  newsreader: {
    label: "Newsreader",
    family: '"Newsreader"',
    google: "Newsreader:opsz,wght@6..72,400;6..72,500",
  },
  jetbrains: {
    label: "JetBrains Mono",
    family: '"JetBrains Mono"',
    google: "JetBrains+Mono:wght@400;500",
  },
};

const HELVETICA_FACES = `
@font-face { font-family: "Helvetica Lab"; font-weight: 300; src: url("/dev-fonts/helvetica/helvetica-light.woff2") format("woff2"); }
@font-face { font-family: "Helvetica Lab"; font-weight: 400 500; src: url("/dev-fonts/helvetica/helvetica-regular.woff2") format("woff2"); }
@font-face { font-family: "Helvetica Lab"; font-weight: 600 700; src: url("/dev-fonts/helvetica/helvetica-bold.woff2") format("woff2"); }`;

const STORAGE_KEY = "style-lab";

function color(l: number, t: Tokens) {
  const lightness = Math.min(1, Math.max(0, l)).toFixed(3);
  return `oklch(${lightness} ${t.chroma} ${t.hue})`;
}

// surface offsets reproduce the current globals.css values from the base bg
function themeVars(theme: ThemeName, t: Tokens) {
  const surfaces =
    theme === "light"
      ? {
          card: 0.015,
          popover: 0,
          muted: -0.03,
          secondary: -0.054,
          accent: -0.1,
        }
      : {
          card: 0.03,
          popover: 0.05,
          muted: 0.09,
          secondary: 0.13,
          accent: 0.09,
        };

  const vars = {
    "--background": color(t.bg, t),
    "--card": color(t.bg + surfaces.card, t),
    "--popover": color(t.bg + surfaces.popover, t),
    "--muted": color(t.bg + surfaces.muted, t),
    "--secondary": color(t.bg + surfaces.secondary, t),
    "--input": color(t.bg + surfaces.secondary, t),
    "--accent": color(t.bg + surfaces.accent, t),
    "--border": color(t.bg + surfaces.accent, t),
    "--foreground": color(t.fg, t),
    "--card-foreground": color(t.fg, t),
    "--popover-foreground": color(t.fg, t),
    "--primary": color(t.fg, t),
    "--secondary-foreground": color(t.fg, t),
    "--accent-foreground": color(t.fg, t),
    "--muted-foreground": color(t.muted, t),
    "--ring": color(theme === "light" ? t.fg : t.muted, t),
  };

  return Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
}

function buildCss(state: LabState) {
  const font = FONTS[state.font];
  const parts = [
    `:root:not(.dark) {\n${themeVars("light", state.light)}\n}`,
    `:root.dark {\n${themeVars("dark", state.dark)}\n}`,
    `:root:root {\n  font-size: ${state.size}px;${font.family ? `\n  font-family: ${font.family};` : ""}\n}`,
  ];
  if (state.font === "helvetica") {
    parts.unshift(HELVETICA_FACES.trim());
  }
  return parts.join("\n\n");
}

function useStyleTag(id: string, css: string) {
  useEffect(() => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.append(el);
    }
    el.textContent = css;
  }, [id, css]);
}

function useGoogleFont(google: string | undefined) {
  useEffect(() => {
    if (!google) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${google}&display=swap`;
    document.head.append(link);
    return () => link.remove();
  }, [google]);
}

function toRgb(css: string, base?: number[]) {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) {
    return [0, 0, 0];
  }
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  const alpha = a / 255;
  return [r, g, b].map((v, i) => v * alpha + (base?.[i] ?? 0) * (1 - alpha));
}

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.040_45 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: number[], b: number[]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function measureContrast() {
  const style = getComputedStyle(document.body);
  const bg = toRgb(style.backgroundColor);
  const ratio = (token: string) =>
    contrastRatio(toRgb(style.getPropertyValue(token)), bg);
  return { text: ratio("--foreground"), grey: ratio("--muted-foreground") };
}

function loadState(): LabState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  } catch {
    // corrupt storage, fall back to the current site values
  }
  return DEFAULT_STATE;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid grid-cols-[52px_1fr_40px] items-center gap-2">
      <span className="text-neutral-400">{label}</span>
      <input
        className="accent-white"
        max={max}
        min={min}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <span className="text-right tabular-nums">{value}</span>
    </label>
  );
}

function Ratio({ label, value }: { label: string; value: number }) {
  const pass = value >= 4.5;
  return (
    <span className={pass ? "text-emerald-400" : "text-red-400"}>
      {label} {value.toFixed(2)}:1
    </span>
  );
}

export function StyleLab() {
  const { resolvedTheme, setTheme } = useTheme();
  const theme: ThemeName = resolvedTheme === "light" ? "light" : "dark";
  const [state, setState] = useState<LabState>(DEFAULT_STATE);
  const [open, setOpen] = useState(true);
  const [showCss, setShowCss] = useState(false);
  const [contrast, setContrast] = useState({ text: 0, grey: 0 });

  useEffect(() => setState(loadState()), []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const css = buildCss(state);
  useStyleTag("style-lab", css);
  useGoogleFont(FONTS[state.font].google);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the injected css or theme changes
  useEffect(() => {
    const frame = requestAnimationFrame(() => setContrast(measureContrast()));
    return () => cancelAnimationFrame(frame);
  }, [css, theme]);

  const tokens = state[theme];
  const setToken = (key: keyof Tokens) => (value: number) =>
    setState((s) => ({ ...s, [theme]: { ...s[theme], [key]: value } }));

  if (!open) {
    return (
      <button
        className="fixed top-4 right-4 z-[100] rounded bg-neutral-900 px-2 py-1 font-mono text-[11px] text-neutral-100 shadow-lg"
        onClick={() => setOpen(true)}
        type="button"
      >
        lab
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-[100] flex w-72 flex-col gap-3 rounded-md border border-neutral-700 bg-neutral-900/95 p-3 font-mono text-[11px] text-neutral-100 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-neutral-400">style lab · dev only</span>
        <button
          className="text-neutral-400 hover:text-white"
          onClick={() => setOpen(false)}
          type="button"
        >
          hide
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {Object.keys(PALETTES).map((name) => (
          <button
            className="rounded bg-neutral-800 px-1.5 py-0.5 hover:bg-neutral-700"
            key={name}
            onClick={() => setState((s) => ({ ...s, ...PALETTES[name] }))}
            type="button"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span>
          editing <b>{theme}</b>
        </span>
        <button
          className="rounded bg-neutral-800 px-1.5 py-0.5 hover:bg-neutral-700"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          type="button"
        >
          switch to {theme === "dark" ? "light" : "dark"}
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Slider
          label="bg"
          max={1}
          min={0}
          onChange={setToken("bg")}
          step={0.005}
          value={tokens.bg}
        />
        <Slider
          label="text"
          max={1}
          min={0}
          onChange={setToken("fg")}
          step={0.005}
          value={tokens.fg}
        />
        <Slider
          label="grey"
          max={1}
          min={0}
          onChange={setToken("muted")}
          step={0.005}
          value={tokens.muted}
        />
        <Slider
          label="tint"
          max={0.03}
          min={0}
          onChange={setToken("chroma")}
          step={0.001}
          value={tokens.chroma}
        />
        <Slider
          label="hue"
          max={360}
          min={0}
          onChange={setToken("hue")}
          step={5}
          value={tokens.hue}
        />
      </div>

      <div className="flex gap-3">
        <Ratio label="text" value={contrast.text} />
        <Ratio label="grey" value={contrast.grey} />
      </div>

      <div className="flex flex-col gap-1.5 border-neutral-800 border-t pt-3">
        <select
          className="rounded bg-neutral-800 px-1.5 py-1"
          onChange={(e) => setState((s) => ({ ...s, font: e.target.value }))}
          value={state.font}
        >
          {Object.entries(FONTS).map(([key, font]) => (
            <option key={key} value={key}>
              {font.label}
            </option>
          ))}
        </select>
        <Slider
          label="size"
          max={19}
          min={13}
          onChange={(size) => setState((s) => ({ ...s, size }))}
          step={0.5}
          value={state.size}
        />
      </div>

      <div className="flex gap-1">
        <button
          className="rounded bg-neutral-800 px-1.5 py-0.5 hover:bg-neutral-700"
          onClick={() => setShowCss((v) => !v)}
          type="button"
        >
          {showCss ? "hide css" : "show css"}
        </button>
        <button
          className="rounded bg-neutral-800 px-1.5 py-0.5 hover:bg-neutral-700"
          onClick={() =>
            navigator.clipboard
              ? navigator.clipboard.writeText(css)
              : setShowCss(true)
          }
          type="button"
        >
          copy css
        </button>
        <button
          className="rounded bg-neutral-800 px-1.5 py-0.5 hover:bg-neutral-700"
          onClick={() => setState(DEFAULT_STATE)}
          type="button"
        >
          reset
        </button>
      </div>

      {showCss && (
        <textarea
          className="h-48 w-full resize-none rounded bg-neutral-950 p-2 text-[10px] text-neutral-300"
          onFocus={(e) => e.target.select()}
          readOnly
          value={css}
        />
      )}
    </div>
  );
}
