import { EllipsisVertical } from "lucide-react";
import { DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "./ui/dropdown-menu";
import Link from "next/link";
import { CopyJobUrlStatic } from "./copyjoburlstatic";

export function RecentJobPostings(props: { jobs: Array<any> }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="">Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.jobs?.map((job) => (
                    <TableRow key={job._id}>
                        <TableCell>
                            <Link href={`./dashboard/jobs/${job._id}/applications`} prefetch={false}>
                                <div className="font-medium">{job.title}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">{job.location}</div>
                            </Link>
                        </TableCell>
                        <TableCell className="">
                            <Badge className="text-xs" variant="outline">
                                {job.is_open ? "Open" : "Closed"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <EllipsisVertical className="h-4 w-4" />
                                        <span className="sr-only">Transaction actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                                    {/* create job url based on job id */}
                                    <CopyJobUrlStatic jobId={job._id} />

                                    {/* delete job with server action */}
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
