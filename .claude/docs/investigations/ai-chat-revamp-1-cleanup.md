# ai chat revamp 1/4 — dead code cleanup

> **Status:** done (shipped on develop) · **Updated:** 2026-06-11

Part of [ai-chat-revamp.md](ai-chat-revamp.md). No behavior changes — this commit only deletes confirmed-dead code and fixes stale docs, so the real revamp lands on a clean base.

## Goal

Remove ~5,000 lines of dead chat-era code, 4 unused dependencies, and the stale architecture section in CLAUDE.md. Everything below was verified dead by grepping all importers across `app/ components/ contexts/ hooks/ lib/ convex/ scripts/` (research pass, 2026-06-11). Re-verify with a quick grep before each deletion — cheap insurance.

## Deletions

### Dead component trees (~4,700 lines)

- `components/ai-elements/` — 15 files, 2,291 lines, zero external imports.
- `components/ui/shadcn-io/ai/` — 15 files, 2,365 lines, near-duplicate of ai-elements, zero external imports.
- `components/ui/shadcn-io/code-block/` and `components/ui/shadcn-io/marquee/` — unreferenced.

### Dead individual components

- `components/ui/chain-of-thought.tsx`, `reasoning.tsx`, `markdown.tsx`, `code-block.tsx`, `response-stream.tsx`, `steps.tsx`, `loader.tsx`, `kbd.tsx` — no external consumers (ui/markdown is imported only by dead ui/reasoning; ui/code-block only by dead files).
- `components/ai-chat/loader.tsx`, `components/ai-chat/message-actions.tsx` — exported, never imported.
- The unused `Markdown` export inside `components/ai-chat/markdown.tsx` — delete lines 114-133 (the `MarkdownProps` interface, `MarkdownComponent`, and the memo'd export), and trim the now-unused imports: drop `memo` (line 3) and `Streamdown` (line 4), keeping only `import type { Components } from "streamdown"`. Keep `streamdownComponents`. (Leaving the imports strands them → lint fails → husky blocks the commit.)
- `components/chat-input.tsx` — orphaned stub from another project ("Ask BA Bot", console.log handlers).
- `components/ai-chat-trigger.tsx` — never imported; plan 3 builds a new trigger in global chrome.
- `components/ui/spring-element.tsx` — unused, and the only importer of `framer-motion`.
- `components/motion-primitives/cursor.tsx` — unused.
- `hooks/use-mobile.ts` — unused (plan 3 goes CSS-first for responsive, so it stays unnecessary).

### Dead backend + lib + data

- `convex/chat.ts` — legacy non-streaming chat action + duplicate `createThread`; no `api.chat.*` callers.
- `convex/seed.ts` — inserts a sample "Building with Convex" post as `published`.
- `convex/migrate.ts` — **deletes all blogPosts** then inserts a "Hover Card Test" post; dangerous cruft.
- `convex/http.ts` — empty router, zero routes (Convex doesn't require the file).
- `lib/markdown.ts` — references nonexistent `content/blog/` and `.md` project files; no importers.
- `lib/work.ts` — exports one interface nobody imports.
- `data/projects.json`, `data/work-experience.json` — unreferenced legacy (older schema). projects.json holds 3 projects without MDX counterparts (boccelute, medlog-healthcare, rngo-ro) — user confirmed deletion 2026-06-11; git history keeps them.
- In `convex/blog.ts`: collapse `getPublishedPosts` (lines 37-45, byte-identical duplicate of `getAllBlogPosts`) — update its one caller `convex/ingest.ts` to use `getAllBlogPosts`.

### Dependencies to drop (after the deletions above)

- `framer-motion` (only importer was spring-element; everything live uses `motion`)
- `shiki` + `@shikijs/transformers` (only imported by dead files — `components/ui/code-block.tsx:5` and `components/ui/shadcn-io/code-block/server.tsx`; streamdown has **no** shiki dependency — chat code blocks currently render unhighlighted via the `markdown.tsx` pre/code overrides; plan 4 owns the highlighting decision)
- `@tailwindcss/typography` (never wired into globals.css; `.prose` is hand-rolled)

Run `bun install` after editing package.json, then grep `from "shiki"`, `from "framer-motion"` to confirm nothing broke.

## Doc fixes

- Root `CLAUDE.md` (the project instructions — recently moved from `.claude/CLAUDE.md`; `AGENTS.md` symlinks to it) Data Flow section: replace the SSE description ("Streaming via Convex HTTP endpoint (/api/chat)", "lib/stream-parser.ts", "hooks/use-ai-chat-stream.ts") with the real flow: Convex action `streamChat.sendMessage` persists deltas, client subscribes via `useUIMessages` from `@convex-dev/agent/react` (query `convex/queries.ts`). Fix model name "Gemini Flash 2.0" → `google/gemini-2.5-flash`.
- `convex/README.md` is untouched Convex starter boilerplate — replace with 5 lines describing the actual backend layout, or delete.

## Explicitly NOT in scope

- The `.prose` color bug in `app/globals.css` (`hsl(var(--foreground))` wrapping oklch tokens — invalid CSS, silently falls back). Real bug, unrelated to chat; fix separately if wanted.
- `contexts/keyboard-shortcuts-context.tsx`'s unused `useKeyboardShortcuts` export — harmless, the provider itself is live.
- `components/ui/tooltip.tsx` etc. — plan 3 may use them.

## Risks / edge cases

- `staticTools` in `convex/agent.ts` references `convex/tools.ts`, not chat.ts — deleting chat.ts doesn't touch the live path (call-site tools replace config tools anyway).
- Deleting `convex/http.ts` is safe (router is empty) but `convex dev`/deploy regenerates `_generated` — run `bun run dev:backend` once locally or rely on build to confirm codegen is clean. `NEXT_PUBLIC_CONVEX_SITE_URL` in `.env.local` was only needed by the old HTTP design; leave env files alone (do not read them), just note it can be removed manually.

## Step-by-step

1. Delete dead component trees + individual components; grep-verify each batch; `bun run build`.
2. Delete dead convex/lib/data files; collapse blog query duplicate; `bun run build` (runs `tsc` for convex too via next? — also run `bunx convex codegen` if needed).
3. Drop the 4 deps, `bun install`, `bun run build`.
4. Fix CLAUDE.md + convex/README.md.
5. `bun run lint:fix`, final `bun run build`.

One commit per step is fine; or a single commit "remove dead chat-era code" — keep it reviewable.

## Verification

- `bun run build` green (includes postbuild ingest — needs `NEXT_PUBLIC_CONVEX_URL`; if absent locally, `next build` alone passing is enough).
- `bun run lint` green.
- Manual: site loads, Cmd/Ctrl+I chat still opens and streams, /work and /blog pages render.
