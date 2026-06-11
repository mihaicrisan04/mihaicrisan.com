# ai chat revamp 3/4 — trigger + morphing widget UI

> **Status:** ready · **Updated:** 2026-06-11

Part of [ai-chat-revamp.md](ai-chat-revamp.md). Depends on plan 1 (cleanup). The headline UX change: full-screen cover → bottom-right trigger that morphs into a right-side widget.

## Goal

A visible chat affordance (today the chat is reachable **only** via Cmd/Ctrl+I — the old `ai-chat-trigger.tsx` was never mounted): an icon button next to the theme toggle that morphs into a non-modal chat widget on desktop (~3/4 viewport height, narrow enough to respect the content column) and a full-screen cover on mobile.

## Context

- Theme toggle: `components/theme-toggle.tsx`, a 7×7 (`h-7 w-7`) borderless icon button (`text-muted-foreground hover:text-foreground`, icon `h-3.5 w-3.5`), wrapped in `global-chrome.tsx:132-139` as `motion.div fixed right-6 bottom-[18px] z-50` with fade-in (duration 0.6, delay 0.3).
- Current overlay: `components/ai-chat/ai-chat-popover.tsx` — portal to body, `fixed inset-0 z-50`, `bg-background/90` + animated blur backdrop, `max-w-2xl` column, staggered entrances, body scroll lock, Escape/backdrop/close to dismiss. Mounted in `app/providers.tsx:32` as a sibling **outside** `LayoutGroup`.
- Chat state: `contexts/ai-chat-context.tsx` owns `isOpen/threadId/isLoading`, `open/close/newChat/sendMessage`, Cmd/Ctrl+I toggle (lines 76-85).
- Morph pattern proven in-repo: `components/motion-primitives/morphing-popover.tsx` (layoutId-based, spring `{bounce: 0.1, duration: 0.4}`). Not reused directly — its absolute positioning inside a relative wrapper and its own Escape/click-outside handlers fight the context's `isOpen` logic. We borrow the layoutId technique only.
- Z ladder: content `z-10`, ambient fades `z-40`, all chrome/overlays `z-50` (DOM order breaks ties). `GlobalChrome` is inside all providers (`app/layout.tsx:33-36`), so a trigger there can call `useAIChat()`.
- Column widths the widget must respect: `/work`, `/work/[slug]`, `/blog/[slug]` are `max-w-2xl` (672px); `/blog`, `/setup` are `max-w-xl`; home is `max-w-md` and vertically centered.
- Responsive: go CSS-first (`max-md:` variants); `hooks/use-mobile.ts` is deleted by plan 1 (its first-frame-desktop bug makes it wrong for this anyway — if plan 1 was skipped, delete it here instead).

## Approach

One new component `components/ai-chat/chat-dock.tsx` renders **both** the trigger and the widget inside a shared motion `layoutId` scope, mounted from `GlobalChrome`. The old `AIChatPopover` mount in `providers.tsx` is removed; popover file is deleted after its pieces (messages list, input, optimistic-send logic) are reorganized into the widget.

### Trigger

- Bottom-right cluster in `global-chrome.tsx`: replace the theme-toggle wrapper with `fixed right-6 bottom-[18px] z-50 flex items-center gap-3` containing `[ChatDock trigger] [ThemeToggle]` (trigger to the left of the toggle, per "near the light theme switch").
- Trigger button: 7×7, `MessageCircle` (or `Sparkles`) icon at `h-3.5 w-3.5`, same muted→foreground hover as the toggle; `aria-label="open chat (⌘I)"`; tooltip via `components/ui/tooltip.tsx` showing "chat · ⌘I".
- When the widget is open the trigger slot keeps its width (invisible placeholder) so the theme toggle doesn't shift.

### Desktop widget (md and up)

