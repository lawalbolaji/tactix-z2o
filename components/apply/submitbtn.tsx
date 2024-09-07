"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <div className="mt-6 flex items-center justify-center gap-x-6">
            <button
                type="submit"
                aria-disabled={pending}
                disabled={pending}
                className="rounded-md bg-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                {pending ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750]" />
                ) : (
                    "Submit Application"
                )}
            </button>
        </div>
    );
}
