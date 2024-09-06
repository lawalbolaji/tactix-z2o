import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Fragment } from "react";
import { FileSearch, Star } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

/* /dashboard/jobs/[id]/applications */

export default async function TopApplications({ params }: { params: { id: string } }) {
  /* maximum of 3 applicants here, use view all button to see all applicants */
  const {
    applications: topApplications,
    job: { title: jobTitle },
  } = await fetchQuery(api.applications.topApplications, { jobId: params.id }, { token: convexAuthNextjsToken() });

  return (
    <main className="flex-1 px-4 md:px-6 py-12">
      <div className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20">
        {topApplications.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <FileSearch className="w-12 h-12 text-gray-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Applicants Yet</h2>
            <p className="text-gray-500 mb-6">
              There are currently no applicants for this position. Check back later or consider posting the job in
              additional places.
            </p>
          </div>
        ) : (
          <>
            <header className="mb-8 md:mb-10 lg:mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{jobTitle}</h1>
              <p className="text-sm font-semi-bold py-4">Top rated applicants</p>
            </header>

            <div className="grid gap-6 md:gap-8 lg:gap-10">
              <div className="flex flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10">
                {topApplications.map((applicant) => (
                  <Fragment key={applicant._id}>
                    <div className="bg-gray-100 rounded-lg p-4 md:p-6 flex flex-col items-start gap-4">
                      <div className="flex items-center gap-4">
                        {/* TODO: need some auth data for each applicant */}
                        <Avatar>
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{applicant.name}</h3>
                          <p className="text-sm text-gray-500">{applicant.years_of_experience}+ years of experience</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-3">
                        {applicant.name.split(" ")[0]} is an experienced professional with a strong background as a{" "}
                        {jobTitle}. He has a proven track record of delivering high-quality, work and has expertise in
                        that can drive organizations forward.
                      </p>
                      <div className="flex items-center gap-2">
                        {Array.from(Array(5).keys()).map((_, idx) => (
                          <Star
                            key={idx}
                            className="w-5 h-5"
                            style={{
                              fill: `${Math.floor((applicant.score! / 100) * 5) >= idx + 1 ? "#C27803" : undefined}`,
                            }}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{((applicant.score! / 100) * 5).toFixed(1)}</span>
                      </div>
                      <div className="mt-auto w-full">
                        <Link
                          href={`./applications/${applicant._id}`}
                          className="ml-auto text-gray-900 underline-offset-4 hover:underline h-9 rounded-md px-3n text-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  href={`./applications/all`}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  View All Applicants
                </Link>
              </div>
            </div>
          </>
        )}
      </div>{" "}
    </main>
  );
}
