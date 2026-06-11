import { RAG } from "@convex-dev/rag";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { components } from "./_generated/api";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const rag = new RAG(components.rag, {
  embeddingDimension: 1536, // text-embedding-3-small dimension
  textEmbeddingModel: openrouter.textEmbeddingModel(
    "openai/text-embedding-3-small"
  ),
});
