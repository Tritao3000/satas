"use client";

import { useEffect, useState } from "react";
import { useJob } from "@/app/hooks/use-jobs";
import { createClient } from "@/utils/supabase/client";
import { JobForm } from "@/components/jobs/job-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { job, isLoading: isJobLoading, isError } = useJob(params.id);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if the user is authorized to edit this job
  useEffect(() => {
    async function checkAuthorization() {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          toast("Authentication required");
          router.push("/sign-in");
          return;
        }

        setUserId(user.id);

        // Get user type
        const { data: userData, error: userDataError } = await supabase
          .from("users")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (userDataError) {
          throw new Error(userDataError.message);
        }

        setUserType(userData?.user_type);

        // If not a startup, redirect
        if (userData?.user_type !== "startup") {
          toast("Only startups can edit job listings");
          router.push("/menu");
          return;
        }

        setIsCheckingAuth(false);
      } catch (error: any) {
        console.error("Error checking authorization:", error);
        toast("An error occurred. Please try again.");
        router.push("/menu/jobs");
      }
    }

    checkAuthorization();
  }, [router]);

  // Check job ownership once data is loaded
  useEffect(() => {
    if (!isJobLoading && job && userId && job.startupId !== userId) {
      toast("You don't have permission to edit this job");
      router.push("/menu/jobs");
    }
  }, [isJobLoading, job, userId, router]);

  if (isCheckingAuth || isJobLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-10">
        <div className="text-center p-8 text-destructive">
          Failed to load job information. Please try again.
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-10">
        <div className="text-center p-8">Job not found</div>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl">
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
