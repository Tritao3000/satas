"use client";

import { useEffect } from "react";
import { JobForm } from "@/components/jobs/job-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/components/dashboard/profile-context";

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

      // If not a startup, redirect
      if (userType !== "startup") {
        toast("Only startups can create job listings");
        router.push("/menu");
      }
    }
  }, [userType, isLoading, router]);

  if (isLoading || userType !== "startup") {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Create Job Listing
      </h1>
      <JobForm />
    </div>
  );
}
