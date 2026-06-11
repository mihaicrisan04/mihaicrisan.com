# Convex backend

- `agent.ts` — "Zuzu" portfolio assistant (@convex-dev/agent, OpenRouter `google/gemini-2.5-flash`) + thread creation
- `streamChat.ts` — `sendMessage` action ("use node"): runs the agent, persists streaming deltas
- `queries.ts` — `listThreadMessages` for the client's `useUIMessages` subscription
- `tools.ts` — agent tools (search portfolio, list projects, work experience, blog, time)
- `rag.ts` + `ingest.ts` — RAG component (OpenAI embeddings) and ingestion actions (run by `scripts/ingest.ts` postbuild)
- `blog.ts` + `schema.ts` — blog post queries/mutations and the `documents` / `blogPosts` tables
