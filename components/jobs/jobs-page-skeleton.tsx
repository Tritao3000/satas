import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobCardSkeleton } from "./job-card-skeleton";

export function JobsPageSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active" disabled>
            Active Jobs
          </TabsTrigger>
          <TabsTrigger value="all" disabled>
            All Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
