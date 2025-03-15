"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from "swr";
import {
  ApplicationCard,
  JobApplication,
} from "@/components/applications/application-card";
import { ApplicationCardSkeleton } from "@/components/applications/application-card-skeleton";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return res.json();
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch user data using SWR
  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR("/api/user/me", fetcher);

  // Fetch applications data based on user type
  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsIsLoading,
  } = useSWR(
    () =>
      userData?.userType === "individual" ? "/api/jobs/applications" : null,
    fetcher
  );

  const isLoading = userIsLoading || applicationsIsLoading;
  const error = userError || applicationsError;

  // Handle loading state
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="text-muted-foreground text-sm">
              Manage your job applications
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ApplicationCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="text-muted-foreground text-sm">
              Manage your job applications
            </p>
          </div>
        </div>
        <div className="text-center py-12 text-destructive">
          Error loading applications. Please try again later.
        </div>
      </div>
    );
  }

  // Handle user type check
  if (userData?.userType !== "individual") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="text-muted-foreground text-sm">
              Manage your job applications
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            This page is only available for individual users.
          </p>
          <Button asChild className="mt-4">
            <Link href="/menu">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group applications by status
  const pendingApplications = applications.filter(
    (app: JobApplication) => app.status === "pending"
  );
  const acceptedApplications = applications.filter(
    (app: JobApplication) => app.status === "accepted"
  );
  const rejectedApplications = applications.filter(
    (app: JobApplication) => app.status === "rejected"
  );

  // Determine which applications to display based on active tab
  const applicationsToDisplay =
    activeTab === "all"
      ? applications
      : activeTab === "pending"
        ? pendingApplications
        : activeTab === "accepted"
          ? acceptedApplications
          : rejectedApplications;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="text-muted-foreground text-sm">
            Manage your job applications
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
      <Tabs
        defaultValue="all"
        className="w-full mb-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {applicationsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {applicationsToDisplay.map((application: JobApplication) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-lg bg-muted/50 mt-6">
            <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />
            <h3 className="font-medium text-lg mt-2">No applications found</h3>
            <p className="text-muted-foreground text-sm">
              You haven't applied to any jobs in this category yet.
            </p>
          </div>
        )}
      </Tabs>
    </div>
  );
}
