import Link from "next/link";
import { NewUser } from "@/components/ui/icons/newuser";
import { ScrollArea } from "../../components/ui/scrollarea";
import { api } from "../../convex/_generated/api";
import UI from "../../components/dashboard/ui";
import { fetchQuery } from "convex/nextjs";
import { ConvexError } from "convex/values";
import { redirect } from "next/navigation";
import { AuthErrorCode, AUTH_FAIL_REDIRECT_URI } from "../../lib/constants";
import { ConvexErrorPayload } from "../../types";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function Dashboard({ searchParams }: { searchParams: { newUser: string /* newUser=true */ } }) {
  try {
    const user = await fetchQuery(api.users.viewer, {}, { token: convexAuthNextjsToken() });
    const userFirstName = user?.name?.split(" ")[0];

    /* TODO: rework new user page */
    if (searchParams.newUser === "true") {
      return (
        <div className="flex flex-col justify-between items-center h-full w-full py-8">
          <h2 className="text-3xl font-bold tracking-tight p-4">{userFirstName}, welcome to Tactix 👋</h2>
          <Link
            href={"./dashboard/jobs/new"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-lg"
          >
            Create your first Job
          </Link>
          <div className="flex items-center justify-center object-cover h-full w-full">
            <NewUser className="h-[700px] w-[900px]" />
          </div>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{userFirstName}, welcome 👋</h2>
            <div className="hidden items-center space-x-2 md:flex hover:font-semibold hover:text-[#38461e] border rounded-lg p-4 hover:bg-accent hover:text-accent-foreground font-semibold">
              <Link href="./dashboard/jobs/new">+ Create Job</Link>
            </div>
          </div>
          <UI />
        </div>
      </ScrollArea>
    );
  } catch (error) {
    const errorMessage = (error as Error).message.toLowerCase();
    const notLoggedIn = errorMessage.includes("not signed in");
    const tokenExpired = errorMessage.includes("expired");
    if (notLoggedIn || tokenExpired) return redirect(AUTH_FAIL_REDIRECT_URI);

    if (error instanceof ConvexError) {
      if ((error.data as ConvexErrorPayload).code === AuthErrorCode) {
        return redirect(AUTH_FAIL_REDIRECT_URI);
      }
    }

    throw error;
  }
}
