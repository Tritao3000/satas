import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ProfileSkeleton() {
  return (
    <div>
      {/* Banner/Cover Skeleton */}
      <div className="relative w-full h-[200px] md:h-[300px] rounded-t-xl overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Profile Summary Skeleton */}
      <div className="relative bg-card border rounded-b-xl p-6 shadow-sm">
        <div className="flex flex-col items-start">
          <div className="relative -mt-20 mb-4">
            <Skeleton className="w-[120px] h-[120px] rounded-full border-4 border-background" />
          </div>

          <div className="w-full">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-2" />

            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Profile Details Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* First Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>

            {/* Second Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
