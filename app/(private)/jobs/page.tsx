"use client";

import { useState, useEffect } from "react";
import { useJobs } from "@/app/hooks/use-jobs";
import { JobCard } from "@/components/jobs/job-card";
import { JobCardSkeleton } from "@/components/jobs/job-card-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BriefcaseBusiness, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type JobType = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number | null;
  createdAt: string;
  updatedAt: string;
  startupId: string;
};

export default function JobsPage() {
  const router = useRouter();
  const { jobs, isLoading, isError } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState<string | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([]);

  // Filter jobs based on search term and job type
  useEffect(() => {
    if (!jobs) return;

    const filtered = jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !jobType || job.type === jobType;

      return matchesSearch && matchesType;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, jobType]);

  const handleReset = () => {
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue={jobType || "all"}
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
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} allowEdit={false} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg bg-muted/50">
          <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />
          <h3 className="font-medium text-lg  mt-2">No jobs found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search criteria or check back later for new
            opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
