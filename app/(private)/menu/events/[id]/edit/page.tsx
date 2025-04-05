"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Loader2, AlertTriangle } from "lucide-react";
import { useEventOwnership } from "@/lib/hooks/use-events";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const eventId = use(params).id;
  const router = useRouter();
  const { event, canEdit, isLoading, isError } = useEventOwnership(eventId);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="space-y-6">
          <div className="w-full">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-4 w-64 ml-auto mt-2" />
          </div>

          <Skeleton className="h-10 w-full" />

          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground text-sm">
            Update your event details
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Event Not Found</AlertTitle>
          <AlertDescription>
            The event you're trying to edit doesn't exist or has been removed.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={() => router.push("/menu/events")} variant="outline">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground text-sm">
            Update your event details
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unauthorized</AlertTitle>
          <AlertDescription>
            You don't have permission to edit this event.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={() => router.push("/menu/events")} variant="outline">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground text-sm">
            Update your event details and information
          </p>
        </div>

        <EventForm
          defaultValues={event}
          onSuccess={() => router.push(`/events/${eventId}`)}
        />
      </div>
    </div>
  );
}
