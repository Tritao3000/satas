"use client";

import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="flex justify-center items-center h-full min-h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded mb-2"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const userType = profileStatus.userType;

  return (
    <div className="flex-1 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
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

      <div className="mt-8 space-y-6">
        {userType === "startup" ? (
          <>
            <h2 className="text-2xl font-bold">Startup Dashboard</h2>
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
            <h2 className="text-2xl font-bold">Individual Dashboard</h2>
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
