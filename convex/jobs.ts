import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createNewJob = mutation({
  args: {
    title: v.string(),
    location: v.string(),
    salary: v.number(),
    qualifications: v.string(),
    description: v.string(),
    expires_at: v.string(),
    employment_type: v.string(),
    experience: v.string(),
    email_subject: v.string(),
    email_message: v.string(),
    is_published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    await ctx.db.insert("jobs", { ...args, authorId, is_deleted: false, is_open: true });
  },
});

export const jobs = query({
  args: {},
  handler: async (ctx) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    const jobs = await ctx.db.query("jobs").withIndex("authorId", (query) => query.eq("authorId", authorId)).collect();
    return jobs;
  },
});
