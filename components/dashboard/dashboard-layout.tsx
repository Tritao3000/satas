"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { BreadcrumbProvider } from "@/lib/contexts/breadcrumb-context";
import { BreadcrumbNavigation } from "@/components/navigation/breadcrumbs";

function MobileTrigger() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 p-4 bg-background/80 backdrop-blur-sm border-b md:hidden">
      <SidebarTrigger className="text-sidebar-foreground" />
      <h1 className="text-lg font-bold">SATAS</h1>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isProfileSetup, isLoading } = useProfile();

  return (
    <SidebarProvider>
      <BreadcrumbProvider>
        <div className="flex min-h-screen w-full">
          {(isProfileSetup || isLoading) && <DashboardSidebar />}

          <MobileTrigger />

          <main className="flex-1 overflow-auto p-6 pt-20 md:pt-6 md:p-8 max-w-7xl mx-auto">
            <BreadcrumbNavigation />
            {children}
          </main>
        </div>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}
