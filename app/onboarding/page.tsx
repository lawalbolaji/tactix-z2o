import { api } from "../../convex/_generated/api";
import { redirect } from "next/navigation";
import { CreateAccount } from "../../components/auth/createaccount";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function Onboarding() {
  const metadata = await fetchQuery(api.users.getLoggedInUserMetadata, {}, { token: convexAuthNextjsToken() });
  if (!!metadata) {
    redirect("/dashboard");
  }

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl select-none">
              Create an account
            </h1>
            <CreateAccount />
          </div>
        </div>
      </div>
    </section>
  );
}
