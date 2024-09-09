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

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_authorId", (query) => query.eq("authorId", userId as Id<"users">))
      .collect();
    const jobIds = jobs.map((job) => job._id);
    const applications = await ctx.db
      .query("applications")
      .filter((query) => jobIds.some((id) => query.eq(query.field("jobId"), id)))
      .collect();

    const now = new Date();
    const firstDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfPrevMonth = new Date();
    /* If you provide 0 as the dayValue in Date.setFullYear you get the last day of the previous month, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setFullYear */
    lastDayOfPrevMonth.setFullYear(now.getFullYear(), now.getMonth(), 0);

    const totalInterviewsInPrevMonth = applications.reduce((count, application) => {
      if (
        application._creationTime >= firstDayOfPrevMonth.getTime() &&
        application._creationTime <= lastDayOfPrevMonth.getTime() &&
        application.status === "approve"
      )
        return count + 1;
      return count;
    }, 0);

    const totalInterviewsUpToPrevMonth = applications.reduce((count, application) => {
      if (application._creationTime <= lastDayOfPrevMonth.getTime() && application.status === "approve")
        return count + 1;
      return count;
    }, 0);

    const totalInterviewsToday = applications.reduce((count, application) => {
      if (application.status === "approve") return count + 1;
      return count;
    }, 0);

    const totalApplicationsInPrevMonth = applications.reduce((count, application) => {
      if (
        application._creationTime >= firstDayOfPrevMonth.getTime() &&
        application._creationTime <= lastDayOfPrevMonth.getTime()
      )
        return count + 1;
      return count;
    }, 0);

    const totalApplicationsUpToPrevMonth = applications.reduce((count, application) => {
      if (application._creationTime <= lastDayOfPrevMonth.getTime()) return count + 1;
      return count;
    }, 0);

    const totalApplications = applications.length;

    const totalInterviewsThisMonth = applications.reduce((count, application) => {
      if (application._creationTime >= firstDayOfCurrentMonth.getTime() && application.status === "approve")
        return count + 1;
      return count;
    }, 0);

    const totalApplicationsThisMonth = applications.reduce((count, application) => {
      if (application._creationTime >= firstDayOfCurrentMonth.getTime()) return count + 1;
      return count;
    }, 0);

    const successRateFromPreviousMonth =
      totalApplicationsUpToPrevMonth > 0 ? totalInterviewsUpToPrevMonth / totalApplicationsUpToPrevMonth : 0;
    const currentSuccessRate = totalInterviewsToday / totalApplications;

    return {
      totalApplicants: totalApplications,
      incrInTotalApplicantsFromLastMonth: Math.floor(
        ((totalApplicationsThisMonth - totalApplicationsInPrevMonth) /
          (totalApplicationsThisMonth - totalApplicationsInPrevMonth)) *
          100,
      ),
      totalInterviews: applications.reduce((count, application) => {
        if (application.status === "approve") return count + 1;
        return count;
      }, 0),
      incrInTotalInterviewsFromLastMonth: Math.floor(
        ((totalInterviewsThisMonth - totalInterviewsInPrevMonth) /
          (totalInterviewsThisMonth + totalInterviewsInPrevMonth)) *
          100,
      ),
      incrInSuccessRateFromLastMonth: Math.floor(
        ((currentSuccessRate - successRateFromPreviousMonth) / (currentSuccessRate + successRateFromPreviousMonth)) *
          100,
      ),
    };
  },
});
