import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";

export default async function JobsLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  try {
    const { success, data: jobId, error: urlValidationError } = z.string().safeParse(params.id);
    if (!success) {
      throw new Error(urlValidationError.toString());
    }
    const {
      job,
      meta: { company },
    } = await fetchQuery(api.jobs.jobUnauthenticatedView, { jobId });
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center my-8">
          <h1 className="text-3xl font-bold">
            {job.title}, {company ?? "Acme inc."}
          </h1>
          <p className="text-sm p-2 font-semibold">{job.location}</p>
        </div>
        {children}
      </div>
    );
  } catch (error) {
    /* TODO: create job not exists page */
    console.log(error);
    notFound();
  }
}
