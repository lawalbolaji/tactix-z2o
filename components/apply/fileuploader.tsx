"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function FileUploader() {
  const [resumeUri, setResumeUri] = useState("");
  const generateUploadUrl = useMutation(api.applications.generateUploadUrl);
  const [remoteRequestStatus, setRemoteRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  return (
    <>
      <label htmlFor="resume" className="block text-sm font-medium leading-6 text-gray-900">
        CV / Resume
      </label>
      <input type="text" hidden aria-hidden name="resume" onChange={() => {}} value={resumeUri} />
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <input
          type="file"
          name="document"
          id="upload doc"
          accept=".pdf"
          aria-disabled={remoteRequestStatus === "loading"}
          disabled={remoteRequestStatus === "loading"}
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            setRemoteRequestStatus("loading");
            const resume = e.currentTarget.files![0];
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
              method: "POST",
              headers: { "Content-Type": resume.type },
              body: resume,
            });
            const { storageId } = await result.json();
            setRemoteRequestStatus("success");
            setResumeUri(storageId);
          }}
        />
        {/* loader here */}
      </div>
    </>
  );
}
