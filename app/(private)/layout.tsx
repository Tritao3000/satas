"use client";

import {
  DashboardSidebar,
  SidebarProvider,
} from "@/components/dashboard/sidebar";
import {
  ProfileProvider,
  useProfile,
} from "@/components/dashboard/profile-context";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Create a wrapper component that uses the ProfileContext
function MenuLayoutContent({ children }: { children: React.ReactNode }) {
  const { isProfileSetup, isLoading } = useProfile();

  // Show loading state or just the content while checking profile status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
      </div>
    );
  }

  // If profile is not set up, only show the content without the sidebar
  if (!isProfileSetup) {
    return (
      <div className="min-h-screen w-full">
        <main className="p-6 w-full">{children}</main>
      </div>
    );
  }

  // If profile is set up, show the layout with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarTrigger className="absolute top-4 left-4 md:hidden" />
        <main className="flex-1 p-6 overflow-auto w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}

// Main layout component that provides the ProfileContext
export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <MenuLayoutContent>{children}</MenuLayoutContent>
    </ProfileProvider>
  );
}
