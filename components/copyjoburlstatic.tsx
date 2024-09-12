"use client"

import { DropdownMenuItem } from "./ui/dropdown-menu";

export function CopyJobUrlStatic(props: { jobId: number }) {
    return (
        <DropdownMenuItem
            onClick={() => {
                const rootUrl = new URL(window.location.href).host;
                const link = `${rootUrl}/jobs/${props.jobId}/view`;
                window.navigator.clipboard.writeText(link);
            }}
        >
            Copy job url
        </DropdownMenuItem>
    );
}
