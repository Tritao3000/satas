"use client";

import { useState, useEffect } from "react";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseBusiness, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    const errorData = await res.json().catch(() => ({}));
    (error as any).info = errorData;
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

type Job = {
  id: string;
  startupId: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number | null;
  createdAt: string;
  updatedAt: string;
};

export default function JobsPage() {
  const [inputValue, setInputValue] = useState("");

  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [jobType, setJobType] = useQueryState("type", {
    defaultValue: "",
  });

  const [debouncedValue] = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedValue !== undefined) {
      setSearchTerm(debouncedValue);
    }
  }, [debouncedValue, setSearchTerm]);

  useEffect(() => {
    setInputValue(searchTerm || "");
  }, []);

  const getJobsUrl = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (jobType) params.append("type", jobType);

    const queryString = params.toString();
    return `/api/jobs${queryString ? `?${queryString}` : ""}`;
  };

  const {
    data: jobs,
    error: isError,
    isLoading,
    mutate,
  } = useSWR<Job[]>(getJobsUrl(), fetcher);

  const handleReset = () => {
    setInputValue("");
    setSearchTerm("");
    setJobType(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-muted-foreground text-sm">
            Browse through job opportunities from innovative startups
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, or location..."
            className="pl-9"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <Tabs
          value={jobType || "all"}
          onValueChange={(value) => setJobType(value === "all" ? null : value)}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All Types</TabsTrigger>
            <TabsTrigger value="Full-time">Full-time</TabsTrigger>
            <TabsTrigger value="Part-time">Part-time</TabsTrigger>
            <TabsTrigger value="Contract">Contract</TabsTrigger>
            <TabsTrigger value="Internship">Internship</TabsTrigger>
            <TabsTrigger value="Remote">Remote</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center p-12 text-destructive">
          Failed to load jobs. Please try again.
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} allowEdit={false} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/50">
          <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />
          <h3 className="font-medium text-lg mt-2">No jobs found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search criteria or check back later for new
            opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
