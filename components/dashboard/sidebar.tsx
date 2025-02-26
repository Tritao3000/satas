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
} from "lucide-react";

import { cn } from "@/lib/utils";

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
// Navigation items for the sidebar
const navItems = [
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
    href: "/menu/jobs",
    icon: BriefcaseIcon,
  },
  {
    name: "Events",
    href: "/menu/events",
    icon: CalendarIcon,
  },
  {
    name: "Messages",
    href: "/menu/messages",
    icon: MessageSquareIcon,
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between border-b">
        {isExpanded && <h1 className="text-xl font-bold">SATAS</h1>}
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => {
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
                    {isExpanded && <span>{item.name}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t ">
        <ClientUserInfo isExpanded={isExpanded} />
      </SidebarFooter>
    </Sidebar>
  );
}

export { SidebarProvider };
