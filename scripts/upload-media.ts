#!/usr/bin/env bun
/**
 * Uploads media for a project from media-staging/<slug>/ to ImageKit
 * at /projects/<slug>/... and prints a frontmatter snippet to paste
 * into the matching content/projects/<slug>.mdx.
 *
 *   bun run upload-media <slug>
 *
 * Expected layout under media-staging/<slug>/:
 *   hero.mp4         (optional — autoplay hover video)
 *   hero.gif         (optional — gif fallback)
 *   hero.{jpg,png,webp}  (optional — static poster, also used as preview.image)
 *   gallery/01.webp  (optional — gallery item, numbered)
 *   gallery/02.webp
 *   ...
 *
 * Required env vars (in .env.local):
 *   IMAGEKIT_PRIVATE_KEY
 *   IMAGEKIT_PUBLIC_KEY
 *   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
 */

import fs from "node:fs";
import path from "node:path";
import ImageKit from "imagekit";

const STAGING_ROOT = path.join(process.cwd(), "media-staging");
const REMOTE_ROOT = "/projects";

const HERO_BASENAMES = ["hero"] as const;
const STATIC_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"] as const;
const VIDEO_EXT = ".mp4";
const GIF_EXT = ".gif";

type UploadedFile = {
  url: string;
  remotePath: string;
  localPath: string;
  kind: "hero-video" | "hero-gif" | "hero-image" | "gallery";
};

function loadEnv() {
  const envLocal = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envLocal)) {
    return;
  }
  const lines = fs.readFileSync(envLocal, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getClient() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!(privateKey && publicKey && urlEndpoint)) {
    console.error(
      "Missing env vars. Need IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in .env.local"
    );
    process.exit(1);
  }

  return new ImageKit({ privateKey, publicKey, urlEndpoint });
}

function classify(localPath: string, slug: string): UploadedFile["kind"] | null {
  const rel = path.relative(path.join(STAGING_ROOT, slug), localPath);
  const ext = path.extname(rel).toLowerCase();
  const base = path.basename(rel, ext).toLowerCase();
  const dir = path.dirname(rel);

  if (dir === "gallery") {
    return "gallery";
  }
  if (HERO_BASENAMES.includes(base as (typeof HERO_BASENAMES)[number])) {
    if (ext === VIDEO_EXT) {
      return "hero-video";
    }
    if (ext === GIF_EXT) {
      return "hero-gif";
    }
    if (STATIC_IMAGE_EXTS.includes(ext as (typeof STATIC_IMAGE_EXTS)[number])) {
      return "hero-image";
    }
  }
  return null;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile() && !entry.name.startsWith(".")) {
      out.push(full);
    }
  }
  return out;
}

async function uploadFile(
  client: ImageKit,
  localPath: string,
  slug: string,
  kind: UploadedFile["kind"]
): Promise<UploadedFile> {
  const folder = path.posix.join(
    REMOTE_ROOT,
    slug,
    kind === "gallery" ? "gallery" : ""
  );
  const fileName = path.basename(localPath);
  const buffer = fs.readFileSync(localPath);

  const res = await client.upload({
    file: buffer,
    fileName,
    folder,
    useUniqueFileName: false,
    overwriteFile: true,
    tags: ["project", slug],
  });

  return {
    url: res.url,
    remotePath: path.posix.join(folder, fileName),
    localPath,
    kind,
  };
}

function printSnippet(uploads: UploadedFile[]) {
  const heroVideo = uploads.find((u) => u.kind === "hero-video");
  const heroGif = uploads.find((u) => u.kind === "hero-gif");
  const heroImage = uploads.find((u) => u.kind === "hero-image");
  const gallery = uploads
    .filter((u) => u.kind === "gallery")
    .sort((a, b) => a.localPath.localeCompare(b.localPath));

  console.log("\n— frontmatter snippet —\n");

  if (gallery.length > 0) {
    console.log("images:");
    for (const g of gallery) {
      console.log(`  - src: "${g.url}"`);
      console.log("    alt: \"\"");
    }
  } else {
    console.log("images: []");
  }

  const previewLines: string[] = [];
  if (heroVideo) {
    previewLines.push(`  video: "${heroVideo.url}"`);
  }
  if (heroGif) {
    previewLines.push(`  gif: "${heroGif.url}"`);
  }
  if (heroImage) {
    previewLines.push(`  image: "${heroImage.url}"`);
  }
  if (previewLines.length === 0) {
    console.log("preview: {}");
  } else {
    console.log("preview:");
    for (const l of previewLines) {
      console.log(l);
    }
  }
  console.log("");
}

async function main() {
  loadEnv();

  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: bun run upload-media <slug>");
    console.error("Expects media-staging/<slug>/... with hero.* and gallery/*");
    process.exit(1);
  }

  const projectDir = path.join(STAGING_ROOT, slug);
  if (!fs.existsSync(projectDir)) {
    console.error(`No such directory: ${projectDir}`);
    process.exit(1);
  }

  const client = getClient();
  const files = walk(projectDir);

  if (files.length === 0) {
    console.error(`No files found under ${projectDir}`);
    process.exit(1);
  }

  console.log(`Uploading ${files.length} file(s) for project: ${slug}`);

  const uploaded: UploadedFile[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    const kind = classify(file, slug);
    if (!kind) {
      skipped.push(file);
      continue;
    }
    process.stdout.write(`  ${path.relative(projectDir, file)} → `);
    try {
      const result = await uploadFile(client, file, slug, kind);
      uploaded.push(result);
      console.log(result.url);
    } catch (err) {
      console.log("FAILED");
      console.error(err);
    }
  }

  if (skipped.length > 0) {
    console.log(
      `\nSkipped ${skipped.length} unrecognized file(s) (not hero.* or under gallery/):`
    );
    for (const f of skipped) {
      console.log(`  ${path.relative(projectDir, f)}`);
    }
  }

  printSnippet(uploaded);
  console.log(`Done — ${uploaded.length} file(s) uploaded.`);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
