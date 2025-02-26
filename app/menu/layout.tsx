"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DashboardSidebar,
  SidebarProvider,
} from "@/components/dashboard/sidebar";
import { ProfileProvider } from "@/components/dashboard/profile-context";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isProfileSetup, setIsProfileSetup] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a reusable function to check profile status
  const checkProfileStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/user/me", {
        // Add cache: 'no-store' to prevent caching
        cache: "no-store",
        headers: {
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const profileSetup = Boolean(data.userType && data.hasProfile);
        setIsProfileSetup(profileSetup);
        return profileSetup;
      }
      return false;
    } catch (error) {
      console.error("Error checking profile status:", error);
      return false;
    }
  }, []);

  // Initial check
  useEffect(() => {
    async function initialCheck() {
      await checkProfileStatus();
      setIsLoading(false);
    }

    initialCheck();
  }, [checkProfileStatus]);

  // Poll for changes if profile is not set up
  useEffect(() => {
    if (isLoading || isProfileSetup) return;

    // Check every 3 seconds if the profile has been set up
    const intervalId = setInterval(async () => {
      const hasProfile = await checkProfileStatus();
      if (hasProfile) {
        clearInterval(intervalId);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isLoading, isProfileSetup, checkProfileStatus]);

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
      <ProfileProvider>
        <div className="min-h-screen w-full">
          <main className="p-6 w-full">{children}</main>
        </div>
      </ProfileProvider>
    );
  }

  // If profile is set up, show the layout with sidebar
  return (
    <ProfileProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <main className="flex-1 p-6 overflow-auto w-full">{children}</main>
        </div>
      </SidebarProvider>
    </ProfileProvider>
  );
}
