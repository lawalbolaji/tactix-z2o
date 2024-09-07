"use client";

import { useState } from "react";

export function FileUploader() {
  const [resumeUri, setResumeUri] = useState("");

  return (
    <>
      <label htmlFor="resume" className="block text-sm font-medium leading-6 text-gray-900">
        CV / Resume
      </label>
      <input type="text" hidden aria-hidden name="resume" onChange={() => {}} value={resumeUri} />
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        {/* <UploadButton
                    endpoint="pdfUploader"
                    onClientUploadComplete={(res) => {
                        console.log("Files: ", res);
                        setResumeUri(res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                        console.error(`ERROR! ${error.message}`);
                    }}
                /> */}
        {/* TODO: implement proper upload button */}
        <input type="file" name="document" id="upload doc" />
      </div>
    </>
  );
}
