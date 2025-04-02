"use client";

import { useEffect } from "react";
import { JobForm } from "@/components/jobs/job-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { CreateJobSkeleton } from "@/components/jobs/create-job-skeleton";

export default function CreateJobPage() {
  const router = useRouter();
  const { userType, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading) {
      if (!userType) {
        toast("Authentication required");
        router.push("/sign-in");
        return;
      }

      if (userType !== "startup") {
        toast("Only startups can create job listings");
        router.push("/menu");
      }
    }
  }, [userType, isLoading, router]);

  if (isLoading || userType !== "startup") {
    return <CreateJobSkeleton />;
  }

  return (
    <div>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create Job Listing
          </h1>
          <p className="text-muted-foreground text-sm">
            Publish a new job opportunity and attract talent to your startup
          </p>
        </div>

        <JobForm onSuccess={() => router.push("/menu/jobs")} />
      </div>
    </div>
  );
}
