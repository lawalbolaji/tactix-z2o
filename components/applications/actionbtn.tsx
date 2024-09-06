"use client";

import { ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

type TriggerBtnProps = JSX.IntrinsicAttributes & ButtonHTMLAttributes<HTMLButtonElement>;

export function TriggerApplicationActionBtn(props: TriggerBtnProps) {
    const { pending } = useFormStatus();
    const { children, ...rest } = props;

    return (
        <Button size="sm" variant="outline" {...rest}>
            {pending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-[#d099d750]" />
            ) : (
                children
            )}
        </Button>
    );
}
