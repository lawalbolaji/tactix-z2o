import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/* only supports delete and publish */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { op } = await request.json();
  // const supabase = createClient();
  const supabase = {} as any;

  if (op === "SOFT_DELETE") {
    const { error } = await supabase.from("jobs").update({ is_deleted: true }).eq("id", params.id).select();
    if (error) {
      console.log(error);
      return NextResponse.json({ message: "unable to update record" }, { status: 500 });
    }
  } else if (op === "PUBLISH") {
    const { error } = await supabase.from("jobs").update({ is_published: true }).eq("id", params.id);
    if (error) {
      console.log(error);
      return NextResponse.json({ message: "unable to update record" }, { status: 500 });
    }
  }

  revalidatePath("/v2/dashboard/jobs", "layout");
  return NextResponse.json({ message: "ok" });
}
