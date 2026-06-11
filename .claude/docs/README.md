# mihaicrisan.com internal wiki

Personal notes about this site that don't belong in the repo proper. Lives under `.claude/docs/` (committed). Update freely; this is a working document.

## Reference

| Topic | File | What's in it |
|---|---|---|
| Ultracite standards | [ultracite-standards.md](ultracite-standards.md) | Full Ultracite/Biome code standards (formerly the root AGENTS.md) |

## Investigations (completed deep-dives)

`investigations/` holds finished research and shipped-plan records. Empty so far.

## How this fits the rest of `.claude`

- **Skills** (`.claude/skills/`) — task guidance Claude loads on demand (`working-with-plans`, `commits-and-prs`, plus symlinked global skills like `convex` and `frontend-design`).
- **Plans** (`.claude/plans/`) — `backlog/` (needs shaping) → `review/` (awaiting approval) → `ready/` (approved, queued) → `active/` (in flight); shipped plans land here in `investigations/`.
- **Scratch** (`.claude/scratch/`) — heavy raw artifacts (logs, exports, test payloads).
- **Scripts** (`.claude/scripts/`) — reusable seed/debug/benchmark scripts.

## Conventions

- One topic per file, lowercase-with-dashes filenames.
- Register new reference files in the table above.
- Date-stamp snapshots (perf tests, audits, incident notes).
- Don't commit secrets — these dirs are committed and the repo may be public.
