import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function JobDetailsSkeleton() {
  return (
    <div className="w-full">
      <div className="space-y-5">
        <Card className="relative overflow-hidden shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>

                <Skeleton className="h-9 w-[85%] md:w-[75%]" />

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1.5 flex-shrink-0 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1.5 flex-shrink-0 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2 md:mt-0">
                <Skeleton className="h-10 w-32 md:w-40" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-9 rounded" />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Separator className="my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-start">
                <Skeleton className="h-10 w-10 mr-3 rounded-md" />
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>

              <div className="flex items-start">
                <Skeleton className="h-10 w-10 mr-3 rounded-md" />
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>

              <div className="flex items-start">
                <Skeleton className="h-10 w-10 mr-3 rounded-md" />
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-1 md:col-span-2 space-y-5">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-36" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-4 w-full" />
                  ))}
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index + 6} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t flex justify-end">
                <Skeleton className="h-10 w-32 mt-4" />
              </CardFooter>
            </Card>
          </div>

          <div className="col-span-1 space-y-5">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-3" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t flex flex-col gap-3">
                <Button variant="outline" disabled className="w-full">
                  <Skeleton className="h-4 w-32" />
                </Button>
                <Button variant="outline" disabled className="w-full">
                  <Skeleton className="h-4 w-28" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
