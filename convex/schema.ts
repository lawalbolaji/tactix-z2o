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
  }).index("userId", ["userId"]),
  jobs: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    salary: v.number(),
    is_published: v.boolean(),
    is_deleted: v.boolean(),
    is_open: v.boolean(),
    expires_at: v.string() /* should be an ISO timestamp */,
    qualifications: v.string(),
    employment_type: v.string(),
    experience: v.string(),
    email_subject: v.string(),
    email_message: v.string(),
  }),
  applicants: defineTable({
    jobId: v.id("jobs"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    resume_uri: v.string(),
    cover_letter: v.string(),
    additional_info: v.string(),
    score: v.int64(),
    rational: v.string(),
    status: v.string(),
    linkedin: v.string(),
    portfolio: v.string(),
    salary: v.string(),
    location: v.string(),
    years_of_experience: v.int64(),
  }),
});
