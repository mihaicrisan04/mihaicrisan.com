# ai chat revamp 2/4 — knowledge base & backend

> **Status:** ready · **Updated:** 2026-06-11

Part of [ai-chat-revamp.md](ai-chat-revamp.md). Backend/content work — can ship before or in parallel with plans 3-4. Its only FE touch is one `TOOL_LABELS` entry (step 12); all other tool-rendering files (`tool-call.tsx` etc.) belong to plan 4 — don't edit them here, or the parallel tracks will conflict.

## Goal

Zuzu currently knows projects (MDX bodies), 2 hardcoded work entries, and published blog posts. It knows **nothing** personal — no location, education, contact, links, or setup; the only bio fact in the whole system is "Mihai is a Fullstack Software Developer" (`convex/tools.ts:243`). It also can't give out project URLs because the ingest payload drops `links`/`website`. This plan builds the real knowledge base and fixes the ingestion gaps.

## Context — current ingestion pipeline

- `package.json` `postbuild` → `scripts/ingest-projects.ts` (bun, needs `NEXT_PUBLIC_CONVEX_URL`): reads MDX via `getAllProjects()`, POSTs payload to action `api.ingest.ingestProjects`, then triggers `ingestWorkExperience` (hardcoded const at `convex/ingest.ts:7-30`) and `ingestBlogPosts` (reads published rows from `blogPosts` table).
- Each ingest writes two stores: upserted `documents` row (by `sourceId`; `documents` doubles as structured data for tools — `metadata` powers `listProjects`) + `rag.add` embedding in namespace `portfolio` (upsert by key `project:<slug>` / `blog:<slug>` / `work:<id>`).
- `documents.source` is a closed union `project|blog|work|custom` defined in **three places** that must stay in sync: `convex/schema.ts:9-14`, `storeDocument` args (`convex/ingest.ts:115-120`), `getDocumentsBySource` (`convex/ingest.ts:170-175`).
- Known bugs: blog rows store `sourceId: post._id` but RAG key `blog:<slug>` (`ingest.ts:236` vs `241`) → republishing after an id change duplicates the documents row; `formatProjectForRag` prints "(ongoing)" for any missing `endDate` (conflates in-progress/ongoing/unknown); nothing ever prunes — deleting an MDX or unpublishing a post leaves stale rows + embeddings forever (`@convex-dev/rag` 0.6.1 *does* expose key-based deletion, just unused — see step 10 for the exact API shape).
- ⚠️ `storeDocument` upserts by the `by_sourceId` index with no source filter (`ingest.ts:126-129`), and `getDocumentBySourceId` (`ingest.ts:158-166`, used by the `getProjectDetails` tool) also ignores source — so `sourceId` values must be globally unique across sources.
- Bio facts exist but are scattered: homepage bio (`app/home-client.tsx:67-126` — name, software engineer in cluj-napoca, wolfpack digital, CS at BBU, AI interest, twitter `x.com/mihaicrisann`, github `mihaicrisan04`), email `crisanmihai2004@gmail.com` (`components/global-chrome.tsx:10`), `cal.com/mihai-crisan/30min` (`app/work/page.tsx:30`), setup list (`data/setup.ts`), dotfiles repo, `public/cv.pdf`.

## Approach

**Knowledge = markdown in the repo**, flowing through the existing pipeline. New `content/knowledge/` directory:

- `content/knowledge/about.md` — handwritten bio: who Mihai is, location, role at WolfPack Digital, CS at Babeș-Bolyai, interests (AI), contact (email, twitter, github, cal.com link, CV at /cv.pdf, dotfiles repo), what this site is, how to reach him. Drafted from the scattered facts above; **Mihai reviews/edits the draft** — it speaks for him.
- `content/knowledge/work-experience.ts` — typed array replacing the hardcoded const in `convex/ingest.ts:7-30` (single source of truth in the repo, sent as payload like projects).
- Setup doc **generated at ingest time** from `data/setup.ts` (`setupGroups`) so it can never drift from the /setup page. No new file.

Extend `documents.source` union with `"about"` (all three places). RAG keys: `about:me`, `about:setup`. Deterministic keys = idempotent re-ingest (unlike the existing `custom:${Date.now()}` footgun in `ingestCustomContent`, which this plan leaves dashboard-only but fixes to a required explicit key).

**Alternative rejected:** stuffing the bio into the system prompt. It would work for a small bio but doesn't scale, isn't searchable via `searchPortfolio`, and splits content between repo and prompt string. The prompt gets a 3-line identity summary only; the knowledge base holds the rest.

## Step-by-step

### Commit 1 — richer project payload

1. `scripts/ingest-projects.ts:31-43`: add `website`, `links`, `ongoing`, `featured` to the payload (drop nothing existing). Keep omitting `images`/`preview` (CDN paths, no RAG value).
2. `convex/ingest.ts` `ingestProjects` validator (lines 33-45): add matching optional fields.
3. `formatProjectForRag` (lines 48-77): render links section ("github: <url>", "live: <url>", website) and the project page path `/work/<slug>`; fix the ongoing logic — "(ongoing)" only when `ongoing === true`, "in progress" when `status === "in-progress"`, plain start date otherwise.
4. Write `links`/`website` into `documents.metadata` so `listProjects`/`getProjectDetails` return them structurally; update the metadata type guard in `convex/tools.ts:128-141` **and** the zod `outputSchema`s — `listProjects` enumerates its fields at `tools.ts:112-123` and `getProjectDetails` at `tools.ts:153-158`; without optional `website`/`links` there, output validation strips the new fields and the model never sees them.

