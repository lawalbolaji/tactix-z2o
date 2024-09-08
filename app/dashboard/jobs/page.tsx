import { format, parseISO } from "date-fns";
import { FileSearchIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../components/ui/table";
import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
/* prettier-ignore */
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../../components/ui/pagination";
import { PublishJobButton } from "../../../components/jobs/publish";
import { CopyJobUrlButton } from "../../../components/jobs/copy";
import { DeleteJobButton } from "../../../components/jobs/delete";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

// const REMOTE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxxxx";
const APP_TIME_FORMAT = "yyyy-MM-dd";
const PAGE_SIZE = 7;

export default async function Jobs({ searchParams }: { searchParams: { offset: number } }) {
  /* TODO: convex does not support offset based pagination, so will need to implement full client side pagination */
  let offset = +(searchParams.offset || 0);
  const currentPage = offset / PAGE_SIZE;
  const paginationOps = { numItems: 10, cursor: null };
  const token = convexAuthNextjsToken();
  const { page: jobs } = await fetchQuery(api.jobs.allJobsWithPagination, { paginationOps }, { token });
  const totalRecords = 0;

  if (!jobs.length) {
    return (
      <div className="bg-gray-100 p-6 md:p-8 flex flex-col items-center justify-center text-center h-full w-full">
        <FileSearchIcon className="w-12 h-12 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Job Postings Yet</h2>
        <p className="text-gray-500 mb-6">
          You have not posted any jobs yet. Check back later or consider posting a new job.
        </p>

        <Link
          href={"./jobs/new"}
          className="p-4 border rounded-lg bg-[hsl(222.2,47.4%,11.2%)] text-white hover:opacity-80"
        >
          + Create new Job{" "}
        </Link>
      </div>
    );
  }

  return (
    <Card style={{ boxShadow: "none", border: "none" }}>
      <div className="flex flex-row justify-between items-center">
        <CardHeader className="px-7">
          <CardTitle>Job Postings</CardTitle>
          <CardDescription>All job postings you&apos;ve created.</CardDescription>
        </CardHeader>
        <div className="hidden items-center space-x-2 md:flex hover:font-semibold hover:text-[#38461e] border rounded-lg p-4 hover:bg-accent hover:text-accent-foreground font-semibold mr-24">
          <Link href="./jobs/new">+ Create Job</Link>
        </div>
      </div>
      <CardContent style={{ border: "none" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead className="hidden sm:table-cell">Created On</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Expires On</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>
                  <Link href={`./jobs/${job._id}/applications`} prefetch={false}>
                    <div className="font-medium">{job.title}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">{job.location}</div>
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {format(new Date(job._creationTime), APP_TIME_FORMAT)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    {job.is_published
                      ? job.is_open
                        ? new Date(job.expires_at) > new Date()
                          ? "Published"
                          : "Expired"
                        : "Closed"
                      : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(job.expires_at), APP_TIME_FORMAT)}
                </TableCell>
                <TableCell className="text-right flex justify-center items-center">
                  <div className="flex items-center gap-2">
                    <PublishJobButton jobId={job._id} is_published={!!job.is_published} />
                    <CopyJobUrlButton jobId={job._id} />
                    <DeleteJobButton jobId={job._id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="border-t px-4 py-6 flex items-center justify-between">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-disabled={currentPage < 1}
                  href={`./jobs?offset=${(currentPage - 1) * PAGE_SIZE}`}
                  style={
                    currentPage < 1
                      ? {
                          pointerEvents: "none",
                          opacity: "0.4",
                        }
                      : {}
                  }
                />
              </PaginationItem>
              {currentPage < 1 ? (
                <></>
              ) : (
                <PaginationItem>
                  <PaginationLink href={`./jobs?offset=${(currentPage - 1) * PAGE_SIZE}`}>{currentPage}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href="#" isActive aria-disabled>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
              {(currentPage + 1) * PAGE_SIZE < totalRecords ? (
                <PaginationItem>
                  <PaginationLink href={`./jobs?offset=${(currentPage + 1) * PAGE_SIZE}`}>
                    {currentPage + 2}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <></>
              )}
              <PaginationItem>
                <PaginationNext
                  aria-disabled={(currentPage + 1) * PAGE_SIZE >= totalRecords}
                  style={
                    (currentPage + 1) * PAGE_SIZE >= totalRecords
                      ? {
                          pointerEvents: "none",
                          opacity: "0.4",
                        }
                      : {}
                  }
                  href={`./jobs?offset=${(currentPage + 1) * PAGE_SIZE}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
