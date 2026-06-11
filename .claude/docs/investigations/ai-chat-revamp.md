# ai chat revamp — master plan

> **Status:** done · **Updated:** 2026-06-11

## Goal

Revamp the whole AI chat ("Zuzu") experience end to end:

1. **Knowledge**: the assistant can reference every project, a real knowledge base about Mihai (bio, contact, setup, work history), and all page content — and blog posts whenever they exist.
2. **UI**: replace the full-screen cover with a small trigger button next to the theme toggle (bottom-right) that morphs into a right-side widget — ~3/4 viewport height on desktop, narrow enough not to cover the site's thin content column; full-screen cover on mobile.
3. **Interactions & rendering**: fix the broken tool-call rendering (stale AI SDK v4 shapes), add a working stop button, persist threads across reloads, keep the subtle streaming text fade, make links in answers navigate the site.

## How the chat actually works today (verified 2026-06-11)

CLAUDE.md's architecture notes are stale — there is **no** `/api/chat` SSE endpoint, no `lib/stream-parser.ts`, no `hooks/use-ai-chat-stream.ts`. The real flow:

- Send: `contexts/ai-chat-context.tsx:44-70` → mutation `api.agent.createThread` (`convex/agent.ts:28-34`, anonymous thread) → action `api.streamChat.sendMessage` (`convex/streamChat.ts`, `"use node"`), which runs `thread.streamText` with the 6 contextual tools and `saveStreamDeltas { chunking: "word", throttleMs: 50 }` + `consumeStream()`.
- Receive: deltas persist into the agent component's tables; the client subscribes via `useUIMessages(api.queries.listThreadMessages, { threadId }, { initialNumItems: 50, stream: true })` (`components/ai-chat/ai-chat-popover.tsx:44-48`, query in `convex/queries.ts:7-18` = `listUIMessages` + `syncStreams`). Streaming rides the Convex websocket — no HTTP anywhere.
- Agent: `convex/agent.ts` — name "Zuzu", OpenRouter `google/gemini-2.5-flash`, reasoning effort medium, maxSteps 10, system prompt + tools in `convex/tools.ts`.
- RAG: `convex/rag.ts` — namespace `portfolio`, OpenAI `text-embedding-3-small` (1536 dims). Ingestion runs on every Vercel build (`postbuild` → `scripts/ingest-projects.ts`) and upserts both a `documents` table row (keyed by `sourceId`) and a RAG embedding (keys `project:<slug>` / `blog:<slug>` / `work:<id>`).
- Tools (`convex/tools.ts`): `searchPortfolio`, `listProjects`, `getProjectDetails`, `getWorkExperience`, `getBlogPosts`, `getCurrentTime`. Call-site tools **replace** agent-config tools in @convex-dev/agent 0.6.1 (`?? fallback`, not merge).
- UI: full-screen portal overlay (`components/ai-chat/ai-chat-popover.tsx`), opened **only** by Cmd/Ctrl+I — `components/ai-chat-trigger.tsx` exists but is imported nowhere, so there is zero visible affordance.

**Decision: keep this architecture.** Convex agent + RAG + reactive streaming is solid and free of custom transport code. The revamp is content + tools + UI + interaction fixes, not a backend rewrite.

## Subplans (implementation order)

| # | Plan | What | Ships independently? |
|---|---|---|---|
| 1 | [ai-chat-revamp-1-cleanup.md](ai-chat-revamp-1-cleanup.md) | delete ~5k lines of dead chat-era code, drop 4 unused deps, fix stale CLAUDE.md | yes |
| 2 | [ai-chat-revamp-2-knowledge-base.md](ai-chat-revamp-2-knowledge-base.md) | about-me knowledge docs, richer project ingest (links!), work-experience source file, pruning, system prompt rewrite | yes |
| 3 | [ai-chat-revamp-3-widget-ui.md](ai-chat-revamp-3-widget-ui.md) | trigger button + morphing right-side widget (desktop), full-screen (mobile) | yes (after 1) |
| 4 | [ai-chat-revamp-4-interactions-rendering.md](ai-chat-revamp-4-interactions-rendering.md) | AI SDK v6 tool rendering fix, stop button, thread persistence, link navigation, streaming polish | partially overlaps 3; do after |

1 → 2 and 1 → 3 → 4 can proceed in parallel tracks. Coordination rule: plan 2's only FE edit is a `TOOL_LABELS` entry for its new `getAboutMihai` tool; plan 4 owns **all** `tool-call.tsx` changes (including that tool's icon) — land plan 2 before plan 4's commit 1, or expect a trivial rebase on `tool-labels.ts`.

## Decisions made

- **Keep** Convex agent + RAG + `useUIMessages` reactive streaming; keep `google/gemini-2.5-flash` via OpenRouter; keep word/50ms delta chunking.
- **Keep** the Streamdown `fadeIn` streaming animation (the "small fading effects" the user likes) — `components/ai-chat/ai-chat-message.tsx:294-307`.
- Knowledge base = **markdown files in the repo** (`content/knowledge/`), ingested through the existing postbuild pipeline — exactly the "bigger markdown" the user described. Setup doc is generated from `data/setup.ts` so it never drifts from the /setup page.
- Desktop widget is **non-modal**: no backdrop, no scroll lock, page stays interactive (that's the point of not covering content). Mobile is a modal full-screen cover with scroll lock.
- Trigger lives in `components/global-chrome.tsx` next to the theme toggle (`fixed right-6 bottom-[18px] z-50`), styled like it (7×7 icon button). Cmd/Ctrl+I keeps working.
- Morph animation via motion `layoutId` (the pattern already proven by `components/motion-primitives/morphing-popover.tsx`), purpose-built rather than reusing MorphingPopover (its absolute-positioning + own Escape/click-outside handlers fight `ai-chat-context`).
- Blog: already wired (`ingestBlogPosts` + `getBlogPosts` tool); fix its keying inconsistency in plan 2 and it's future-proof for when real posts exist.

## Open questions

None — all resolved with the user on 2026-06-11:

1. **Widget width**: `w-[360px]`, accept the small overlap on viewports below ~1440px (non-modal panel, closable; narrower hurts chat readability).
2. **`data/projects.json`**: delete it (git history preserves the 3 never-migrated projects: boccelute, medlog-healthcare, rngo-ro).
3. **Zuzu voice**: lowercase casual, matching the site copy.

## Verification (all subplans)

`bun run build` + `bun run lint` (never run the dev server — the user runs it). Manual checks listed per subplan.

When a subplan ships, move it to `.claude/docs/investigations/`; this master file moves last.
