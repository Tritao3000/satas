import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProfileEditSkeleton() {
  return (
    <div className="mx-auto">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="space-y-10 pb-10">
          <div className="w-full space-y-4 relative">
            <div className="w-full h-64 relative rounded-lg overflow-hidden bg-muted">
              <Skeleton className="h-full w-full" />
              <div className="absolute top-4 right-4">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-4 w-64 ml-auto" />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="relative flex flex-col sm:flex-row items-start gap-6">
              <div className="relative -mt-36 ml-4 z-10">
                <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
                <div className="absolute bottom-0 right-0">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-8 mt-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-80" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>

              <Separator />

              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
