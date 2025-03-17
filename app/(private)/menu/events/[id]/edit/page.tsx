"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Loader2 } from "lucide-react";
import { useEvent } from "@/app/hooks/use-events";
import { useProfile } from "@/components/dashboard/profile-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const eventId = params instanceof Promise ? use(params).id : params.id;
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const { event, isLoading: isEventLoading, isError } = useEvent(eventId);
  const { userType, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    // Only run this effect when both profile and event are loaded
    if (!isProfileLoading && !isEventLoading && event) {
      if (!userType) {
        // Redirect unauthenticated users
        router.push("/login");
        return;
      }

      if (userType !== "startup") {
        // Redirect non-startup users
        router.push("/events");
        return;
      }

      // Check if user owns the event
      const checkOwnership = async () => {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();

        if (data.user && event.startupId === data.user.id) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.push("/menu/events");
        }
      };

      checkOwnership();
    }
  }, [isProfileLoading, isEventLoading, userType, event, router]);

  // Show loading state while checking authorization or loading event
  if (isEventLoading || isProfileLoading || isAuthorized === null) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Event</h1>
        <Card>
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-40 w-full md:w-1/2 rounded-md" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show error state if event couldn't be loaded
  if (isError || !event) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The event you're trying to edit doesn't exist or has been removed.
        </p>
        <button
          className="text-primary hover:underline"
          onClick={() => router.push("/menu/events")}
        >
          Back to Events
        </button>
      </div>
    );
  }

  // Show unauthorized state if user doesn't own the event
  if (isAuthorized === false) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-muted-foreground mb-4">
          You don't have permission to edit this event.
        </p>
        <button
          className="text-primary hover:underline"
          onClick={() => router.push("/menu/events")}
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className=" mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Event</h1>
        <EventForm
          defaultValues={event}
          onSuccess={() => router.push("/menu/events")}
        />
      </div>
    </div>
  );
}
