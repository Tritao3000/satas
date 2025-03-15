import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Image skeleton */}
      <div className="h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Header skeleton */}
      <CardHeader className="pt-4">
        <div className="flex justify-between items-start">
          <div className="w-3/4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>

      {/* Content skeleton */}
      <CardContent className="pb-2 space-y-3">
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12 mt-1" />
        </div>
      </CardContent>

      {/* Footer skeleton */}
      <CardFooter className="flex-col space-y-2 pt-2 mt-auto">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
