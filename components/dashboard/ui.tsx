"use client"

import { useQuery } from "convex/react";
import { ArrowUpRightIcon, FileSearchIcon } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Overview } from "../overview";
import { RecentJobPostings } from "../recent-jobs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { TotalApplicants, SuccessRate, Interviews, OpenPositions } from "./stats";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function UI() {
  const jobs = useQuery(api.jobs.mostRecentJobs);
  const appStats = useQuery(api.applications.applicationStats);
  const jobStats = useQuery(api.jobs.jobStats);

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics" disabled>
          Analytics
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TotalApplicants appStats={appStats} />
          <SuccessRate appStats={appStats} />
          <Interviews appStats={appStats} />
          <OpenPositions jobStats={jobStats} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>
                  You created {jobStats?.totalJobsCreatedThisMonth} job
                  {jobStats?.totalJobsCreatedThisMonth && jobStats?.totalJobsCreatedThisMonth === 1 ? "" : "s"} this
                  month.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="./dashboard/jobs">
                  View All
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {jobs?.length ? (
                <RecentJobPostings jobs={jobs} />
              ) : (
                <div className="bg-gray-100 p-6 md:p-8 flex flex-col items-center justify-center text-center h-[300px] w-full">
                  <FileSearchIcon className="w-12 h-12 text-gray-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Job Postings Yet</h2>
                  <p className="text-gray-500 mb-6">
                    You have not posted any jobs yet. Check back later or consider posting a new job.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
