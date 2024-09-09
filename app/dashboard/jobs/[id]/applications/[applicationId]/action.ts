"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "../../../../../../convex/_generated/api";
import { AUTH_SUCCESS_REDIRECT_URI } from "../../../../../../lib/constants";

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
  revalidatePath(AUTH_SUCCESS_REDIRECT_URI, "layout");
}
