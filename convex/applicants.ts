import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const topApplicants = query({
  args: { jobId: v.string() },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    // get job details
    const job = await ctx.db.get(args.jobId as Id<"jobs">);
    if (!job) throw new Error("job not found");

    const applicants = await ctx.db
      .query("applicants")
      .withIndex("by_jobId_score", (query) => query.eq("jobId", args.jobId as Id<"jobs">))
      .order("desc")
      .take(3);

    return { applicants, job: { title: job.title } };
  },
});
