"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { AUTH_FAIL_REDIRECT_URI } from "../lib/constants";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if ((error as Error).message.toLowerCase().includes("not signed in")) return redirect(AUTH_FAIL_REDIRECT_URI);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
