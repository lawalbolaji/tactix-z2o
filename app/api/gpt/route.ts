import { NextResponse } from "next/server";
// import OpenAI from "openai";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  const payload = await request.json();
  const metadata = await fetchQuery(api.users.getLoggedInUserMetadata, {}, { token: convexAuthNextjsToken() });
  if (!metadata) {
    return NextResponse.json({ error: "user not signed in" }, { status: 401 });
  }

  const companyName = metadata.company;

  // call gpt 4o
  const completions = await streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "user",
        content: `
                    Give the following details, generate a job post:

                    =======
                    Job title: ${payload.title}
                    Location: ${payload.location}
                    Experience Level: ${payload.experienceLevel}
                    Skills and Competencies: ${payload.qualifications}
                    Employment Type: ${payload.employmentType}
                    Salary: ${payload.salary}
                    Company Name: ${companyName}
                    =======
 
                    You job post should include all the following sections:
                    - High level summary
                    - Brief description about company: About US (mission, vision, achievements so far), you can use a generic template for this
                    - What we are looking for (this should cater for Qualifications and experience): DO NOT CREATE A SEPARATE SECTION FOR EXPERIENCE
                    - What we offer: this should include details about what prospective candidates get by joining the company's mission
                    - Legalese

                    The job description should be written in clear, concise english that is non-patronizing.

                    Make sure to only return the job description as a markdown formatted string and nothing else

                    No need to include the markdown annotation string
                    `,
      },
      { role: "user", content: "" },
    ],
  });

  return completions.toTextStreamResponse();
}
