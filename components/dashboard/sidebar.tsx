"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  SettingsIcon,
  BriefcaseBusiness,
  UserCog,
  Contact,
  LogOutIcon,
  PaletteIcon,
  ChevronsUpDown,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useProfile } from "./profile-context";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeSwitcher } from "@/components/theme-switcher";
import LogoDark from "@/public/images/logo-dark.png";
import LogoLight from "@/public/images/logo-light.png";

import { useTheme } from "next-themes";

// Define the type for navigation items
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  role?: "individual" | "startup";
}

// Navigation items for the sidebar
const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/menu",
    icon: HomeIcon,
  },
  {
    name: "Profile",
    href: "/menu/profile",
    icon: UserIcon,
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
    icon: CalendarIcon,
    description: "Browse upcoming events",
  },
  {
    name: "My Events",
    href: "/menu/my-events",
    icon: Contact,
    description: "View events you're registered for",
    role: "individual",
  },
  {
    name: "Manage Events",
    href: "/menu/events",
    icon: Contact,
    description: "Create and manage your events",
    role: "startup",
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
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // If the item has no role restriction, show it to everyone
    if (!item.role) return true;
    // Otherwise, only show if the user's role matches
    return item.role === userType;
  });

  // Generate user initials and username
  const initials = email
    ? email.split("@")[0].substring(0, 2).toUpperCase()
    : "US";
  const username = email ? email.split("@")[0] : "User";

  // User profile loading state
  const renderUserProfileLoading = () => (
    <div className="flex items-center gap-3 animate-pulse p-4">
      <div className="h-10 w-10 rounded-sm bg-gray-800" />
      {isExpanded && (
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-gray-800 rounded" />
          <div className="h-2 w-32 bg-gray-700 rounded" />
        </div>
      )}
    </div>
  );

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
                src={LogoLight}
                width={140}
                height={30}
                alt="logo"
              />
            )}
            {theme === "light" && (
              <Image
                loading="eager"
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
        <SidebarMenu>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                  )}
                  tooltip={!isExpanded ? item.name : undefined}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <Separator />

      <div className="mt-auto">
        <div className="flex flex-col gap-2 py-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              {isExpanded ? (
                <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-sidebar-accent/10 rounded-lg transition-colors duration-200 mx-2">
                  <Avatar className="h-9 w-9 rounded-sm bg-blue-950 text-blue-400">
                    <AvatarFallback className="rounded-sm bg-blue-950 text-blue-400 font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col overflow-hidden min-w-0">
                      <p className="text-sm font-medium leading-none capitalize">
                        {username}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight truncate mt-1">
                        {email}
                      </p>
                    </div>

                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <Avatar className="cursor-pointer h-9 w-9 mx-auto my-2 rounded-lg bg-blue-950 text-blue-400">
                  <AvatarFallback className="rounded-sm bg-blue-950 text-blue-400 font-medium">
                    {initials}
                  </AvatarFallback>
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
                  <AvatarFallback className="rounded-sm bg-blue-950 text-blue-400 font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium capitalize">{username}</p>
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
                  <span className="text-sm">Logout</span>
                </Button>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Sidebar>
  );
}

export { SidebarProvider };
