---
name: working-with-plans
description: The talk-research-plan-then-implement-later workflow used in this repo. Use when starting a new piece of work, when asked to plan/research something, when saving a plan, or when picking up a previously-saved plan to implement. Defines the plans/ directory lifecycle.
---

# Working with plans

We separate **planning** from **implementing**. We talk through a problem, research it, and write a detailed plan markdown. Later — possibly a different session — we pick that plan up and implement it. A plan must carry enough detail to resume cold, with no memory of the conversation that produced it.

## The directory lifecycle

Plans live in `.claude/plans/` (committed to the repo):

```
plans/
├── backlog/    # raw pile — captured ideas/drafts that still need shaping or input
├── review/     # fully drafted — being reviewed with the user, awaiting approval
├── ready/      # approved — implementation-ready and queued; nothing left to decide
└── active/     # being implemented right now
```

Flow: **capture → `backlog/` → draft + review with the user → `review/` → approved → `ready/` → implementation starts → `active/`**. When a plan ships, move it to `.claude/docs/investigations/` as the historical record (don't leave finished work in `active/`). A plan researched and written to completion in one session can land directly in `review/` — `backlog/` is only for work that still needs thinking.

## What a plan md must contain

- **Status header** right under the title: `> **Status:** needs-shaping | in-review | ready | in-progress (+ optional blocked-on-<thing>) · **Updated:** <date>` — the folder gives the stage, the header gives the sub-state, and the file stays self-describing even if misfiled.
- **Goal** and a one-paragraph problem statement.
- **Context**: the relevant files, components, and current behavior, with paths.
- **Approach**: the chosen design and *why*, plus alternatives considered and rejected.
- **Step-by-step implementation** broken into commit-sized chunks.
- **Edge cases, risks, open questions.**
- **Testing plan**: how to verify (build, lint, manual checks — the user runs the dev server themselves).
- Convert relative dates to absolute (e.g. "next week" → the actual date).

## Conventions

- One plan per file, `lowercase-with-dashes.md`, named after the feature.
- Don't put plan detail in `CLAUDE.md` — CLAUDE.md only points here.
- Keep `active/` to what's truly in flight so it reflects reality.
- Before starting a fresh plan, check `ready/`, `review/`, and `backlog/` — the work may already be scoped.
