import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const topApplications = query({
  args: { jobId: v.string() },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    // get job details
    const job = await ctx.db.get(args.jobId as Id<"jobs">);
    if (!job) throw new Error("job not found");

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_jobId_score", (query) => query.eq("jobId", args.jobId as Id<"jobs">))
      .order("desc")
      .take(3);

    return { applications, job: { title: job.title } };
  },
});

export const allApplicationsWithPagination = query({
  args: { paginationOps: paginationOptsValidator, jobId: v.string() },
  handler: async (ctx, args) => {
    /* need to implement manual client side pagination */
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    return await ctx.db
      .query("applications")
      .withIndex("by_jobId_score", (query) => query.eq("jobId", args.jobId as Id<"jobs">)) /*  */
      .order("desc") /* By default Convex always returns documents ordered by _creationTime */
      .paginate(args.paginationOps);
  },
});
