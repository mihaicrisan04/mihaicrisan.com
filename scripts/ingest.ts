#!/usr/bin/env bun
/**
 * Reads repo content (project MDX, the about doc, work experience, setup)
 * and pushes it into Convex for use by the RAG-powered AI chat. Run locally
 * after content changes, or automatically from the Vercel build via the
 * `postbuild` script.
 *
 *   bun run ingest
 *
 * Required env: NEXT_PUBLIC_CONVEX_URL
 */

import fs from "node:fs";
import path from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { workExperience } from "../content/knowledge/work-experience";
import { api } from "../convex/_generated/api";
import { setupGroups } from "../data/setup";
import { getAllProjects } from "../lib/projects";

// Generated from data/setup.ts at ingest time so it can never drift
// from the /setup page.
function formatSetupDoc(): string {
  const sections = setupGroups.map((group) => {
    const items = group.items
      .map((item) => {
        const note = item.note ? ` — ${item.note}` : "";
        const href = item.href ? ` (${item.href})` : "";
        return `- ${item.name}${note}${href}`;
      })
      .join("\n");
    const footer = group.footer ? `\n\n${group.footer}` : "";
    return `## ${group.title}\n\n${items}${footer}`;
  });

  return `# mihai's setup

the hardware, cli tools, and apps mihai uses daily — the live version is at /setup on the site.

${sections.join("\n\n")}`;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    process.exit(1);
  }

  const client = new ConvexHttpClient(url);

  // Projects (MDX in content/projects is the source of truth)
  const projects = getAllProjects();
  if (projects.length === 0) {
    console.warn("No projects found in content/projects — nothing to ingest");
  } else {
    const payload = projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      category: p.category,
      status: p.status,
      startDate: p.startDate,
      endDate: p.endDate,
      ongoing: p.ongoing,
      featured: p.featured,
      website: p.website,
      links: p.links,
      techStack: p.techStack,
      highlights: p.highlights,
      body: p.content,
    }));

    console.log(`Ingesting ${payload.length} project(s) into Convex...`);
    const result = await client.action(api.ingest.ingestProjects, {
      projects: payload,
    });
    console.log(`Done — ingested ${result.ingested} project(s).`);

    const prunedProjects = await client.mutation(api.ingest.pruneDocuments, {
      source: "project",
      keepSourceIds: payload.map((p) => p.slug),
    });
    if (prunedProjects.pruned > 0) {
      console.log(`Pruned ${prunedProjects.pruned} stale project doc(s).`);
    }
  }

  // Work experience (content/knowledge/work-experience.ts)
  console.log("Ingesting work experience...");
  const workResult = await client.action(api.ingest.ingestWorkExperience, {
    entries: workExperience,
  });
  console.log(`Done — ingested ${workResult.ingested} work entries.`);

  const prunedWork = await client.mutation(api.ingest.pruneDocuments, {
    source: "work",
    keepSourceIds: workExperience.map((w) => w.id),
  });
  if (prunedWork.pruned > 0) {
    console.log(`Pruned ${prunedWork.pruned} stale work doc(s).`);
  }

  // Knowledge docs: handwritten about.md + setup generated from data/setup.ts
  const aboutPath = path.join(process.cwd(), "content/knowledge/about.md");
  const knowledgeDocs = [
    {
      key: "about:me" as const,
      title: "about mihai",
      content: fs.readFileSync(aboutPath, "utf8"),
    },
    {
      key: "about:setup" as const,
      title: "mihai's setup",
      content: formatSetupDoc(),
    },
  ];

  console.log("Ingesting knowledge docs...");
  const knowledgeResult = await client.action(api.ingest.ingestKnowledge, {
    docs: knowledgeDocs,
  });
  console.log(`Done — ingested ${knowledgeResult.ingested} knowledge doc(s).`);

  const prunedAbout = await client.mutation(api.ingest.pruneDocuments, {
    source: "about",
    keepSourceIds: knowledgeDocs.map((d) => d.key),
  });
  if (prunedAbout.pruned > 0) {
    console.log(`Pruned ${prunedAbout.pruned} stale knowledge doc(s).`);
  }

  // Blog posts (already stored in Convex — re-embed published ones)
  console.log("Ingesting blog posts...");
  const blogResult = await client.action(api.ingest.ingestBlogPosts, {});
  console.log(`Done — ingested ${blogResult.ingested} blog post(s).`);

  // Prune unpublished/deleted posts — also clears the old _id-keyed rows
  // from before blog sourceIds were "blog:<slug>".
  const blogSlugs = await client.query(api.blog.getAllBlogSlugs, {});
  const prunedBlog = await client.mutation(api.ingest.pruneDocuments, {
    source: "blog",
    keepSourceIds: blogSlugs.map((slug) => `blog:${slug}`),
  });
  if (prunedBlog.pruned > 0) {
    console.log(`Pruned ${prunedBlog.pruned} stale blog doc(s).`);
  }
}

main().catch((err) => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
