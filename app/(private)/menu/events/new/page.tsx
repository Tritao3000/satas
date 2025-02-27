"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/events/event-form";
import { Loader2 } from "lucide-react";

export default function NewEventPage() {
  const [isStartup, setIsStartup] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        // Get user type
        const { data: userData } = await supabase
          .from("users")
          .select("type")
          .eq("id", data.user.id)
          .single();

        if (userData?.type === "startup") {
          setIsStartup(true);
        } else {
          setIsStartup(false);
          // Redirect non-startup users
          router.push("/events");
        }
      } else {
        // Redirect unauthenticated users
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  // Show loading state while checking user type
  if (isStartup === null) {
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
