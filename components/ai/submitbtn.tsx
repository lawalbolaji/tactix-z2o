"use client";

import { ShareIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm mt-[2%] mr-[1%]"
            type="submit"
            aria-disabled={pending}
        >
            {pending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750]" />
            ) : (
                <ShareIcon className="size-3.5" />
            )}
            Publish 🚀
        </Button>
    );
}
