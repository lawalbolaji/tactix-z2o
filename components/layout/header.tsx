import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { Rabbit } from "lucide-react";

export default function Header(props: { username: string | undefined }) {
    return (
        <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
            <nav className="flex h-14 items-center justify-between px-4">
                <div className="hidden lg:block">
                    <Link href={"/dashboard"}>
                        <Rabbit className="h-6 w-6 mr-2" />
                    </Link>
                </div>
                <div className="hidden lg:block">
                    <div className="flex items-center justify-center font-bold tracking-widest text-lg">Tactix</div>
                </div>
                <div className={cn("block lg:!hidden")}>
                    <MobileSidebar />
                </div>

                <div className="flex items-center gap-2">
                    <UserNav username={props.username} />
                    {/* <ThemeToggle /> */}
                </div>
            </nav>
        </div>
    );
}
