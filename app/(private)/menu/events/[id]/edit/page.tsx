"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Loader2 } from "lucide-react";
import { useEvent } from "@/app/hooks/use-events";
import { useProfile } from "@/components/dashboard/profile-context";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const { event, isLoading: isEventLoading, isError } = useEvent(params.id);
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
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // Show error state if event couldn't be loaded
  if (isError || !event) {
    return (
      <div className="container py-8 text-center">
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
      <div className="container py-8 text-center">
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
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Event</h1>
        <EventForm
          defaultValues={event}
          onSuccess={() => router.push("/menu/events")}
        />
      </div>
    </div>
  );
}
