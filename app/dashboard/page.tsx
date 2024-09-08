"use client";

import Link from "next/link";
import { NewUser } from "@/components/ui/icons/newuser";
import { ArrowUpRightIcon, FileSearchIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { RecentJobPostings } from "../../components/recent-jobs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scrollarea";
import { Overview } from "../../components/overview";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Interviews, OpenPositions, SuccessRate, TotalApplicants } from "../../components/dashboard/stats";

export default function Dashboard({ searchParams }: { searchParams: { newUser: string /* newUser=true */ } }) {
  const jobs = useQuery(api.jobs.mostRecentJobs);
  const user = useQuery(api.users.viewer);
  const appStats = useQuery(api.applications.applicationStats);
  const jobStats = useQuery(api.jobs.jobStats);
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
      </div>
    </ScrollArea>
  );
}
