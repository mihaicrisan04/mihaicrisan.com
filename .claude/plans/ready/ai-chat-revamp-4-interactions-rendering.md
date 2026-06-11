# ai chat revamp 4/4 — interactions & rendering

> **Status:** ready · **Updated:** 2026-06-11

Part of [ai-chat-revamp.md](ai-chat-revamp.md). Do after plan 3 (touches the same components). Fixes the broken bits and adds the interaction polish that makes the chat *feel* right.

## Goal

Four user-visible fixes — live tool-call status (currently always shows "done"), a working stop button (currently a no-op), threads that survive reload (currently silently lost), and chat links that navigate the site — plus rendering polish.

## Context — what's broken and why

- **Tool rendering targets AI SDK v4.** In `components/ai-chat/tool-call.tsx`, `extractRenderState` (lines 39-47) derives state by checking `part.type === "tool-invocation"`, and `getToolSummary` (lines 58-140) reads `part.args`/`part.result` — both target the dead v4 shape. Installed `ai` is 6.0.158: tool parts are `tool-${name}` / `dynamic-tool` with `state ∈ {input-streaming, input-available, approval-requested, approval-responded, output-available, output-error, output-denied}` and fields `input`/`output`/`errorText`/`toolCallId`. Result today: state is always `undefined` → tools never spin (they render the static tool icon with the past-tense "done" label mid-run); live summaries ('Querying "x"…', "Found 3 results") never render; `output-error` is never surfaced. (`tool-labels.ts` `extractToolName` already handles v6 part types correctly, as do the `isToolUIPart`/`isReasoningUIPart` guards elsewhere.)
- **Stop is a no-op.** `AIChatInput` shows an enabled Square button while streaming (`ai-chat-input.tsx:89-97`) but `onStop` is optional and never passed (`ai-chat-popover.tsx:199-205` pre-plan-3); no abort path exists in the context. @convex-dev/agent 0.6.1 **does** export `abortStream(ctx, component, { reason } & ({ streamId } | { threadId, order }))` and stream messages carry status `streaming|finished|aborted`.
- **Threads orphan on reload.** `threadId` is plain `useState` (`ai-chat-context.tsx:38`); server-side the thread persists forever. `useUIMessages` accepts `"skip"`, so resuming is just rehydrating the id.
- **Streaming flag is coarse.** Context `isLoading` spans the whole action promise; per-message streaming is inferred as "last assistant message while loading" (`ai-chat-messages.tsx:120-139`).
- The link override (`components/ai-chat/markdown.tsx:39-50`) forces `target="_blank"` on **every** href — internal `/work/...` links open a new tab instead of client-side navigating.
- Code blocks render unhighlighted: the `pre`/`code` overrides in `markdown.tsx:10-112` replace Streamdown's built-in shiki CodeBlock with plain `font-mono` on `bg-muted`.
- Minor: `hasRenderableAssistantPart` duplicated (`ai-chat-message.tsx:53-66` and `ai-chat-messages.tsx:12-25`); optimistic user bubble has `text-sm` while the real one doesn't; assistant naming scattered (placeholder in `ai-chat-input.tsx:27`, branding in `ai-chat-messages.tsx:96-103`); summary-bar timer only ticks for the latest optimistic send so historical messages show "Pondered" with no duration (`tool-calls-summary-bar.tsx:74-97`).

## Step-by-step

### Commit 1 — tool-call rendering on AI SDK v6

1. Rewrite `extractRenderState` in `tool-call.tsx` against v6 parts: `running = state === "input-streaming" || state === "input-available"`, done = `output-available`, error = `output-error` (render `errorText` in the expanded panel, red status dot — `ToolLayout`'s StatusIndicator already supports red at `tool-layout.tsx:31` and auto-renders `state.error` at `193-197`). Treat `output-denied` / unknown states via a default branch (terminal, non-running — approvals are unused here but the switch shouldn't assume 6 states).
2. Rewrite `getToolSummary` (lines 58-140) to read `part.input`/`part.output` instead of `args`/`result`. The output-shape fields it reads (`resultsCount`/`count`/`name`/`found`/`formatted`) already match the tools' return values in `convex/tools.ts` — only the part field names change. This plan owns **all** `tool-call.tsx` edits: add the icon-map entry for plan 2's `getAboutMihai` here (its `TOOL_LABELS` entry ships with plan 2).

### Commit 2 — stop button

3. New mutation `stopStreaming({ threadId })` in `convex/queries.ts` (or a new non-node `convex/threads.ts`) — it **cannot** live in `streamChat.ts`: that file is `"use node"`, which only allows actions. Implementation: `listStreams(ctx, components.agent, { threadId })` → pick the latest with status `"streaming"` → `abortStream(ctx, components.agent, { reason: "user stopped", streamId })` (or the `{ threadId, order }` variant). Both helpers are exported by `@convex-dev/agent` 0.6.1 and accept a plain MutationCtx. Return whether anything was aborted.
4. `contexts/ai-chat-context.tsx`: expose `stop()` calling the mutation; flip `isLoading` optimistically. Pass `onStop` through the widget to `AIChatInput`. Aborted messages arrive with status `aborted` — render the partial text as-is (no error toast; stopping is intentional).
5. While streaming, keep the textarea **enabled** (currently disabled at `ai-chat-input.tsx:73`) so the user can type the next message during generation — but keep submit blocked until idle. (Small change, big feel improvement.)

