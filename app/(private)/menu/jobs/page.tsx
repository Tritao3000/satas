"use client";

import { useEffect, useState, useRef } from "react";
import { useJobs } from "@/lib/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/job-card";
import { PlusIcon, BriefcaseBusiness, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { JobsManagementSkeleton } from "@/components/jobs/jobs-management-skeleton";
import { Input } from "@/components/ui/input";
import React from "react";
import { useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";

export default function JobsManagementPage() {
  const router = useRouter();
  const { userType, isLoading: isProfileLoading, userId } = useProfile();
  const isComponentMounted = useRef(true);
  const [startupName, setStartupName] = useState<string>("");

  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "",
  });

  const [inputValue, setInputValue] = useState(searchTerm || "");
  const [activeTab, setActiveTab] = useState(() => {
    return status === "active" ? "active" : "all";
  });

  const [debouncedValue] = useDebounce(inputValue, 300);

  useEffect(() => {
    if (!isProfileLoading && userType !== "startup") {
      toast.error("Only startups can access this page");
      router.push("/menu");
    }
  }, [userType, isProfileLoading, router]);

  useEffect(() => {
    isComponentMounted.current = true;

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchStartupName = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/profile/startup/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.name) {
            setStartupName(data.name);
          }
        }
      } catch (error) {
        console.error("Error fetching startup name:", error);
      }
    };

    fetchStartupName();
  }, [userId]);

  useEffect(() => {
    if (debouncedValue !== undefined) {
      setSearchTerm(debouncedValue);
    }
  }, [debouncedValue, setSearchTerm]);

  useEffect(() => {
    setInputValue(searchTerm || "");
  }, [searchTerm]);

  useEffect(() => {
    if (!isComponentMounted.current) return;

    if (activeTab === "active") {
      setStatus("active");
    } else {
      setStatus("");
    }
  }, [activeTab, setStatus]);

  useEffect(() => {
    if (!isComponentMounted.current) return;

    if (status === "active") {
      setActiveTab("active");
    } else {
      setActiveTab("all");
    }
  }, [status]);

  const {
    jobs,
    isLoading: isJobsLoading,
    isError,
    mutate,
  } = useJobs(
    userId || undefined,
    searchTerm || undefined,
    status || undefined
  );

  const handleDeleteJob = () => {
    mutate();
  };

  const isLoading = isProfileLoading || isJobsLoading;

  return (
    <div className="md:container py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage Job Listings</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage your job postings
          </p>
        </div>
        <Button asChild>
          <Link href="/menu/jobs/create">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Create Job</span>
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your job listings..."
            className="pl-9"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <JobsManagementSkeleton />
        ) : isError ? (
          <div className="text-center p-8 text-destructive">
            Failed to load jobs. Please try again.
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-muted/50">
            <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />
            <h3 className="font-medium text-lg mt-2">No jobs found</h3>
            <p className="text-muted-foreground text-sm">
              {searchTerm
                ? "No jobs match your search criteria"
                : "You haven't posted any jobs yet"}
            </p>

            <Button className="mt-4" asChild>
              <Link href="/menu/jobs/create">Post Your First Job</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                allowEdit={true}
                onDelete={handleDeleteJob}
                startupName={startupName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
