"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Linkedin, Github } from "lucide-react";

import { signIn } from "@/app/action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

const initialState = {
  error: {
    fields: {
      email: [],
      password: [],
    },
    type: "VALIDATION_ERROR",
  },
};

export function SignIn() {
  const [state, authAction] = useFormState(signIn, initialState);

  return (
    <form action={authAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="hey@tactix.com" required aria-required />
          {state.error.type === "VALIDATION_ERROR" && state.error.fields?.email?.[0] ? (
            <div className="text-xs text-red-500">{state.error.fields?.email?.[0]}</div>
          ) : (
            <></>
          )}
        </div>

        <SubmitButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SignInWithLinkedin />
          <SignInWithGitHub />
        </div>
      </div>
    </form>
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full">
      {pending ? (
        <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750] mr-2" />
      ) : (
        <></>
      )}
      Sign in
    </Button>
  );
}
