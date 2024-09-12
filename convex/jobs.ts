import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

export const createNewJob = mutation({
  args: {
    title: v.string(),
    location: v.string(),
    salary: v.number(),
    qualifications: v.string(),
    description: v.string(),
    expires_at: v.number() /* ISO timestamp */,
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

export const mostRecentJobs = query({
  args: {},
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_authorId", (query) => query.eq("authorId", authorId)) /*  */
      .filter((query) =>
        query.and(query.eq(query.field("is_deleted"), false), query.gt(query.field("expires_at"), Date.now())),
      )
      .order("desc") /* By default Convex always returns documents ordered by _creationTime */
      .take(4);

    return jobs;
  },
});

/* convex db pagination is limited to next page */
export const allJobsWithPagination = query({
  args: { paginationOps: paginationOptsValidator },
  handler: async (ctx, args) => {
    /* need to implement manual client side pagination */
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    return await ctx.db
      .query("jobs")
      .withIndex("by_authorId", (query) => query.eq("authorId", authorId)) /*  */
      .filter((query) => query.eq(query.field("is_deleted"), false))
      .order("desc") /* By default Convex always returns documents ordered by _creationTime */
      .paginate(args.paginationOps);
  },
});

export const jobUnauthenticatedView = query({
  args: { jobId: v.string() },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId as Id<"jobs">);
    /* TODO: handle expired jobs separately */
    if (!job || job.expires_at < Date.now() || !job.is_published || job.is_deleted) throw new Error("job not found");

    /* fetch company details */
    const author = await ctx.db.get(job.authorId);
    if (!author) return { job, meta: {} };

    const author_metadata = await ctx.db
      .query("metadata")
      .withIndex("by_userId", (query) => query.eq("userId", author._id))
      .unique();
    return { job, meta: { company: author_metadata?.company } };
  },
});

export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    await ctx.db.patch(args.jobId as Id<"jobs">, { is_deleted: true });
  },
});

export const publishJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    await ctx.db.patch(args.jobId as Id<"jobs">, { is_published: true });
  },
});

export const jobStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("user not signed in");

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_authorId", (query) => query.eq("authorId", userId as Id<"users">))
      .filter((query) => query.field("is_open"))
      .collect();

    const now = new Date();
    const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfPrevMonth = new Date();
    lastDayOfPrevMonth.setFullYear(now.getFullYear(), now.getMonth(), 0);

    const openJobsLastMonth = jobs.reduce((count, job) => {
      if (
        job._creationTime >= firstDayOfPrevMonth.getTime() &&
        job._creationTime <= lastDayOfPrevMonth.getTime() &&
        job.is_open
      )
        return count + 1;
      return count;
    }, 0);

    const openJobsThisMonth = jobs.reduce((count, job) => {
      if (job._creationTime >= firstDayOfCurrentMonth.getTime() && job.is_open) return count + 1;
      return count;
    }, 0);

    const totalJobsCreatedThisMonth = jobs.reduce((count, job) => {
      if (job._creationTime >= firstDayOfCurrentMonth.getTime()) return count + 1;
      return count;
    }, 0);

    return {
      totalOpenPositions: jobs.length,
      totalJobsCreatedThisMonth,
      incrInOpenJobsThisMonth: Math.floor(
        ((openJobsThisMonth - openJobsLastMonth) / (openJobsThisMonth + openJobsLastMonth)) * 100,
      ),
    };
    /* TODO: jobs created by month [janVal, febVal, ...] */
  },
});
