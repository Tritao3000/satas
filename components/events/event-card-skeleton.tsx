import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function EventCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <div className="h-48 w-full relative">
        <Skeleton className="h-full w-full" />
        <div className="absolute top-0 left-0 m-4">
          <Skeleton className="h-16 w-14 rounded-md" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-5 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 flex-grow">
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex items-start">
          <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="mt-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12 mt-1" />
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
