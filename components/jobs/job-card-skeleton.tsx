import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface JobCardSkeletonProps {
  isManagement?: boolean;
}

export function JobCardSkeleton({
  isManagement = false,
}: JobCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 h-full flex flex-col relative",
        "hover:shadow-md hover:shadow-primary/10 hover:border-primary/30"
      )}
    >
      <CardContent className="p-0 relative flex-grow">
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-7 w-[85%]" />
            </div>
            {isManagement && <Skeleton className="h-8 w-8 rounded-full" />}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[75%]" />
          </div>
        </div>
      </CardContent>

      {isManagement && (
        <CardFooter className="p-5 pt-4 relative z-20">
          <Skeleton className="h-10 w-full rounded" />
        </CardFooter>
      )}

      <div className="h-1.5 w-full mt-auto bg-gray-200 dark:bg-gray-800" />
    </Card>
  );
}
