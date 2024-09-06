"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type remoteRequestStatus = "idle" | "loading" | "success" | "error";

export function DeleteJobButton(props: { jobId: string }) {
    /* call server action to update stuff */
    const [remoteRequestStatus, setRemoteRequestStatus] = useState<remoteRequestStatus>("idle");

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-400"
                        aria-disabled={remoteRequestStatus === "loading"}
                        disabled={remoteRequestStatus === "loading"}
                        onClick={async () => {
                            setRemoteRequestStatus("loading");

                            try {
                                const response = await fetch(`/api/jobs/${props.jobId}`, {
                                    method: "POST",
                                    cache: "no-cache",
                                    body: JSON.stringify({ op: "SOFT_DELETE" }),
                                    next: { revalidate: 0 },
                                });

                                if (response.ok) {
                                    setRemoteRequestStatus("success");

                                    /* refresh page - https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript#:~:text=page%20for%20more-,information,-.*/
                                    window.location.reload();
                                    return false;
                                }

                                const responseAsJson = await response.json();
                                setRemoteRequestStatus("error");

                                /* DEBUGGING */
                                console.log(responseAsJson);
                            } catch (error) {
                                // fetch request is basically not working - network issues?
                                console.error(error);
                                setRemoteRequestStatus("error");
                            }
                        }}
                    >
                        {remoteRequestStatus === "loading" ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750]" />
                        ) : (
                            <>
                                <TrashIcon className="w-5 h-5" />
                                <span className="sr-only">Publish</span>
                            </>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Delete job</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
