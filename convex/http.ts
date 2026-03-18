import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { streamChat } from "./streamChat";

const http = httpRouter();

// Streaming chat endpoint using Server-Sent Events
// Uses the Convex Agent for automatic message persistence with reasoning
http.route({
  path: "/api/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { threadId, message } = body as {
        threadId?: string;
        message: string;
      };

      if (!message || typeof message !== "string") {
        return new Response(JSON.stringify({ error: "Message is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // streamChat now returns a Response directly with proper headers
      return await streamChat(ctx, { threadId, message });
    } catch (error) {
      console.error("Stream chat error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// CORS preflight handler
http.route({
  path: "/api/chat",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return await Promise.resolve(
      new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
    );
  }),
});

export default http;
