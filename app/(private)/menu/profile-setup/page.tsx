"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BuildingIcon, User2Icon } from "lucide-react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfileSetup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);

  // Use SWR to fetch user profile status
  const { data: profileStatus, error } = useSWR(
    "/api/user/profile-status",
    fetcher
  );

  // Redirect if user already has a type and profile
  useEffect(() => {
    if (profileStatus) {
      if (profileStatus.hasUserType && profileStatus.hasProfile) {
        router.push("/menu");
      } else if (profileStatus.hasUserType) {
        // User has type but no profile, redirect to the appropriate profile setup page
        router.push(
          profileStatus.userType === "startup"
            ? "/menu/startup-profile"
            : "/menu/individual-profile"
        );
      }
    }
  }, [profileStatus, router]);

  const handleProfileTypeSelection = async (type: "startup" | "individual") => {
    try {
      setIsLoading(true);
      setSelection(type);

      // Update user with the selected type using the API
      const response = await fetch("/api/user/update-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userType: type }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user type");
      }

      // Redirect to the appropriate profile creation page
      router.push(
        type === "startup"
          ? "/menu/startup-profile"
          : "/menu/individual-profile"
      );
    } catch (error) {
      console.error("Error setting profile type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking profile status
  if (!profileStatus && !error) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-12">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-4 w-80 mb-2" />
        <Skeleton className="h-4 w-72 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Startup card skeleton */}
          <div className="border-2 rounded-lg p-6">
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="h-4 w-48 mb-3" />
            <div className="space-y-2 mb-6 ml-5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-44" />
            </div>

            <Skeleton className="h-10 w-full mt-4" />
          </div>

          {/* Individual card skeleton */}
          <div className="border-2 rounded-lg p-6">
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>

            <Skeleton className="h-4 w-48 mb-3" />
            <div className="space-y-2 mb-6 ml-5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-44" />
            </div>

            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Select Your Profile Type</h1>
      <p className="text-muted-foreground mb-10 text-center">
        Choose the type of profile you want to create. This will determine your
        experience on the platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <Card
          className={`cursor-pointer border-2 hover:shadow-md transition-all ${
            selection === "startup" ? "border-primary" : ""
          }`}
          onClick={() => handleProfileTypeSelection("startup")}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <BuildingIcon size={24} />
              Startup
            </CardTitle>
            <CardDescription>
              Create a profile for your startup or company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">As a startup, you'll be able to:</p>
            <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
              <li>Post job openings</li>
              <li>Create company profile</li>
              <li>Host events</li>
              <li>Connect with individual talents</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleProfileTypeSelection("startup");
              }}
            >
              {isLoading && selection === "startup"
                ? "Setting up..."
                : "Select Startup Profile"}
            </Button>
          </CardFooter>
        </Card>

        <Card
          className={`cursor-pointer border-2 hover:shadow-md transition-all ${
            selection === "individual" ? "border-primary" : ""
          }`}
          onClick={() => handleProfileTypeSelection("individual")}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User2Icon size={24} />
              Individual
            </CardTitle>
            <CardDescription>
              Create a profile as an individual talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">As an individual, you'll be able to:</p>
            <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
              <li>Browse and apply for jobs</li>
              <li>Create your personal profile</li>
              <li>Register for events</li>
              <li>Connect with startups</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleProfileTypeSelection("individual");
              }}
            >
              {isLoading && selection === "individual"
                ? "Setting up..."
                : "Select Individual Profile"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