### Commit 2 — knowledge docs

5. Write `content/knowledge/about.md` (draft for review) and `content/knowledge/work-experience.ts`; delete the `WORK_EXPERIENCE` const from `convex/ingest.ts` and make `ingestWorkExperience` take payload args (mirror `ingestProjects`).
6. Extend the `source` union with `"about"` in `convex/schema.ts`, `storeDocument`, `getDocumentsBySource`.
7. New action `ingestKnowledge` in `convex/ingest.ts`: takes `[{ key: "about:me" | "about:setup", title, content }]`, upserts documents (sourceId = key) + `rag.add`.
8. `scripts/ingest-projects.ts`: read `content/knowledge/about.md`, format `setupGroups` from `data/setup.ts` into a text doc, send both to `ingestKnowledge`, send work experience payload. (Consider renaming the script `scripts/ingest.ts` and updating `package.json` `postbuild` + `ingest` scripts.)

### Commit 3 — pruning + blog keying fix

9. `ingestBlogPosts` (`convex/ingest.ts:224-251`): use the **prefixed RAG key as sourceId** — `sourceId: "blog:" + post.slug`. Bare slugs would collide with project sourceIds (which are bare slugs) because `storeDocument`/`getDocumentBySourceId` don't filter by source (see Context ⚠️). This matches step 7, where about docs also use the full key (`about:me`) as sourceId. Define one helper in `ingest.ts` — `ragKeyFor(source, sourceId)`: returns `sourceId` unchanged when already prefixed (blog/about), else `` `${source}:${sourceId}` `` (project/work) — and use it in both ingest and prune so key derivation lives in exactly one place.
10. New **mutation** `pruneDocuments({ source, keepSourceIds })`: deletes `documents` rows of that source not in the list, plus their RAG embeddings. API shape (verified in `@convex-dev/rag` 0.6.1 d.ts): deletion takes the internal `namespaceId`, not the name string — `const ns = await rag.getNamespace(ctx, { namespace: "portfolio" }); if (ns) await rag.deleteByKeyAsync(ctx, { namespaceId: ns.namespaceId, key: ragKeyFor(source, staleSourceId) })`. Note `deleteByKey` (sync) needs an action ctx — the mutation must use `deleteByKeyAsync`; handle `ns === null` (before first ingest). Caller: the ingest script prunes projects/work/about with the id lists it owns; for blog it first fetches current slugs via the existing `api.blog.getAllBlogSlugs` (`convex/blog.ts:25-34`). One-time: also clean the already-stale blog `_id`-keyed documents rows — documents-table-only (their RAG keys were always `blog:<slug>`, so no embedding cleanup needed for them).

### Commit 4 — agent prompt + tools

11. Rewrite `SYSTEM_INSTRUCTIONS` (`convex/tools.ts:243-286`): short identity block (Zuzu, assistant on mihaicrisan.com; Mihai = software engineer in cluj-napoca, WolfPack Digital, BBU); lowercase casual voice matching the site copy; tool strategy (searchPortfolio for fuzzy questions, listProjects/getProjectDetails for project specifics, getAboutMihai for personal/contact questions); **linking rules** — answer with markdown links, internal project pages as `/work/<slug>`, prefer live/github URLs from project data; fix the stale `rngo-ro` example slug at `tools.ts:151` → `rentn-go`.
12. New tool `getAboutMihai` in `createContextualTools`: returns all `source: "about"` documents (bio + setup). Add a `TOOL_LABELS` entry (`components/ai-chat/tool-labels.ts`) so the UI labels it — that's the only FE edit in this plan. Do **not** touch `tool-call.tsx` here (its icon map fallback renders unknown tools acceptably); plan 4 owns all `tool-call.tsx` changes including this tool's icon.
13. Remember: call-site tools **replace** config tools in @convex-dev/agent 0.6.1 — the new tool only needs adding to `createContextualTools`; `staticTools` on the agent config is irrelevant to the live path.

## Edge cases / risks

- Convex deployment needs `OPENROUTER_API_KEY` + `OPENAI_API_KEY` set (embeddings) — can't verify from the repo; confirm in the Convex dashboard before relying on ingest.
- Changing `documents.source` union: existing rows all use existing variants, so schema push is safe.
- Pruning must be per-source and key-scoped — never wipe `blog:`/`custom:` keys while pruning projects.
- `bun run ingest` against the dev deployment is the test loop; postbuild handles prod on next deploy.
- about.md content is user-facing through the agent — Mihai must review the draft before merge.

## Verification

- `bun run build` + `bun run lint` green.
- `bun run ingest` (dev deployment), then in the Convex dashboard: `documents` has `about:me`, `about:setup`, work rows, projects with links metadata; no stale rows.
- Manual chat checks: "how do I contact mihai?" → email/cal.com/links; "where does mihai study?" → BBU; "what's mihai's setup?" → setup doc; "show me rentn-go" → includes `/work/rentn-go` and rngo.ro links; "what is mihai working on now?" → ongoing projects correct.
