/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as jobs from "../jobs.js";
import type * as messages from "../messages.js";
import type * as users from "../users.js";
import type * as util_constants from "../util/constants.js";
import type * as util_experience from "../util/experience.js";
import type * as util_score from "../util/score.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  auth: typeof auth;
  http: typeof http;
  jobs: typeof jobs;
  messages: typeof messages;
  users: typeof users;
  "util/constants": typeof util_constants;
  "util/experience": typeof util_experience;
  "util/score": typeof util_score;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
