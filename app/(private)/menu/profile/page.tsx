"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { IndividualProfile } from "@/components/profile/individual-profile";
import { StartupProfile } from "@/components/profile/startup-profile";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export default function ProfilePage() {
  const router = useRouter();
  const {
    userType,
    userId,
    isLoading: userIsLoading,
    refreshProfileStatus,
  } = useProfile();

  // Force revalidation when the component mounts to ensure fresh data after edits
  useEffect(() => {
    refreshProfileStatus();
    mutate("/api/profile/individual");
    mutate("/api/profile/startup");
  }, [refreshProfileStatus]);

  // Use SWR to fetch profile data based on user type
  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useSWR(
    // Only fetch profile data when we have user data
    userId && userType
      ? userType === "individual"
        ? "/api/profile/individual"
        : "/api/profile/startup"
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
    }
  );

  // Handle loading
  if (userIsLoading || profileIsLoading) {
    return <ProfileSkeleton />;
  }

  // Handle errors
  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">
          {profileError?.message || "An error occurred"}
        </p>
      </div>
    );
  }

  // Handle user type rendering
  if (userType === "individual") {
    return <IndividualProfile profile={profile} />;
  } else if (userType === "startup") {
    return <StartupProfile profile={profile} />;
  }

  // Default fallback
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Unable to determine user type.</p>
    </div>
  );
}
