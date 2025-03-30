"use client";

import { ProfileProvider } from "@/lib/hooks/use-profile-content";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ProfileProvider>
  );
}
