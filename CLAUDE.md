# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills & references (load the relevant one before working)

Detailed, task-specific guidance lives in `.claude/skills/` — invoke the matching skill instead of relying on this file:

| Skill | When |
|---|---|
| `working-with-plans` | starting, saving, or resuming a plan (see workflow below) |
| `commits-and-prs` | writing any commit or PR (see quick rules below) |
| `convex` / `convex-agents` / `convex-http-actions` | Convex functions, schema, AI agent, webhooks |
| `frontend-design` | building or styling UI |
| `ai-sdk` | AI chat / streaming features |

Reference wiki: `.claude/docs/` (notes, `investigations/` for completed deep-dives). Heavy raw artifacts go in `.claude/scratch/`, reusable debug/seed scripts in `.claude/scripts/`.

## Plans (full detail: `working-with-plans` skill)

We research → write a plan md → implement later. Plans live in `.claude/plans/`: `backlog/` (raw, needs shaping) → `review/` (drafted, awaiting approval) → `ready/` (approved, queued) → `active/` (in flight); shipped plans move to `.claude/docs/investigations/`. Plan detail goes in those files, never here.

## Commits & PRs (full detail: `commits-and-prs` skill)

- Style: concise bullets, casual, little uppercase, no titles unless large, **no Co-Authored-By**.
- Pre-commit runs lint-staged (husky). **Never** `--no-verify`; fix with `bun run lint:fix`.
- Work on `develop`; PRs go `develop` → `main`. Commit/push only when asked.

## Commands

```bash
# Development (runs both frontend and backend concurrently)
bun run dev

# Individual services
bun run dev:frontend    # Next.js with Turbopack
bun run dev:backend     # Convex dev server

# Build & Start
bun run build           # Production build
bun run start           # Start production server

# Linting (Ultracite/Biome)
bun run lint            # Check for issues
bun run lint:fix        # Auto-fix issues
```

## Architecture

This is a personal portfolio site built with **Next.js 16** (App Router) and **Convex** as the backend.

### Tech Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Framer Motion
- **Backend**: Convex (real-time database, serverless functions)
- **AI Features**: Gemini Flash 2.0 via OpenRouter with RAG for portfolio assistant
- **Images**: ImageKit CDN integration
- **Linting**: Ultracite (Biome preset)

### Key Directories
- `app/` - Next.js App Router pages and layouts
- `convex/` - Convex backend functions, schema, and AI agent configuration
- `components/` - React components organized by feature
  - `ui/` - Base shadcn/ui components
  - `ai-chat/` - AI chat popover and message components
  - `motion-primitives/` - Animation components
  - `mdx/` - MDX rendering components
- `content/projects/` - MDX files for project pages (frontmatter + content)
- `contexts/` - React context providers (AI chat, keyboard shortcuts)
- `lib/` - Utilities and data fetching (projects, markdown parsing)

### Data Flow
- **Projects**: Static MDX files in `content/projects/` parsed via `lib/projects.ts`
- **Blog Posts**: Stored in Convex database, fetched via `convex/blog.ts`
- **AI Chat**: Streaming via Convex HTTP endpoint (`/api/chat`) using SSE
  - Agent configured in `convex/agent.ts` with @convex-dev/agent
  - Stream parsing in `lib/stream-parser.ts`
  - Client hook in `hooks/use-ai-chat-stream.ts`

### Convex Schema
- `documents` - RAG knowledge base (projects, blog, work, custom content)
- `blogPosts` - Blog posts with title, slug, content, status, date

### Provider Stack (app/providers.tsx)
ConvexProvider → ImageKitProvider → ThemeProvider → KeyboardShortcutsProvider → AIChatProvider → LayoutGroup

### Environment Variables
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - ImageKit CDN endpoint
- `OPENROUTER_API_KEY` - OpenRouter API key (Convex backend)

## Code Standards

Uses **Ultracite** (Biome preset). Run `bun run lint:fix` before committing. Full standards reference: `.claude/docs/ultracite-standards.md`.

Key rules:
- React 19: Use `ref` as prop instead of `forwardRef`
- Next.js: Use `<Image>` component, Server Components for data fetching
- TypeScript: Prefer `unknown` over `any`, use const assertions
- Loops: Prefer `for...of` over `.forEach()` and indexed loops
- Imports: Use `@/*` path alias (maps to project root)
