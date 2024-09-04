"use client";

import React, { useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";

type SidebarProps = {
    className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
    const { isMinimized, toggle } = useSidebar();
    const [status, setStatus] = useState(false);

    const handleToggle = () => {
        setStatus(true);
        toggle();
    };
    return (
        <nav
            className={cn(
                `relative hidden h-screen flex-none border-r pt-16 md:block`,
                status && "duration-500",
                !isMinimized ? "w-72" : "w-[72px]",
                className
            )}
            onMouseEnter={handleToggle}
            onMouseLeave={handleToggle}
        >
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mt-3 space-y-1">
                        <DashboardNav items={navItems} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
