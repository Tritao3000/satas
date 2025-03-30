import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col w-full min-w-full">
      <div className="relative w-full h-[250px] bg-muted">
        <Skeleton className="h-full w-full" />

        <div className="absolute top-4 right-4 z-10">
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="w-full">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex flex-col items-start -mt-16 mb-6">
              <div className="relative w-full flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <Skeleton className="rounded-full w-32 h-32 ring-4 ring-background" />

                  <div className="mt-4 md:mt-0">
                    <Skeleton className="h-6 w-48 mb-2" />

                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-8">
                <Skeleton className="h-8 w-24 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <div className="bg-muted/20 p-6 rounded-lg border border-border/50">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-3 mt-0.5" />
                      <div>
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="pt-4">
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
