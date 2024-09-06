import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not signed in");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new Error("User was deleted");
    }
    return user;
  },
});

export const getLoggedInUserMetadata = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");

    const metadata = await ctx.db
      .query("metadata")
      .withIndex("by_userId", (query) => query.eq("userId", userId))
      .unique();

    return metadata;
  },
});

export const updateUserMetadata = mutation({
  args: { company: v.string(), company_url: v.string() },
  handler: async (ctx, args) => {
    /* this authentication will fail if request originates from server */
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    await ctx.db.insert("metadata", { company: args.company, company_url: args.company_url, userId });
  },
});
