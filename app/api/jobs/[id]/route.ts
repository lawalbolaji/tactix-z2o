import { fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { Id } from "../../../../convex/_generated/dataModel";

/* only supports delete and publish */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { op } = await request.json();
    if (op === "SOFT_DELETE") {
      await fetchMutation(api.jobs.deleteJob, { jobId: params.id as Id<"jobs"> }, { token: convexAuthNextjsToken() });
    } else if (op === "PUBLISH") {
      await fetchMutation(api.jobs.publishJob, { jobId: params.id as Id<"jobs"> }, { token: convexAuthNextjsToken() });
    }
  } catch (error) {
    return NextResponse.json({ message: "unable to update record" }, { status: 500 });
  }

  revalidatePath("/dashboard/jobs", "layout");
  return NextResponse.json({ message: "ok" });
}
