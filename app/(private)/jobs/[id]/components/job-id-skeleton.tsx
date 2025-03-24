import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function JobPostSkeleton() {
  return (
    <div>
      <div>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 mb-2" />
                <div className="flex items-center gap-2 text-sm">
                  <Skeleton className="h-4 w-24" />
                  <span>•</span>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-20 ml-2" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <Tabs defaultValue="description">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="description" disabled>
                  <Skeleton className="h-4 w-3/5" />
                </TabsTrigger>
                <TabsTrigger className="w-full" value="company" disabled>
                  <Skeleton className="h-4 w-3/5" />
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
