"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { AUTH_FAIL_REDIRECT_URI } from "../lib/constants";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const errorMessage = (error as Error).message.toLowerCase();
  const notLoggedIn = errorMessage.includes("not signed in");
  const tokenExpired = errorMessage.includes("expired");
  if (notLoggedIn || tokenExpired) return redirect(AUTH_FAIL_REDIRECT_URI);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
