import { fetchQuery } from "convex/nextjs";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";

export default async function ViewJob({ params }: { params: { id: string } }) {
  try {
    const { success, data: jobId, error: urlValidationError } = z.string().safeParse(params.id);
    if (!success) {
      console.log(urlValidationError);
      notFound();
    }

    const { job } = await fetchQuery(api.jobs.jobUnauthenticatedView, { jobId });

    /* Proceed with caution!!! MDX compiles to JavaScript and is executed on the server. */
    /* TODO: validate the markdown provided by the user */
    return (
      <>
        <div className="prose">
          <MDXRemote source={job.description} />
        </div>
        <div className="flex items-center justify-center my-16">
          <Link
            href="./apply"
            className="w-24 h-12 border rounded-lg bg-[rgba(79,70,229,1)] text-white text-center font-semibold flex items-center justify-center"
          >
            Apply
          </Link>
        </div>
      </>
    );
  } catch (error) {
    /* TODO: create job not exists page */
    console.log(error);
    notFound();
  }
}
