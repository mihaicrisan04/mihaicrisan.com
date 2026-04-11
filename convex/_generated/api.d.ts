/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agent from "../agent.js";
import type * as blog from "../blog.js";
import type * as chat from "../chat.js";
import type * as http from "../http.js";
import type * as ingest from "../ingest.js";
import type * as migrate from "../migrate.js";
import type * as queries from "../queries.js";
import type * as rag from "../rag.js";
import type * as seed from "../seed.js";
import type * as streamChat from "../streamChat.js";
import type * as tools from "../tools.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agent: typeof agent;
  blog: typeof blog;
  chat: typeof chat;
  http: typeof http;
  ingest: typeof ingest;
  migrate: typeof migrate;
  queries: typeof queries;
  rag: typeof rag;
  seed: typeof seed;
  streamChat: typeof streamChat;
  tools: typeof tools;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
  rag: import("@convex-dev/rag/_generated/component.js").ComponentApi<"rag">;
};
