# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev             # Next.js dev server (Turbopack)
bun run build           # Production build
bun run start           # Start production server
bun run lint            # Ultracite/Biome check
bun run lint:fix        # Auto-fix
bun run upload-media <slug>   # push media-staging/<slug>/ to ImageKit
```

## Architecture

Personal portfolio built with **Next.js 16** (App Router). Fully static: every
route is prerendered at build time, there is no backend or database.

### Tech Stack
- Next.js 16, React 19, Tailwind CSS 4
- Content: MDX files in `content/`, rendered on the server with `next-mdx-remote/rsc`
- Media: ImageKit CDN (see `docs/backlog.md` for the planned move to R2)
- Linting: Ultracite (Biome preset)

### Key Directories
- `app/` - routes. `page.tsx` files are Server Components
- `components/` - UI. Most are Server Components; files with `"use client"` are small islands
  - `home/` - the interactive keywords on the home page
  - `mdx/` - components available inside project MDX
  - `motion-primitives/` - morphing dialog, spotlight, progressive blur
- `content/projects/` - project MDX (frontmatter + body)
- `content/blog/` - blog MDX (`title`, `description`, `date`, optional `status: draft`)
- `data/setup.ts` - the /setup list
- `lib/` - `projects.ts`, `blog.ts` (fs + gray-matter), `utils.ts`
- `docs/backlog.md` - unscheduled plans with effort/risk

### Performance rules (keep the site paint-fast)
- Content must be in the HTML. Entrance animations are CSS (`Reveal` component,
  `.reveal` / `.fade` in `globals.css`), never `motion` `initial={{ opacity: 0 }}`.
- Hover effects are CSS where possible (`.link-*` classes in `globals.css`,
  `group-hover:` utilities). Only reach for `motion` inside components that
  are loaded with `next/dynamic` (work rail, promo player, image lightbox).
- Nothing in the root layout besides `next-themes` and the keyboard shortcuts.
  No providers that open connections or fetch on load.
- Pass only the fields a client component needs; never the full project body.
- Fonts: Geist Sans/Mono via `next/font/google` in the layout; the pixel font
  is vendored in `app/fonts/` and applied on `/work` only.

### Environment Variables
- `GITHUB_TOKEN` - optional, for the contribution chart API routes
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - only for `scripts/upload-media.ts`

## Code Standards

Uses **Ultracite** (Biome preset). Run `bun run lint:fix` before committing.

- React 19: `ref` as a prop, no `forwardRef`
- Next.js: `<Image>` for images, Server Components by default
- TypeScript: `unknown` over `any`, const assertions
- Loops: `for...of` over `.forEach()`
- Imports: `@/*` path alias
