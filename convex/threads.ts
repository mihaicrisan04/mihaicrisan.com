import { abortStream, getThreadMetadata, listStreams } from "@convex-dev/agent";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";

// Used by the client before resubscribing to a localStorage-persisted thread.
// Any failure (deleted thread, different deployment, garbage id) = false —
// the client silently falls back to a fresh chat.
export const validateThread = query({
  args: { threadId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { threadId }) => {
    try {
      const thread = await getThreadMetadata(ctx, components.agent, {
        threadId,
      });
      return thread.status === "active";
    } catch {
      return false;
    }
  },
});

// Abort the most recent in-flight stream on a thread (the stop button).
// Lives here (not streamChat.ts) because that file is "use node" = actions only.
export const stopStreaming = mutation({
  args: { threadId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { threadId }) => {
    const streams = await listStreams(ctx, components.agent, { threadId });
    const [active] = streams
      .filter((s) => s.status === "streaming")
      .sort((a, b) => b.order - a.order);
    if (!active) {
      return false;
    }
    return await abortStream(ctx, components.agent, {
      reason: "user stopped",
      streamId: active.streamId,
    });
  },
});
