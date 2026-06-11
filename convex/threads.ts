import { abortStream, listStreams } from "@convex-dev/agent";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { mutation } from "./_generated/server";

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
