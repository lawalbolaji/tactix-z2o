import { Activity, Building, CreditCard, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function TotalApplicants(props: { appStats?: { totalApplicants: number } }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {!!props.appStats ? (
          <>
            <div className="text-2xl font-bold">{props.appStats?.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </>
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}

export function SuccessRate(props: { appStats?: { totalApplicants: number; totalInterviews: number } }) {
  const { appStats } = props;
  const successRate = !!appStats
    ? appStats.totalApplicants === 0
      ? 0
      : Math.floor((appStats.totalInterviews / appStats.totalApplicants) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {!!props.appStats ? (
          <>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">+10.1% from last month</p>
          </>
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}

export function Interviews(props: { appStats?: { totalInterviews: number } }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Interviews</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {!!props.appStats ? (
          <>
            <div className="text-2xl font-bold">{props.appStats?.totalInterviews}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </>
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}

export function OpenPositions(props: { jobStats?: { totalOpenPositions: number } }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
        <Building className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {!!props.jobStats ? (
          <>
            <div className="text-2xl font-bold">{props.jobStats?.totalOpenPositions}</div>
            <p className="text-xs text-muted-foreground">+5 since last hour</p>
          </>
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}

function Spinner() {
  return (
    <div className="h-12 w-12 p-4 flex flex-row justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750]" />
    </div>
  );
}
