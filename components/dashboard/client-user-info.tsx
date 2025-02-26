import React from "react";
import Link from "next/link";
import { LogOutIcon, MoreVertical, User2Icon, PaletteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/components/dashboard/profile-context";

export default function ClientUserInfo({
  isExpanded,
}: {
  isExpanded: boolean;
}) {
  // Get all user info from the profile context
  const { userType, isLoading, email } = useProfile();

  // Show loading state if data is still loading or email is not available
  if (isLoading || !email) {
    return (
      <div className="flex items-center gap-3 animate-pulse p-4">
        <div className="h-10 w-10 rounded-full bg-sidebar-accent" />
        {isExpanded && (
          <div className="space-y-2 flex-1">
            <div className="h-3 w-24 bg-sidebar-accent rounded" />
            <div className="h-2 w-32 bg-sidebar-accent rounded" />
          </div>
        )}
      </div>
    );
  }

  const initials = email.split("@")[0].substring(0, 2).toUpperCase();
  const username = email.split("@")[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isExpanded ? (
          <div className="flex items-center gap-3 p-3 cursor-pointer bg-sidebar-accent/20 hover:bg-sidebar-accent/30 transition-colors rounded-md">
            <Avatar className="h-10 w-10 border border-sidebar-border ring-1 ring-sidebar-accent/50">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <p className="text-sm font-semibold leading-none truncate">
                {username}
              </p>
              <p className="text-xs text-sidebar-foreground/60 leading-tight truncate">
                {email}
              </p>
              {userType && (
                <div className="flex items-center mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-sidebar-accent rounded-sm capitalize text-sidebar-accent-foreground/80">
                    {userType}
                  </span>
                </div>
              )}
            </div>

            <MoreVertical className="h-4 w-4 text-sidebar-foreground/60" />
          </div>
        ) : (
          <Avatar className="h-8 w-8 border border-sidebar-border ring-1 ring-sidebar-accent/50 cursor-pointer">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/menu/profile" className="cursor-pointer">
            <User2Icon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PaletteIcon className="mr-2 h-4 w-4" />
          <span>Theme</span>
          <div className="ml-auto">
            <ThemeSwitcher />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="text-destructive focus:text-destructive"
        >
          <form action={signOutAction} className="w-full">
            <Button
              type="submit"
              variant="ghost"
              className="flex items-center p-0 h-auto w-full justify-start font-normal text-current"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
