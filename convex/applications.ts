import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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

export const application = query({
  args: { jobId: v.string(), applicationId: v.string() },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    // get job details
    const job = await ctx.db.get(args.jobId as Id<"jobs">);
    if (!job) throw new Error("job not found");

    const application = await ctx.db.get(args.applicationId as Id<"applications">);
    if (!application) throw new Error("application not found");

    application.resume_uri = (await ctx.storage.getUrl(application?.resume_uri as Id<"_storage">))!;
    return { application, job: { title: job.title } };
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

export const updateApplicationStatus = mutation({
  args: { applicationId: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) throw new Error("user not signed in");

    await ctx.db.patch(args.applicationId as Id<"applications">, { status: args.status });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createJobApplication = mutation({
  args: {
    jobId: v.id("jobs"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    resume_uri: v.string(),
    cover_letter: v.string(),
    additional_info: v.string(),
    linkedin: v.string(),
    portfolio: v.string(),
    salary: v.optional(v.number()),
    location: v.string(),
    years_of_experience: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("applications", {
      ...args,
      status: "submitted",
      score: 85,
      rational: "great application overall",
    });
  },
});

export const applicationStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("user not signed in");

    const jobIds = (
      await ctx.db
        .query("jobs")
        .withIndex("by_authorId", (query) => query.eq("authorId", userId as Id<"users">))
        .collect()
    ).map((job) => job._id);

    const applications = await ctx.db
      .query("applications")
      .filter((query) => jobIds.some((id) => query.eq(query.field("jobId"), id)))
      .collect();

    return {
      totalApplicants: applications.length,
      incrInTotalApplicantsFromLastMonth: 0,
      totalInterviews: applications.reduce((count, application) => {
        if (application.status === "approve") return count + 1;
        return count;
      }, 0),
      incrInTotalInterviewsFromLastMonth: 0,
    };
  },
});
