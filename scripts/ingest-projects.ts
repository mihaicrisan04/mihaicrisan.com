#!/usr/bin/env bun
/**
 * Reads project MDX files (source of truth) and pushes them into Convex
 * for use by the RAG-powered AI chat. Run locally after content changes,
 * or automatically from the Vercel build via the `postbuild` script.
 *
 *   bun run ingest
 *
 * Required env: NEXT_PUBLIC_CONVEX_URL
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { getAllProjects } from "../lib/projects";

async function main() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    process.exit(1);
  }

  const client = new ConvexHttpClient(url);
  const projects = getAllProjects();

  if (projects.length === 0) {
    console.warn("No projects found in content/projects — nothing to ingest");
    return;
  }

  const payload = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    category: p.category,
    status: p.status,
    startDate: p.startDate,
    endDate: p.endDate,
    techStack: p.techStack,
    highlights: p.highlights,
    body: p.content,
  }));

  console.log(`Ingesting ${payload.length} project(s) into Convex...`);
  const result = await client.action(api.ingest.ingestProjects, {
    projects: payload,
  });
  console.log(`Done — ingested ${result.ingested} project(s).`);

  console.log("Ingesting work experience...");
  const workResult = await client.action(api.ingest.ingestWorkExperience, {});
  console.log(`Done — ingested ${workResult.ingested} work entries.`);

  console.log("Ingesting blog posts...");
  const blogResult = await client.action(api.ingest.ingestBlogPosts, {});
  console.log(`Done — ingested ${blogResult.ingested} blog post(s).`);
}

main().catch((err) => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
