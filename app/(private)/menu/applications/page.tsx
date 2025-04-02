"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Search, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useSWR from "swr";
import {
  ApplicationCard,
  JobApplication,
} from "@/components/applications/application-card";
import { ApplicationCardSkeleton } from "@/components/applications/application-card-skeleton";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { userId, userType, isLoading: isProfileLoading } = useProfile();

  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsIsLoading,
    mutate,
  } = useSWR(
    () => (userType === "individual" ? "/api/jobs/applications" : null),
    fetcher
  );

  const isLoading = isProfileLoading || applicationsIsLoading;
  const error = applicationsError;

  const HeaderSection = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage your job applications
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild className="gap-2" size="sm">
          <Link href="/jobs">
            <Search className="h-4 w-4" />
            <span>Browse Jobs</span>
          </Link>
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <HeaderSection />
        <Card className="p-4 mb-6">
          <div className="flex justify-between items-center animate-pulse">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-8 w-48 bg-muted rounded"></div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ApplicationCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <HeaderSection />
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading your applications. Please try refreshing
            the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (userType !== "individual") {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <HeaderSection />
        <Card className="p-8 text-center">
          <BriefcaseBusiness className="mx-auto size-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            This page is only available for individual user accounts. Please
            return to the dashboard.
          </p>
          <Button asChild>
            <Link href="/menu">Go to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const pendingApplications = applications.filter(
    (app: JobApplication) => app.status === "pending"
  );
  const acceptedApplications = applications.filter(
    (app: JobApplication) => app.status === "accepted"
  );
  const rejectedApplications = applications.filter(
    (app: JobApplication) => app.status === "rejected"
  );

  const filterApplications = (apps: JobApplication[]) => {
    if (!searchQuery.trim()) return apps;

    return apps.filter((app) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        app.job?.title?.toLowerCase().includes(searchLower) ||
        app.startup?.name?.toLowerCase().includes(searchLower) ||
        app.job?.location?.toLowerCase().includes(searchLower) ||
        app.job?.type?.toLowerCase().includes(searchLower)
      );
    });
  };

  const applicationsToDisplay = filterApplications(
    activeTab === "all"
      ? applications
      : activeTab === "pending"
        ? pendingApplications
        : activeTab === "accepted"
          ? acceptedApplications
          : rejectedApplications
  );

  const tabCounts = {
    all: applications.length,
    pending: pendingApplications.length,
    accepted: acceptedApplications.length,
    rejected: rejectedApplications.length,
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <HeaderSection />

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="all" className="relative">
            All
            <Badge variant="secondary" className="ml-2">
              {tabCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge variant="secondary" className="ml-2">
              {tabCounts.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="relative">
            Accepted
            <Badge variant="secondary" className="ml-2">
              {tabCounts.accepted}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
            <Badge variant="secondary" className="ml-2">
              {tabCounts.rejected}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {applicationsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applicationsToDisplay.map((application: JobApplication) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed">
              <BriefcaseBusiness className="mx-auto size-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-xl mb-2">
                No applications found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchQuery
                  ? "No applications match your search criteria. Try adjusting your search or filters."
                  : activeTab === "all"
                    ? "You haven't applied to any jobs yet. Start your job search now!"
                    : `You don't have any ${activeTab} applications at the moment.`}
              </p>
              <Button asChild>
                <Link href="/jobs">Browse Available Jobs</Link>
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
