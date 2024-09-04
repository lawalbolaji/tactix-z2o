"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// prettier-ignore
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";
import Link from "next/link";

/* profileImageUri, username, email,  */
export function UserNav(props: { username: string | undefined }) {
  const firstNameInitial =
    props.username?.split(" ")[0]?.[0] ?? "R"; /* default user is rasheed to accommodate some of the old staging data */
  const lastNameInitial = props.username?.split(" ")[1]?.[0] ?? "L";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://placehold.co/32x32/CAB26D/white?text=${firstNameInitial}${lastNameInitial}`}
              alt={"Rasheed"}
            />
            <AvatarFallback>{""}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{"Rasheed"}</p>
            <p className="text-xs leading-none text-muted-foreground">{"rasheed@tactix.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Dashboard
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Jobs
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <Button className="flex-1" variant="outline" type="button" onClick={() => void signOut()}>
      <LogOut className="mr-2 h-4 w-4" /> Sign Out
    </Button>
  );
}
