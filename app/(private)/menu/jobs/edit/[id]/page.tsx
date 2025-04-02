"use client";

import { use, useEffect } from "react";
import { useJob } from "@/lib/hooks/use-jobs";
import { JobForm } from "@/components/jobs/job-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { EditJobSkeleton } from "@/components/jobs/edit-job-skeleton";

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

  useEffect(() => {
    if (!isProfileLoading && userType !== "startup") {
      toast("Only startups can edit job listings");
      router.push("/menu");
    }
  }, [userType, isProfileLoading, router]);

  useEffect(() => {
    if (!isJobLoading && job && userId && job.startupId !== userId) {
      toast("You don't have permission to edit this job");
      router.push("/menu/jobs");
    }
  }, [isJobLoading, job, userId, router]);

  if (isCheckingAuth || isJobLoading) {
    return <EditJobSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="bg-destructive/10 p-3 rounded-full">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Error Loading Job</h1>
        <p className="text-muted-foreground max-w-md">
          There was an error loading the job information. Please try again or
          contact support if the issue persists.
        </p>
        <Button asChild>
          <Link href="/menu/jobs">Return to Jobs</Link>
        </Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="bg-muted p-3 rounded-full">
          <BriefcaseBusiness className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          The job listing you're trying to edit doesn't exist or has been
          removed.
        </p>
        <Button asChild>
          <Link href="/menu/jobs">Return to Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Job Listing
          </h1>
          <p className="text-muted-foreground text-sm">
            Update the details of your "{job.title}" job listing
          </p>
        </div>

        <JobForm
          defaultValues={{
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            type: job.type,
            salary: job.salary,
          }}
          onSuccess={() => router.push(`/jobs/${job.id}`)}
        />
      </div>
    </div>
  );
}
