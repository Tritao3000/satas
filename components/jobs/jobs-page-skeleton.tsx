import { Skeleton } from "@/components/ui/skeleton";
import { JobCardSkeleton } from "./job-card-skeleton";
import { BriefcaseBusiness } from "lucide-react";

export function JobsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <JobCardSkeleton key={index} isManagement={false} />
      ))}
    </div>
  );
}

export function NoJobsFoundSkeleton() {
  return (
    <div className="text-center p-12 border rounded-lg bg-card/50">
      <BriefcaseBusiness className="mx-auto size-10 text-muted-foreground mb-2" />
      <h3 className="font-medium text-lg mt-2">No jobs found</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
        No job listings are available right now.
      </p>
    </div>
  );
}
