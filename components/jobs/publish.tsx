"use client";

import { Rss } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type remoteRequestStatus = "idle" | "loading" | "success" | "error";

export function PublishJobButton(props: { jobId: string; is_published: boolean }) {
    /* call server action to update stuff */
    const [remoteRequestStatus, setRemoteRequestStatus] = useState<remoteRequestStatus>("idle");

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-900"
                        aria-disabled={remoteRequestStatus === "loading" || props.is_published}
                        disabled={remoteRequestStatus === "loading" || props.is_published}
                        onClick={async () => {
                            setRemoteRequestStatus("loading");

                            try {
                                const response = await fetch(`/api/jobs/${props.jobId}`, {
                                    method: "POST",
                                    cache: "no-cache",
                                    body: JSON.stringify({ op: "PUBLISH" }),
                                });

                                if (response.ok) {
                                    setRemoteRequestStatus("success");

                                    /* refresh page */
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
                                <Rss className="w-5 h-5" />
                                <span className="sr-only">Publish</span>
                            </>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Publish job</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
