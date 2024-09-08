"use client";

import { CheckCheck, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const URL_COPY_TIMEOUT = 5_000; // 5s

export function CopyJobUrlButton(props: { jobId: string }) {
    const [urlCopied, setUrlCopied] = useState(false);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-900"
                        onClick={() => {
                            /* generate application link and add to dashboard */
                            const rootUrl = new URL(window.location.href).hostname;
                            const link = `${rootUrl}/jobs/${props.jobId}/view`;
                            window.navigator.clipboard.writeText(link);
                            setUrlCopied(true);
                            setTimeout(() => {
                                setUrlCopied(false);
                            }, URL_COPY_TIMEOUT);
                        }}
                    >
                        {urlCopied ? (
                            <>
                                <CheckCheck className="w-5 h-5 text-green-400" />
                                <span className="sr-only">Url copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                <span className="sr-only">Copy job url</span>
                            </>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Copy job url</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
