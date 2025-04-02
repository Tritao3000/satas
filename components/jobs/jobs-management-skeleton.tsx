import { Skeleton } from "@/components/ui/skeleton";
import { JobCardSkeleton } from "./job-card-skeleton";

export function JobsManagementSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <JobCardSkeleton key={index} isManagement={true} />
      ))}
    </div>
  );
}
