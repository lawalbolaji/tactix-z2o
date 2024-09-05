import Link from "next/link";
import { NewUser } from "@/components/ui/icons/newuser";
import { ArrowUpRightIcon, FileSearchIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { RecentJobPostings } from "../../components/recent-jobs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scrollarea";
import { Overview } from "../../components/overview";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function Dashboard({ searchParams }: { searchParams: { newUser: string /* newUser=true */ } }) {
  /* TODO: rework new user page */
  if (searchParams.newUser === "true") {
    const userFirstName = "Rasheed";

    return (
      <div className="flex flex-col justify-between items-center h-full w-full py-8">
        <h2 className="text-3xl font-bold tracking-tight p-4">Hi {userFirstName}, Welcome to Tactix 👋</h2>
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

  const nameOfUser = "Rasheed";
  let totalApplicants = 0;
  let totalInterviews = 0;
  let totalOpenPositions = 0;
  let totalJobsCreatedThisMonth = 0;
  let jobs: Array<any> = await fetchQuery(api.jobs.jobs, {}, { token: convexAuthNextjsToken() });
  const successRate = totalApplicants === 0 ? 0 : Math.floor((totalInterviews / totalApplicants) * 100);

  /* TODO: fetch data for dashboard analytics - charts, badges, ... */
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Hi{nameOfUser ? " " + nameOfUser : ""}, Welcome back 👋</h2>
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalApplicants}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isNaN(successRate) ? 0 : successRate}%</div>
                  <p className="text-xs text-muted-foreground">+10.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalInterviews}</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOpenPositions}</div>
                  <p className="text-xs text-muted-foreground">+5 since last hour</p>
                </CardContent>
              </Card>
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
                      You created {totalJobsCreatedThisMonth} job
                      {totalJobsCreatedThisMonth > 1 ? "s" : ""} this month.
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
