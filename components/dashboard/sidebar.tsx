"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  CalendarIcon,
  SettingsIcon,
  MessageSquareIcon,
  LogOutIcon,
  MoreVertical,
  User2Icon,
  PaletteIcon,
  BriefcaseBusiness,
  UserCog,
  Contact,
} from "lucide-react";

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

import ClientUserInfo from "./client-user-info";

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

// Client component to fetch and display user info

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const { userType, isLoading } = useProfile();

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => {
    // If the item has no role restriction, show it to everyone
    if (!item.role) return true;
    // Otherwise, only show if the user's role matches
    return item.role === userType;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between border-b">
        {isExpanded && <h1 className="text-xl font-bold">SATAS</h1>}
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem
                key={item.href}
                className={!isExpanded ? "mx-auto" : ""}
              >
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center gap-3 w-full rounded-md p-3 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    !isExpanded && "justify-center"
                  )}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3",
                      !isExpanded && "justify-center p-0"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {isExpanded && (
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <ClientUserInfo isExpanded={isExpanded} />
      </SidebarFooter>
    </Sidebar>
  );
}

export { SidebarProvider };