- `fixed right-6 bottom-6 z-50`, `w-[360px]` (decided with user 2026-06-11 — accept small overlap below ~1440px), `h-[min(75svh,44rem)]`, `rounded-2xl border bg-background/95 backdrop-blur-md shadow-lg overflow-hidden flex flex-col`.
- **Non-modal**: no backdrop, no scroll lock, the page stays interactive and readable beside it.
- Morph: trigger button and widget share `layoutId="chat-dock"` inside one `AnimatePresence`; spring `{bounce: 0.1, duration: 0.4}` like MorphingPopover; inner content (header/messages/input) fades+rises in with ~0.05-0.1s delay, mirroring the current popover's staggered entrance.
- Internal layout: header row (assistant name "zuzu" in mono microtext, new-chat `Plus` button wired to `newChat()` — currently exists in context but has **no UI caller** — and close `X`), scrollable messages (`flex-1`, reuse `AIChatMessages` + `useScrollToBottom`), `AIChatInput` pinned at bottom. Empty state keeps the suggestions pills (`components/ai-chat/constants.ts`).
- Close: Escape (keep the popover's handler semantics), close button, or clicking the trigger placeholder area — **no click-outside close** (non-modal panels that vanish on stray clicks are infuriating mid-read).

### Mobile (below md)

- Same component, `max-md:inset-0 max-md:w-auto max-md:h-auto max-md:rounded-none` → full-screen cover, keep the current backdrop-blur feel, body scroll lock **only while open on mobile** (reuse the lock effect from `ai-chat-popover.tsx:82-91`, gated by a `matchMedia` check at open time or applied via CSS `overscroll-behavior` + lock).
- Entrance: slide-up + fade (the layoutId morph from a 28px button to full-screen can look stretched; if it does, opt mobile out of the shared layoutId and use a plain `y: 24→0` fade — decide visually during implementation).
- Safe areas: `pb-[env(safe-area-inset-bottom)]` on the input row; `h-svh` not `h-screen`.

### State/wiring changes

- `contexts/ai-chat-context.tsx`: unchanged API this plan (persistence and stop come in plan 4). Keep Cmd/Ctrl+I.
- `app/providers.tsx`: drop the `<AIChatPopover />` mount (line 32).
- Focus management: autofocus input on open (desktop + mobile), return focus to the trigger on close; `role="dialog"` + `aria-modal` only on mobile.
- Keyboard shortcuts: `h/w/s/b/l` plain-key nav already ignores inputs (`keyboard-shortcuts-context.tsx:39-50`) — typing in the chat is safe.

## Step-by-step

1. Build `chat-dock.tsx` with trigger + desktop widget shell (no morph yet, instant toggle) reusing `AIChatMessages`/`AIChatInput`; mount in `GlobalChrome`; remove popover mount from providers. Verify chat works in the new shell.
2. Add the layoutId morph + staggered content entrance + exit animation.
3. Mobile full-screen variant + scroll lock + safe areas.
4. Header (zuzu label, new-chat, close), tooltip on trigger, focus management, a11y pass.
5. Delete `components/ai-chat/ai-chat-popover.tsx` and anything orphaned by it; `bun run lint:fix`.

Commit per step.

## Edge cases / risks

- The morph animates between two mounted/unmounted elements — both must live under the same `AnimatePresence` and the trigger must not be `display:none` while measuring; follow MorphingPopover's structure.
- Home page (`max-w-md`, vertically centered, body no-scroll class): widget overlaps nothing; verify the home no-scroll class doesn't fight the mobile scroll lock.
- Blog post scroll-progress bar is `fixed top-0 z-50` — no conflict (widget is bottom-anchored).
- Lightbox stacking: image `MorphingDialog` portals to `document.body` (`morphing-dialog.tsx:243,254`) and paints above the widget — fine. But `PromoVideoPlayer` is **not** a portal: its `fixed inset-0 z-50` lightbox (`promo-video-player.tsx:226`) renders in place inside `<main class="relative z-10">`, whose stacking context traps it **below** the widget (a later z-50 sibling of main). If a promo video is opened while the chat is open, the widget floats over the video. Mitigation: portal the promo lightbox to body (small change, do it here if it bothers) or accept it — opening both at once is rare. Verify manually on `/work/rentn-go`.
- Very short viewports (e.g. 13" laptop with devtools open): `h-[min(75svh,44rem)]` keeps the widget inside the viewport; input stays pinned.
- `LayoutGroup` in providers has no `id`, so layoutIds are app-global — `"chat-dock"` must stay unique (grep for collisions with `morphing-popover`'s generated ids; those are `popover-trigger-<uniqueId>` so fine).

## Verification

- `bun run build` + `bun run lint` green.
- Manual (user runs dev): trigger visible on all pages next to theme toggle; morph open/close smooth; Cmd/Ctrl+I still toggles; Escape closes; desktop — page scrollable and readable beside the open widget on `/work/rentn-go` at 1440px and 1280px; mobile (responsive mode) — full-screen cover, body locked, safe-area padding, suggestions visible on empty state; theme toggle doesn't shift when chat opens; streaming + fade animation unchanged.
