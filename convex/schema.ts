import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  metadata: defineTable({
    userId: v.id("users"),
    company: v.string(),
    company_url: v.string(),
  }).index("by_userId", ["userId"]),
  jobs: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    salary: v.number(),
    is_published: v.optional(v.boolean()),
    is_deleted: v.optional(v.boolean()),
    is_open: v.optional(v.boolean()),
    expires_at: v.string() /* should be an ISO timestamp */,
    qualifications: v.string(),
    employment_type: v.string(),
    experience: v.string(),
    email_subject: v.string(),
    email_message: v.string(),
  }).index("by_authorId", ["authorId"]),
  applications: defineTable({
    jobId: v.id("jobs"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    resume_uri: v.string(),
    cover_letter: v.string(),
    additional_info: v.string(),
    score: v.optional(v.number()),
    rational: v.optional(v.string()),
    status: v.string(),
    linkedin: v.string(),
    portfolio: v.string(),
    salary: v.optional(v.number()),
    location: v.string(),
    years_of_experience: v.number(),
  }).index("by_jobId_score", ["jobId", "score"]),
});
