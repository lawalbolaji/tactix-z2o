"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "../../../../../../convex/_generated/api";

export async function UpdateApplicationStatus(
  update: { type: "reject" | "approve"; applicationId: string },
  _: FormData,
) {
  const token = convexAuthNextjsToken();
  await fetchMutation(
    api.applications.updateApplicationStatus,
    { status: update.type, applicationId: update.applicationId },
    { token },
  );
  revalidatePath("/dashboard", "layout");
}
