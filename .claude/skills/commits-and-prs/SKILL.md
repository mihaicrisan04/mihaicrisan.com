---
name: commits-and-prs
description: How to write commits and PRs for this repo. Use whenever creating a commit or opening/updating a PR — covers the message style, the husky/lint-staged pre-commit hook, branching, and what to stage.
---

# Commits & PRs

## Message style (commits and PR descriptions)

- Very concise, **bullet lists**.
- **No titles/headers** unless the PR is genuinely large/complex and needs them.
- Casual language, **very little uppercase** — only capitalize specific technical words (API, Convex, Next.js, variable/component names, etc.).
- No fluff, no unnecessary formality.
- **Never** add `Co-Authored-By` or any mention that the text was AI-generated.

## Hooks & linting

- Pre-commit runs `bunx lint-staged` via husky (Ultracite/Biome). **Never** bypass with `--no-verify`.
- If the hook fails, run `bun run lint:fix`, re-stage, and commit again.

## Branching & staging

- `develop` is the working branch; branch feature work off **`develop`** when it's more than a small change.
- Only commit/push when explicitly asked.
- Everything under `.claude/` is committed (skills, plans, docs, scripts). Heavy throwaway artifacts in `.claude/scratch/` can be excluded later via a `.claude/.gitignore` if needed.

## PRs

- Use the `gh` CLI for PR operations.
- Open PRs from `develop` against **`main`** unless told otherwise.
- Keep the body to concise bullets per the style above.
