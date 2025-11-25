import { RAG } from "@convex-dev/rag";
import { openai } from "@ai-sdk/openai";
import { components } from "./_generated/api";

export const rag = new RAG(components.rag, {
  embeddingDimension: 1536, // text-embedding-3-small dimension
  textEmbeddingModel: openai.textEmbeddingModel("text-embedding-3-small"),
});
