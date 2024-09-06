import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { Briefcase, Building, CheckCheck, Linkedin, Mail, Trash2 } from "lucide-react";
import Link from "next/link";
import { TriggerApplicationActionBtn } from "@/components/applications/actionbtn";
import { UpdateApplicationStatus } from "./action";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function ApplicationDetailsPage({ params }: { params: { id: string; applicationId: string } }) {
  const applicationId = params.applicationId;
  const jobId = params.id;
  const token = convexAuthNextjsToken();
  const {
    application,
    job: { title: jobTitle },
  } = await fetchQuery(api.applications.application, { applicationId, jobId }, { token });
  if (!application) return notFound();

  const rejectApplication = UpdateApplicationStatus.bind(null, { type: "reject", applicationId });
  const approveApplication = UpdateApplicationStatus.bind(null, { type: "approve", applicationId });
  const [applicantFirstName, applicantLastName] = application.name.split(" ");
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl">Applicant Details</h1>
          <p className="text-gray-500">Review the applicant&apos;s information.</p>
        </div>
        {application.status === "submitted" ? (
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0">
            <form>
              <TriggerApplicationActionBtn formAction={approveApplication} className="hover:font-semibold">
                Approve <CheckCheck className="w-4 h-4 inline-block ml-2" />
              </TriggerApplicationActionBtn>
            </form>
            <form>
              <TriggerApplicationActionBtn
                className="border-red-500 text-red-500 hover:bg-red-400 hover:text-white hover:font-semibold"
                formAction={rejectApplication}
              >
                Reject <Trash2 className="w-4 h-4 inline-block ml-2" />
              </TriggerApplicationActionBtn>
            </form>
          </div>
        ) : (
          <div className="flex flex-col opacity-70 sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0 p-4 capitalize font-semibold">
            Application{" "}
            {application.status.toLowerCase() === "rejected"
              ? application.status + " " + "❌"
              : application.status + " " + "🥳"}
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-center gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 lg:h-[75vh] overflow-scroll flex-1">
          <div className="flex flex-col sm:flex-row items-center mb-6">
            <Avatar className="mr-4 mb-4 text-2xl font-bold sm:mb-0 h-20 w-20">
              <AvatarImage alt="Applicant" src="/placeholder-user.jpg" />
              <AvatarFallback>{applicantFirstName[0] + applicantLastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{application.name}</h2>
              <p className="text-gray-500 text-xs">{jobTitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="">
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-gray-500 text-sm lowercase w-full">
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  {application.email}
                </p>
                <Link
                  className="flex flex-row items-center justify-between w-full text-sm lowercase"
                  href={
                    application.linkedin ??
                    `https://www.linkedin.com/search/results/people/?firstName=${applicantFirstName}%20&lastName=${applicantLastName}`
                  }
                  prefetch={false}
                  target="_blank"
                >
                  <Linkedin strokeWidth={1.25} className="w-4 h-4 inline-block mr-2" />
                  <p className="flex-1 text-gray-500 overflow-hidden text-ellipsis text-nowrap">
                    {application.linkedin ?? "https://www.linkedin.com/"}
                  </p>
                </Link>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-gray-500 text-sm w-full">
                  <Briefcase className="w-4 h-4 inline-block mr-2" />
                  {application.years_of_experience}+ years as a {jobTitle}
                </p>
                <p className="text-gray-500 text-sm w-full">
                  <Building className="w-4 h-4 inline-block mr-2" />
                  Worked at Acme Inc. for 3 years
                </p>
              </div>
            </div>
          </div>
          <Separator className="my-4 w-[20%]" />
          <div className="mt-8">
            <h3 className="mb-2 font-semibold">About</h3>
            <p className="text-gray-500 text-sm">
              {applicantFirstName} is a highly skilled {jobTitle} with a passion for building innovative and
              user-friendly applications. He has extensive experience in full-stack development, with a strong focus on
              JavaScript, React, and Node.js. {applicantFirstName} is a quick learner, a team player, and always strives
              to deliver high-quality work.
            </p>
          </div>
          {/* <Separator className="my-4" /> */}
          <div className="mt-8">
            <h3 className="mb-2 font-semibold">Cover Letter</h3>
            <p className="text-gray-500 text-sm">{application.cover_letter}</p>
          </div>
          {/* <Separator className="my-4" /> */}
          <div className="mt-8">
            <h3 className="mb-2 font-semibold">Additional Info</h3>
            <p className="text-gray-500 text-sm">{application.additional_info}</p>
          </div>
        </div>
        <div className="bg-white w-[475px] flex items-center justify-center h-full">
          <embed
            className="w-full h-auto rounded-lg object-cover"
            height={690}
            src={`${
              application.resume_uri
                ? application.resume_uri
                : "https://utfs.io/f/384427d0-c511-4592-8d0c-d37586a29e30-gygzsq.pdf"
            }`}
            style={{
              aspectRatio: "475/690",
              objectFit: "cover",
            }}
            width={475}
          />
        </div>
      </div>
    </div>
  );
}
