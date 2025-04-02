"use client";

import { useState, useEffect, useRef } from "react";
import { JobCard } from "@/components/jobs/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  Search,
  Filter,
  Clock,
  CalendarDays,
  Settings2,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Job } from "@/lib/type";
import React from "react";
import Link from "next/link";
import { useProfile } from "@/lib/hooks/use-profile-content";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  JobsPageSkeleton,
  NoJobsFoundSkeleton,
} from "@/components/jobs/jobs-page-skeleton";

export default function JobsPage() {
  const [inputValue, setInputValue] = useState("");
  const isComponentMounted = useRef(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const { userId, userType, isLoading: isProfileLoading } = useProfile();
  const [startupNames, setStartupNames] = useState<Record<string, string>>({});

  const isStartup = userType === "startup";

  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [jobType, setJobType] = useQueryState("type", {
    defaultValue: "",
  });

  const [debouncedValue] = useDebounce(inputValue, 300);
  const [activeTab, setActiveTab] = useState(() => {
    if (jobType === "Full-time") return "fulltime";
    if (jobType === "Remote") return "remote";
    if (jobType === "Contract") return "contract";
    if (jobType === "Internship") return "internship";
    if (jobType === "Part-time") return "parttime";
    return "all";
  });

  useEffect(() => {
    isComponentMounted.current = true;

    return () => {
      isComponentMounted.current = false;
    };
  }, []);

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

    if (activeTab === "fulltime") {
      setJobType("Full-time");
    } else if (activeTab === "remote") {
      setJobType("Remote");
    } else if (activeTab === "contract") {
      setJobType("Contract");
    } else if (activeTab === "internship") {
      setJobType("Internship");
    } else if (activeTab === "parttime") {
      setJobType("Part-time");
    } else if (activeTab === "all") {
      setJobType("");
    }
  }, [activeTab, setJobType]);

  useEffect(() => {
    if (!isComponentMounted.current) return;

    if (jobType === "Full-time") {
      setActiveTab("fulltime");
    } else if (jobType === "Remote") {
      setActiveTab("remote");
    } else if (jobType === "Contract") {
      setActiveTab("contract");
    } else if (jobType === "Internship") {
      setActiveTab("internship");
    } else if (jobType === "Part-time") {
      setActiveTab("parttime");
    } else if (!jobType) {
      setActiveTab("all");
    }
  }, [jobType]);

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

  useEffect(() => {
    const fetchStartupNames = async () => {
      if (!jobs || jobs.length === 0) return;

      const startupIds = [...new Set(jobs.map((job) => job.startupId))];
      const newStartupNames: Record<string, string> = {};

      await Promise.all(
        startupIds.map(async (startupId) => {
          try {
            const response = await fetch(`/api/profile/startup/${startupId}`);
            if (response.ok) {
              const data = await response.json();
              if (data && data.name) {
                newStartupNames[startupId] = data.name;
              }
            }
          } catch (error) {
            console.error("Error fetching startup name:", error);
          }
        })
      );

      setStartupNames(newStartupNames);
    };

    fetchStartupNames();
  }, [jobs]);

  const handleReset = () => {
    setInputValue("");
    setSearchTerm("");
    setJobType("");
    setActiveTab("all");
    setFilterOpen(false);
  };

  const filtersActive = activeTab !== "all" || searchTerm.trim() !== "";

  const isLoadingData = isProfileLoading || isLoading;

  return (
    <div className="md:container py-4 md:py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Browse through job opportunities from innovative startups
            </p>
          </div>

          {isStartup && (
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/menu/jobs">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Manage Jobs</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs by title..."
              className="pl-9"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {filtersActive && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1">
                      {activeTab !== "all" ? 1 : 0}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 shadow-lg border border-border/40"
                align="end"
              >
                <div className="p-4 border-b border-border/40">
                  <h4 className="font-medium">Filter Jobs</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Browse jobs by type
                  </p>
                </div>

                <div className="relative">
                  <ScrollArea className="h-[200px]">
                    <div className="p-4 space-y-4">
                      <div className="grid gap-2">
                        <RadioGroupItem
                          id="all-jobs"
                          checked={activeTab === "all"}
                          onChange={() => {
                            setActiveTab("all");
                            setFilterOpen(false);
                          }}
                          label="All Jobs"
                          description="View all job types"
                          icon={
                            <BriefcaseBusiness className="h-4 w-4 text-primary" />
                          }
                        />

                        <RadioGroupItem
                          id="fulltime-jobs"
                          checked={activeTab === "fulltime"}
                          onChange={() => {
                            setActiveTab("fulltime");
                            setFilterOpen(false);
                          }}
                          label="Full-time Jobs"
                          description="Full-time positions only"
                          icon={<Clock className="h-4 w-4 text-green-500" />}
                          indicator={
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                            </div>
                          }
                        />

                        <RadioGroupItem
                          id="parttime-jobs"
                          checked={activeTab === "parttime"}
                          onChange={() => {
                            setActiveTab("parttime");
                            setFilterOpen(false);
                          }}
                          label="Part-time Jobs"
                          description="Part-time positions"
                          icon={<Clock className="h-4 w-4 text-amber-500" />}
                          indicator={
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-amber-500" />
                            </div>
                          }
                        />

                        <RadioGroupItem
                          id="remote-jobs"
                          checked={activeTab === "remote"}
                          onChange={() => {
                            setActiveTab("remote");
                            setFilterOpen(false);
                          }}
                          label="Remote Jobs"
                          description="Work from anywhere positions"
                          icon={
                            <CalendarDays className="h-4 w-4 text-blue-500" />
                          }
                          indicator={
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                            </div>
                          }
                        />

                        <RadioGroupItem
                          id="contract-jobs"
                          checked={activeTab === "contract"}
                          onChange={() => {
                            setActiveTab("contract");
                            setFilterOpen(false);
                          }}
                          label="Contract Jobs"
                          description="Temporary contract positions"
                          icon={
                            <CalendarDays className="h-4 w-4 text-orange-500" />
                          }
                          indicator={
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-orange-500" />
                            </div>
                          }
                        />

                        <RadioGroupItem
                          id="internship-jobs"
                          checked={activeTab === "internship"}
                          onChange={() => {
                            setActiveTab("internship");
                            setFilterOpen(false);
                          }}
                          label="Internship Jobs"
                          description="Student and graduate internships"
                          icon={
                            <CalendarDays className="h-4 w-4 text-purple-500" />
                          }
                          indicator={
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-purple-500" />
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                <div className="p-4 border-t border-border/40 flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isLoadingData ? (
          <JobsPageSkeleton />
        ) : isError ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-destructive mb-4">Failed to load jobs</p>
            <Button variant="outline" onClick={() => mutate()}>
              Try Again
            </Button>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <NoJobsFoundSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                allowEdit={false}
                startupName={startupNames[job.startupId]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface RadioGroupItemProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  indicator?: React.ReactNode;
}

function RadioGroupItem({
  id,
  checked,
  onChange,
  label,
  description,
  icon,
  indicator,
}: RadioGroupItemProps) {
  return (
    <div
      className={cn(
        "relative flex items-start p-3 rounded-md transition-all cursor-pointer",
        checked
          ? "bg-primary/5 border-primary/10 border"
          : "border border-transparent hover:bg-accent/50"
      )}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }}
      tabIndex={0}
      role="radio"
      aria-checked={checked}
    >
      <input
        type="radio"
        id={id}
        name="job-filter"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onChange();
        }}
        className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
        aria-labelledby={`${id}-label`}
      />
      <div className="flex w-full gap-3">
        {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1 space-y-1">
          <label
            id={`${id}-label`}
            htmlFor={id}
            className="font-medium text-sm flex items-center gap-2 cursor-pointer"
          >
            {label}
            {indicator && <div className="ml-1.5">{indicator}</div>}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0 flex h-5 items-center">
          <div
            className={cn(
              "h-4 w-4 rounded-full border transition-all flex items-center justify-center",
              checked
                ? "border-primary border-[5px]"
                : "border-muted-foreground/30"
            )}
          />
        </div>
      </div>
    </div>
  );
}
