"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();
  const { userType, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    if (!isProfileLoading && userType !== "startup") {
      toast("Only startups can create events");
      router.push("/menu/events");
    }
  }, [userType, isProfileLoading, router]);

  if (isProfileLoading || userType !== "startup") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin     text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
          <p className="text-muted-foreground text-sm">
            Add a new event to promote your startup and engage with the
            community
          </p>
        </div>

        <EventForm onSuccess={() => router.push("/menu/events")} />
      </div>
    </div>
  );
}
