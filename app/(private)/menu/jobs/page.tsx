"use client";

import { useEffect, useState } from "react";
import { useJobs } from "@/lib/hooks/use-jobs";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/job-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusIcon, Loader2, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { JobsPageSkeleton } from "@/components/jobs/jobs-page-skeleton";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";

export default function JobsManagementPage() {
  const router = useRouter();
  const { userType, isLoading: isProfileLoading, userId } = useProfile();
  const {
    jobs,
    isLoading: isJobsLoading,
    isError,
    mutate,
  } = useJobs(userId || undefined);

  // Redirect if not a startup user
  useEffect(() => {
    if (!isProfileLoading && userType !== "startup") {
      toast("Only startups can access this page");
      router.push("/menu");
    }
  }, [userType, isProfileLoading, router]);

  const handleDeleteJob = () => {
    mutate();
  };

  const isLoading = isProfileLoading || isJobsLoading;

  if (isLoading || userType !== "startup") {
    return <JobsPageSkeleton />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Job Listings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your startup's job postings
          </p>
        </div>
        <Button asChild>
          <Link href="/menu/jobs/create">
            <PlusIcon className="h-4 w-4" />
            Create Job
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="all">All Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isJobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center p-8 text-destructive">
              Failed to load jobs. Please try again.
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  allowEdit={true}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-muted/50">
              <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />
              <h3 className="font-medium text-lg  mt-2">No jobs found</h3>
              <p className="text-muted-foreground text-sm">
                You haven't posted any jobs yet
              </p>

              <Button className="mt-4" asChild>
                <Link href="/menu/jobs/create">Post Your First Job</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {isJobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center p-8 text-destructive">
              Failed to load jobs. Please try again.
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  allowEdit={true}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-muted/50">
              <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />
              <h3 className="font-medium text-lg  mt-2">No jobs found</h3>
              <p className="text-muted-foreground text-sm">
                You haven't posted any jobs yet
              </p>

              <Button className="mt-4" asChild>
                <Link href="/menu/jobs/create">Post Your First Job</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
