"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export async function signUp(prevState: any, formData: FormData) {
  const authSchema = z.object({
    company_url: z.string().url(),
    company_name: z.string(),
  });

  const {
    success,
    error: validationError,
    data: authPayload,
  } = authSchema.safeParse({
    company_url: formData.get("company_url"),
    company_name: formData.get("company_name"),
  });

  if (!success) {
    console.log(validationError.flatten().fieldErrors);
    return { error: { fields: validationError.flatten().fieldErrors, type: "VALIDATION_ERROR" } };
  }

  const token = convexAuthNextjsToken();
  await fetchMutation(
    api.users.updateUserMetadata,
    {
      company: authPayload.company_name,
      company_url: authPayload.company_url,
    },
    { token },
  );

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard?newUser=true");
}
