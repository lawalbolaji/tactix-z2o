"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Linkedin, Github } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { AUTH_SUCCESS_REDIRECT_URI } from "../../lib/constants";

export function SignIn() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div className="grid gap-4">
      {step === "signIn" ? (
        <>
          <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
          <Divider />
          <div className="grid grid-cols-2 gap-4">
            <SignInWithLinkedin />
            <SignInWithGitHub />
          </div>
        </>
      ) : (
        <>
          <p className="text-sm">A sign-in link has been sent to your email</p>
          <Button className="p-0 self-start" variant="link" onClick={() => setStep("signIn")}>
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">or continue with</span>
      </div>
    </div>
  );
}

function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("github", { redirectTo: "/onboarding" })}
    >
      <Github className="mr-2 h-5 w-5" /> GitHub
    </Button>
  );
}

function SignInWithLinkedin() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn("linkedin", { redirectTo: "/onboarding" })}
    >
      <Linkedin className="mr-2 h-5 w-5" /> Linkedin
    </Button>
  );
}

function SignInWithMagicLink({ handleLinkSent }: { handleLinkSent: () => void }) {
  const { signIn } = useAuthActions();
  const [requestPending, setRequestPending] = useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("redirectTo", AUTH_SUCCESS_REDIRECT_URI);
        setRequestPending(true);
        signIn("resend", formData)
          .then(handleLinkSent)
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setRequestPending(false);
          });
      }}
    >
      <div className="grid gap-2 my-4">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" placeholder="hey@tactix.com" required aria-required />
      </div>
      <SubmitButton pending={requestPending} />
    </form>
  );
}

function SubmitButton(props: { pending: boolean }) {
  return (
    <Button type="submit" className="w-full">
      {props.pending ? (
        <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750] mr-2" />
      ) : (
        <></>
      )}
      Sign in
    </Button>
  );
}
