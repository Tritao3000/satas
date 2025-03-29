"use client";

import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Use SWR to fetch user profile status
  const { data: profileStatus, error: profileStatusError } = useSWR(
    "/api/user/profile-status",
    fetcher
  );

  // Use SWR to fetch appropriate profile based on user type
  const { data: profile, error: profileError } = useSWR(
    () =>
      profileStatus?.userType ? `/api/profile/${profileStatus.userType}` : null,
    fetcher
  );

  // Handle redirects and loading state
  useEffect(() => {
    if (profileStatusError) {
      // If there's an authentication error, redirect to sign-in
      router.push("/sign-in");
      return;
    }

    if (profileStatus) {
      // If user doesn't have a user type, redirect to profile setup
      if (!profileStatus.hasUserType) {
        router.push("/menu/profile-setup");
        return;
      }

      // If user has a type but no profile, redirect to profile creation
      if (!profileStatus.hasProfile) {
        router.push(
          profileStatus.userType === "startup"
            ? "/menu/startup-profile"
            : "/menu/individual-profile"
        );
        return;
      }

      // We have all the data we need
      setIsLoading(false);
    }
  }, [profileStatus, profileStatusError, router]);

  if (isLoading || !profileStatus || !profile) {
    return (
      <div className="p-8 w-full max-w-5xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userType = profileStatus.userType;

  return (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Welcome to your {userType} dashboard
          </p>
        </div>
        <div className="bg-accent text-xs p-2 px-4 rounded-md text-foreground flex gap-2 items-center">
          <InfoIcon size="14" strokeWidth={2} />
          You are logged in as a {userType} user
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No one has viewed your profile yet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {userType === "startup" ? "Applications" : "Jobs Applied"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {userType === "startup"
                ? "No applications to your posts yet"
                : "You haven't applied to any jobs yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {userType === "startup" ? "Events Hosted" : "Events Joined"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {userType === "startup"
                ? "You haven't hosted any events yet"
                : "You haven't joined any events yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 space-y-4">
        {userType === "startup" ? (
          <>
            <h2 className="text-xl font-semibold">Startup Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Posted Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You haven't posted any jobs yet.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You haven't created any events yet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Individual Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You haven't applied to any jobs yet.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Registered Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You haven't registered for any events yet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
