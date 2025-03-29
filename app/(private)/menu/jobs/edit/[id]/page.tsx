"use client";

import { use, useEffect, useState } from "react";
import { useJob } from "@/lib/hooks/use-jobs";
import { JobForm } from "@/components/jobs/job-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfile } from "@/components/dashboard/profile-context";

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const jobId = params instanceof Promise ? use(params).id : params.id;
  const router = useRouter();
  const { job, isLoading: isJobLoading, isError } = useJob(jobId);
  const { userId, userType, isLoading: isProfileLoading } = useProfile();
  const isCheckingAuth = isProfileLoading;

  // Check if user type is valid for this page
  useEffect(() => {
    if (!isProfileLoading && userType !== "startup") {
      toast("Only startups can edit job listings");
      router.push("/menu");
    }
  }, [userType, isProfileLoading, router]);

  // Check job ownership once data is loaded
  useEffect(() => {
    if (!isJobLoading && job && userId && job.startupId !== userId) {
      toast("You don't have permission to edit this job");
      router.push("/menu/jobs");
    }
  }, [isJobLoading, job, userId, router]);

  if (isCheckingAuth || isJobLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          Edit Job Listing
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Edit Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="text-center p-8 text-destructive">
          Failed to load job information. Please try again.
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div>
        <div className="text-center p-8">Job not found</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Edit Job Listing
      </h1>
      <JobForm
        defaultValues={{
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          salary: job.salary,
        }}
      />
    </div>
  );
}
