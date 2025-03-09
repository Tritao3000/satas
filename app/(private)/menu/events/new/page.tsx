"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/components/dashboard/profile-context";
import { toast } from "sonner";
export default function NewEventPage() {
  const router = useRouter();
  const { userType, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    if (!isProfileLoading && userType !== "startup") {
      // Redirect non-startup users to events browsing
      toast("Only startups can create events");
      router.push("/events");
    }
  }, [userType, isProfileLoading, router]);

  // Show loading state while checking user type
  if (isProfileLoading || userType !== "startup") {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Create New Event
        </h1>
        <EventForm onSuccess={() => router.push("/menu/events")} />
      </div>
    </div>
  );
}
