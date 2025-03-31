"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  SettingsIcon,
  BriefcaseBusiness,
  UserCog,
  LogOutIcon,
  PaletteIcon,
  ChevronsUpDown,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  useProfile,
  useUserName,
  useUserProfilePicture,
} from "../../lib/hooks/use-profile-content";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeSwitcher } from "@/components/theme-switcher";
import LogoDark from "@/public/images/logo-dark.png";
import LogoLight from "@/public/images/logo-light.png";

import { useTheme } from "next-themes";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  role?: "individual" | "startup";
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/menu",
    icon: HomeIcon,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: BriefcaseBusiness,
    description: "Browse and apply for jobs",
  },
  {
    name: "My Applications",
    href: "/menu/applications",
    icon: UserCog,
    description: "Track your job applications",
    role: "individual",
  },
  {
    name: "Manage Jobs",
    href: "/menu/jobs",
    icon: UserCog,
    description: "Create and manage job postings",
    role: "startup",
  },
  {
    name: "Events",
    href: "/events",
    icon: CalendarDays,
    description: "Discover community events",
  },
  {
    name: "Settings",
    href: "/menu/settings",
    icon: SettingsIcon,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const { userType, isLoading, email } = useProfile();
  const { name: userName, isLoading: isNameLoading } = useUserName();
  const { profilePicture, isLoading: isProfileLoading } =
    useUserProfilePicture();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const renderNavItems = () => {
    if (isLoading) {
      return Array(5)
        .fill(0)
        .map((_, index) => <SidebarMenuSkeleton key={index} />);
    }

    return navItems
      .filter((item) => {
        if (!item.role) return true;
        return item.role === userType;
      })
      .map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={cn(
                "transition-all duration-200 rounded-md relative overflow-hidden",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-primary/10"
              )}
              tooltip={!isExpanded ? item.name : undefined}
            >
              <Link href={item.href}>
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                )}
                <Icon className={cn("h-4 w-4", isActive && "text-blue-500")} />
                <span className={cn(isActive && "text-primary")}>
                  {item.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      });
  };

  const initials = userName ? userName.substring(0, 2).toUpperCase() : "US";

  const renderUserProfile = () => {
    if (isLoading || isNameLoading || isProfileLoading) {
      return (
        <div className="flex items-center gap-3 p-2 cursor-pointer mx-2">
          <Avatar className="h-9 w-9 rounded-sm bg-blue-950/50 animate-pulse">
            <AvatarFallback className="rounded-sm bg-blue-950/50 text-blue-400/50">
              ...
            </AvatarFallback>
          </Avatar>

          {isExpanded && (
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col overflow-hidden min-w-0">
                <div className="h-4 w-20 bg-blue-950/20 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-32 bg-blue-950/20 rounded animate-pulse"></div>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/30" />
            </div>
          )}
        </div>
      );
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isExpanded ? (
            <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-sidebar-accent/10 rounded-lg transition-colors duration-200 mx-2">
              <Avatar className="h-9 w-9 rounded-sm bg-blue-950 text-blue-400">
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt={userName || "User"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover rounded-sm"
                  />
                ) : (
                  <AvatarFallback className="rounded-sm bg-blue-950 text-blue-400 font-medium">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-col overflow-hidden min-w-0">
                  <p className="text-sm font-medium leading-none capitalize">
                    {userName}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight mt-1">
                    {email}
                  </p>
                </div>

                <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground" />
              </div>
            </div>
          ) : (
            <Avatar className="cursor-pointer h-9 w-9 mx-auto my-2 rounded-lg bg-blue-950 text-blue-400">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={userName || "User"}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover rounded-sm"
                />
              ) : (
                <AvatarFallback className="rounded-sm bg-blue-950 text-blue-400 font-medium">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          )}
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          className="w-64 p-2 shadow-custom"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-sm bg-blue-950 text-blue-400">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={userName || "User"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover rounded-sm"
                />
              ) : (
                <AvatarFallback className="rounded-sm bg-blue-950 text-blue-400 font-medium">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center py-1.5 hover:bg-accent/10 hover:text-accent-foreground rounded-md px-2 transition-colors duration-200">
            <Link
              href="/menu/profile"
              className="flex items-center w-full cursor-pointer"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">Profile</span>
            </Link>
          </div>

          <div className="flex items-center justify-between py-1.5 px-2 hover:bg-accent/10 hover:text-accent-foreground rounded-md transition-colors duration-200">
            <div className="flex items-center">
              <PaletteIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">Theme</span>
            </div>
            <ThemeSwitcher />
          </div>

          <Separator className="my-2" />

          <form action={signOutAction} className="w-full">
            <Button
              type="submit"
              variant="ghost"
              className="flex items-center w-full justify-start font-normal text-current py-1.5 h-auto hover:bg-destructive/10 hover:text-destructive rounded-md px-2 transition-colors duration-200"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">Sign out</span>
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="shadow-custom bg-background/95 dark:bg-background/95"
    >
      <SidebarHeader className="flex flex-row items-center justify-between p-2">
        {isExpanded && (
          <div className="ml-2">
            {theme === "dark" && (
              <Image
                loading="eager"
                priority
                src={LogoLight}
                width={140}
                height={30}
                alt="logo"
              />
            )}
            {theme === "light" && (
              <Image
                loading="eager"
                priority
                src={LogoDark}
                width={140}
                height={30}
                alt="logo"
              />
            )}
          </div>
        )}
        <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent/10" />
      </SidebarHeader>

      <Separator />

      <SidebarContent className="p-2">
        <SidebarMenu>{renderNavItems()}</SidebarMenu>
      </SidebarContent>

      <Separator />

      <div className="mt-auto">
        <div className="flex flex-col gap-2 py-2">{renderUserProfile()}</div>
      </div>
    </Sidebar>
  );
}

export { SidebarProvider };
