"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { ButtonHTMLAttributes, ClassAttributes, JSX, useState } from "react";
import { signUp } from "../../app/onboarding/action";

const initialState = {
  error: {
    fields: {
      company_url: [],
      company_name: [],
    },
    type: "VALIDATION_ERROR",
  },
};

export function CreateAccount() {
  const [state, authAction] = useFormState(signUp, initialState);

  return (
    <form className="flex flex-col items-center justify-center gap-5" action={authAction}>
      <div className="w-full">
        <label htmlFor="company_name" className="block mb-2 text-sm font-medium text-gray-900">
          Company Name
        </label>
        <input
          type="text"
          name="company_name"
          id="company_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="Tactix"
          required
          aria-required
        />
        {state?.error?.fields?.company_name ? (
          <div className="text-red-500 text-xs mt-2">{state.error.fields.company_name[0]}</div>
        ) : (
          <></>
        )}
      </div>

      <div className="w-full">
        <label htmlFor="company_name" className="block mb-2 text-sm font-medium text-gray-900">
          Company Url
        </label>
        <input
          type="text"
          name="company_url"
          id="company_url"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          placeholder="https://www.tactix.com/about"
          required
          aria-required
        />
        {state?.error?.fields?.company_url ? (
          <div className="text-red-500 text-xs mt-2">{state.error.fields.company_url[0]}</div>
        ) : (
          <></>
        )}
      </div>

      <div className="flex items-start w-full">
        <div className="flex items-center h-5">
          <input
            id="terms"
            aria-describedby="terms"
            type="checkbox"
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
            required
            aria-required
          />
        </div>
        <div className="ml-3 text-sm w-full">
          <label htmlFor="terms" className="font-light text-gray-500 ">
            I accept the{" "}
            <a className="font-medium text-primary-600 hover:underline" href="#">
              Terms and Conditions
            </a>
          </label>
        </div>
      </div>
      <CreateAccountButton />
    </form>
  );
}

function CreateAccountButton(
  props: JSX.IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      className="w-full flex items-center justify-center disabled:bg-slate-300 disabled:opacity-40 disabled:text-black text-white bg-[hsl(222.2,47.4%,11.2%)] hover:bg-opacity-80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      {pending ? (
        <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750] mr-4" />
      ) : (
        <></>
      )}
      Create an account
    </button>
  );
}
