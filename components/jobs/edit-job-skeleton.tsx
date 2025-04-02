import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export function EditJobSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Job Listing</h1>
        <p className="text-muted-foreground text-sm">
          Update your job listing details
        </p>
      </div>

      <div className="space-y-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 mr-1" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Job Details</h2>
              <Separator className="flex-1" />
            </div>

            <Card className="border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4 mr-1" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-4 ml-1" />
                    </div>
                    <Skeleton className="h-11 w-full" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4 mr-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-11 w-full" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4 mr-1" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-4 ml-1" />
                    </div>
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-4 ml-1" />
                  </div>
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10 pt-4 border-t">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
