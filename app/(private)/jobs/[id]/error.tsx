"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  //TODO: if not authenticated then redirect to sign in page but maybe in future we will make the job id page public so anyone can view a job

  return (
    <div className="container py-16">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <div className="text-gray-600 mb-6">
          {error.message === "Job not found" ? (
            <p>
              The job posting you're looking for doesn't exist or has been
              removed.
            </p>
          ) : error.message === "User not found" ? (
            <p>You need to be signed in to view this job posting.</p>
          ) : (
            <p>An unexpected error occurred while loading this job posting.</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/jobs")}
            variant="outline"
          >
            Back to job listings
          </Button>
        </div>
      </div>
    </div>
  );
}
