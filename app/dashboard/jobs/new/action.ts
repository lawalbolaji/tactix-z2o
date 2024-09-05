"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod";

import { employmentTypes, experienceLevels } from "@/components/jobs/data";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export async function createNewJobPosting(formData: FormData) {
  const payload = {
    title: formData.get("title"),
    location: formData.get("location"),
    description: formData.get("description"),
    salary: formData.get("salary"),
    expires_at: formData.get("expires_at"),
    employment_type: formData.get("employment_type"),
    experience: formData.get("experience"), // entry_level, mid_level, expert
    qualifications: formData.get("qualifications"),
    email_subject: formData.get("email_subject"),
    email_message: formData.get("email_message"),
  };

  // validate form
  const jobPostingSchema = z.object({
    title: z.string(),
    location: z.string(),
    salary: z.string(),
    qualifications: z.string(),
    description: z.string(),
    expires_at: z.string(),
    employment_type: z.enum(employmentTypes),
    experience: z.enum(experienceLevels),
    email_subject: z.string(),
    email_message: z.string(),
  });

  const { success: parseSuccess, data, error: parseError } = jobPostingSchema.safeParse(payload);
  if (!parseSuccess) {
    console.log(parseError.flatten());
    return { errors: parseError.flatten().fieldErrors };
  }

  const token = convexAuthNextjsToken();
  /* this guy will throw if there's an error */
  await fetchMutation(api.jobs.createNewJob, { ...data, is_published: true, salary: +data.salary }, { token });
  console.log("successfully saved job to DB");

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}