### Commit 3 — thread persistence + new chat

6. Persist `threadId` to localStorage (`zuzu:thread-id`, with a written-at timestamp; ignore if older than ~7 days). Rehydrate in `AIChatProvider` on mount (guard SSR). `newChat()` clears storage + state. Stale-thread safety: there is **no** error boundary in the app and Convex query errors throw during render — so validate *before* subscribing. Add a small Convex query `validateThread({ threadId })` that returns a boolean (wrap the agent component's thread-metadata lookup in try/catch); the provider rehydrates the persisted id only after it validates, otherwise silently clears storage and starts fresh. (Alternative if simpler in practice: a tiny ErrorBoundary around the messages pane whose reset clears `zuzu:thread-id` — but the validate-first query is the cleaner default.)
7. The widget header's new-chat button (mounted in plan 3) now has correct semantics; disable it while streaming.

### Commit 4 — links, markdown, voice consistency

8. In `markdown.tsx` link override: internal hrefs (`/`-prefixed) render via `next/link`; external keep `target="_blank" rel="noreferrer"`. On mobile (full-screen cover), navigating closes the chat — close on internal link click via a `usePathname` effect in the widget (desktop widget stays open; it doesn't cover content).
9. Code highlighting — decide at implementation: streamdown 2.5.0 does **not** bundle highlighting; it moved to the optional `@streamdown/code` plugin (not installed). Option A (highlighted): `bun add @streamdown/code`, pass `plugins={{ code }}` + `shikiTheme` (grayscale-friendly pair) to the Streamdown render in `ai-chat-message.tsx:294`, add the plugin's `@source` line to `app/globals.css` per the streamdown README, and drop the `pre`/`code` overrides — note this reintroduces shiki transitively right after plan 1 removed the direct dep (fine, but deliberate). Option B (plain): keep the existing `pre`/`code` overrides as-is and skip this step. A portfolio chat rarely emits code — B is acceptable; record the choice in the commit message. Keep the link/table/heading overrides either way.
10. Centralize assistant naming/branding in `components/ai-chat/constants.ts` (name, placeholder, empty-state copy, suggestions). Refresh `SUGGESTIONS` to match the new knowledge base ("how do i contact mihai?", "what's his setup?", "what is he working on now?").
11. Dedupe `hasRenderableAssistantPart` into `lib/chat-types.ts` (or a `components/ai-chat/utils.ts`); fix the user-bubble `text-sm` inconsistency.

### Commit 5 — streaming feel polish

12. Keep Streamdown `fadeIn` (250ms ease-out) while streaming — this is the fading effect to preserve. Optionally enable Streamdown's `caret` while `isAnimating` for a subtle cursor; judge visually.
13. Derive per-message streaming from `useUIMessages` stream status where available instead of the "last message while isLoading" heuristic; keep the 1s-delayed "Thinking…" indicator (`useDelayedShow`).
14. Summary-bar timer: store elapsed-at-finish per message id (module-level Map or part metadata) so finished groups show "Pondered · 6s" instead of no duration; acceptable to keep durations session-only.

## Edge cases / risks

- `abortStream` signature (verified in 0.6.1 d.ts): `abortStream(ctx: MutationCtx | ActionCtx, component, { reason } & ({ streamId } | { threadId, order })): Promise<boolean>`; `listStreams(ctx, component, { threadId })` returns `StreamMessage[]` with `order`/`streamId`/`status` (`"streaming" | "finished" | "aborted"`).
- localStorage thread rehydration must tolerate: deleted thread, Convex deployment switch (dev vs prod ids), corrupted storage — all paths fall back to `newChat()` silently.
- `@streamdown/code` adds bundle weight (shiki) vs the plain override — weigh in step 9; option B costs nothing.
- Re-enabled textarea while streaming must not allow double-submit: guard `sendMessage` on `isLoading`.

## Verification

- `bun run build` + `bun run lint` green.
- Manual: ask something tool-heavy ("compare mihai's iOS projects") → summary bar shows live spinner + tool rows with real queries/counts, then collapses with duration; press stop mid-answer → generation halts, partial text remains, input usable; reload mid-conversation → thread restores with history; new chat → empty state; click a `/work/...` link in an answer → client-side nav, widget stays open on desktop / closes on mobile; code block in an answer renders cleanly (highlighted if step 9 option A was taken); error case (e.g. temporarily break a tool in dev) shows red state with message instead of fake success.
