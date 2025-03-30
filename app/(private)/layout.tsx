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

function MainContent({ children }: { children: React.ReactNode }) {
  return <main className="flex-1 p-8 overflow-auto w-full">{children}</main>;
}

function MenuLayoutContent({ children }: { children: React.ReactNode }) {
  const { isProfileSetup, isLoading } = useProfile();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {(isProfileSetup || isLoading) && <DashboardSidebar />}
        <SidebarTrigger className="absolute top-4 left-4 md:hidden" />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}

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
