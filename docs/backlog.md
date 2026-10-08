# backlog

Ideas and plans that are not scheduled yet. Each entry has an effort (S/M/L)
and a risk (low/med/high) so they can be picked at a glance.

## 1. move media to Cloudflare R2

**Why.** Project media (hero loops, posters, promo videos, gallery shots) lives
on ImageKit at `ik.imagekit.io/mihaicrisan/projects/<slug>/…`. The free tier
rate-limits video delivery: even untransformed `hero.mp4` requests return
`403 Video transformations limit exceeded` once the monthly quota is hit, and
the poster URLs (`hero.mp4/ik-thumbnail.jpg`) are themselves video transforms.
R2 has free egress, no transform quota, and a custom domain.

**Recommended shape: plain R2 bucket, no Convex.** The site has no backend
anymore (the AI chat and the Convex deployment were retired in the
`perf/static-first` work). The `@convex-dev/r2` component only pays off when
there is a Convex app issuing signed upload URLs or serving an admin UI. Adding
Convex back just to proxy a bucket is more moving parts for zero reader-facing
value. Revisit the component if a CMS/admin upload flow ever appears.

**Steps** (effort M, risk low):

1. Create bucket `mihaicrisan-media`, attach custom domain
   `media.mihaicrisan.com` (needs the zone on Cloudflare DNS; check where the
   apex is hosted first). Public read, no listing.
2. Rewrite `scripts/upload-media.ts` to the S3 API (`@aws-sdk/client-s3` with
   R2 endpoint, or `wrangler r2 object put`). Keep the same staging layout
   (`media-staging/<slug>/hero.*`, `promo.*`, `gallery/NN.webp`).
3. Generate derived assets locally at upload time instead of on the CDN:
   - poster: `ffmpeg -ss 0.5 -frames:v 1` → `hero.jpg` (replaces
     `ik-thumbnail.jpg`)
   - hover loop: h264 720p, no audio, `-movflags +faststart`, target ≤ 1.5 MB
   - promo: h264 1080p + aac, faststart
   - stills: `sharp` → webp at 1280w; `next/image` still resizes/serves
     avif/webp on the fly from the R2 origin, so no manual srcset is needed.
4. Upload with `Cache-Control: public, max-age=31536000, immutable` and a
   version segment in the path (`projects/<slug>/v2/hero.mp4`) so replacements
   never fight the cache.
5. Add `media.mihaicrisan.com` to `images.remotePatterns` in `next.config.ts`.
6. Migrate existing objects: `rclone copy` ImageKit → R2 (or re-upload from
   `media-staging/`), then `sed` the URLs in `content/projects/*.mdx`.
7. Delete the `imagekit` dev dependency and the `IMAGEKIT_*` env vars.

**Alternative** (effort S, risk low): keep ImageKit, upgrade to the paid tier.
Cheapest in time, but keeps a transform quota in the hot path.

## 2. leave Next for Astro

**Why.** After the static-first work, every page is prerendered HTML and the
content paints before any JavaScript runs. What remains on the wire is the
Next App Router runtime itself: roughly 160 KB gzipped of React + router per
page, hydrating markup that is almost entirely static. Astro would ship ~0 KB
for the home/setup/blog pages and small islands for the work rail, the promo
player and the GitHub hover card.

**Effort L, risk med.** The design is preserved by construction (same Tailwind
classes, same CSS keyframes in `globals.css`), but it is a full rewrite of the
routing/data layer: MDX collections, `next/image` → `astro:assets`, the two
GitHub API routes → Astro endpoints or Cloudflare Workers, `next/font` → local
`@font-face`. Worth it only if the remaining ~160 KB bothers you; LCP and FCP
are already decoupled from it.

## 3. smaller perf follow-ups

- **Hero image preload on /work/[slug]** (S, low): `next/image` `priority`
  already emits a preload; verify the poster URL on R2 keeps that behaviour.
- **Self-host the GitHub contribution data** (S, low): the hover card calls
  `/api/github/*` on first hover (cached 1h). A nightly cron that writes
  `public/github.json` would make the card static and drop both API routes.
- **OG image per project** (S, low): `opengraph-image.tsx` with the hero
  poster, so links unfurl properly.
- **Trim the setup icon SVGs** (S, low): the four inline logos add ~10 KB of
  HTML to the home page. `svgo` with path precision 2 should halve it.
- **`content/blog/`** (S, low): the blog is static MDX now
  (`title`, `description`, `date`, optional `status: draft`). The route and
  the `B` shortcut exist; it just has no posts.
