// prettier-ignore
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import Link from "next/link";
import { z } from "zod";
import { notFound } from "next/navigation";
import { FileSearchIcon, FolderDown, LocateFixed, Mail, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";

const PAGE_SIZE = 9;

/* ref: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings#:~:text=Internationalization */
const formatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "NGN",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default async function AllApplications({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { offset: number };
}) {
  const { success, data: jobId, error: urlValidationError } = z.string().safeParse(params.id);
  if (!success) {
    console.log(urlValidationError);
    notFound();
  }

  let offset = +(searchParams.offset || 0);
  const currentPage = offset / PAGE_SIZE;

  const paginationOps = { numItems: 10, cursor: null };
  const token = convexAuthNextjsToken();
  const { page: applications } = await fetchQuery(
    api.applications.allApplicationsWithPagination,
    { paginationOps, jobId },
    { token },
  );

  const totalRecords = 0;
  if (!applications.length) {
    return (
      <div className="bg-gray-100 p-6 md:p-8 flex flex-col items-center justify-center text-center h-full w-full">
        <FileSearchIcon className="w-12 h-12 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Applications Yet</h2>
        <p className="text-gray-500 mb-6">There have been not been any applications for this job yet.</p>
      </div>
    );
  }

  const jobTitle = ""; /* get job title */

  return (
    <Card style={{ boxShadow: "none", border: "none" }}>
      <CardHeader>
        <CardTitle>Submitted Applications</CardTitle>
        <CardDescription>All applicants for {jobTitle}</CardDescription>
      </CardHeader>
      <CardContent style={{ border: "none" }}>
        <div className="flex flex-col gap-4 p-4 md:p-6">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[200px]">Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[150px]">Salary</TableHead>
                <TableHead className="text-center">Resume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell className="font-medium text-nowrap">
                    <Link href={`./${application._id}`}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 shrink-0" />
                        {application.name}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 shrink-0" />
                      {application.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <LocateFixed className="w-4 h-4 shrink-0" />
                      {application.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="secondary">
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatter.format(application.salary ?? 0)}</TableCell>
                  <TableCell>
                    <Link href={`${application.resume_uri}`} target="_blank" prefetch={false}>
                      <div className="flex items-center justify-center gap-2 text-center">
                        <FolderDown className="w-4 h-4 shrink-0" />
                      </div>
                    </Link>
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
                    href={`./all?offset=${(currentPage - 1) * PAGE_SIZE}`}
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
                    <PaginationLink href="#">{currentPage}</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
                {(currentPage + 1) * PAGE_SIZE < totalRecords ? (
                  <PaginationItem>
                    <PaginationLink href="#">{currentPage + 2}</PaginationLink>
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
                    href={`./all?offset=${(currentPage + 1) * PAGE_SIZE}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
