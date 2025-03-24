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

function MenuLayoutContent({ children }: { children: React.ReactNode }) {
  const profile = useProfile();
  const { isProfileSetup, isLoading } = profile;

  // If profile is not set up, only show the content without the sidebar
  if (!isProfileSetup) {
    return (
      <div className="min-h-screen w-full">
        <main className="p-8 w-full max-w-5xl mx-auto">{children}</main>
      </div>
    );
  }

  // If profile is set up, show the layout with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarTrigger className="absolute top-4 left-4 md:hidden" />
        <main className="flex-1 p-8 overflow-auto w-full max-w-5xl mx-auto">
          {children}
        </main>
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
