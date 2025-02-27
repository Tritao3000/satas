"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/app/hooks/use-events";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/components/dashboard/profile-context";

export default function EventsManagementPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { userType, isLoading: isProfileLoading } = useProfile();

  const {
    events,
    isLoading: isEventsLoading,
    isError,
    mutate,
  } = useEvents(userId || undefined);

  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUserId(data.user.id);
      } else {
        // Redirect unauthenticated users
        router.push("/login");
      }
    };

    getUserId();
  }, [router]);

  // Handle redirection based on user type
  useEffect(() => {
    if (!isProfileLoading && userType !== "startup") {
      // Redirect non-startup users to events browsing
      router.push("/events");
    }
  }, [userType, isProfileLoading, router]);

  useEffect(() => {
    if (!events) return;

    let filtered = [...events];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search) ||
          (event.description &&
            event.description.toLowerCase().includes(search)) ||
          event.location.toLowerCase().includes(search)
      );
    }

    // Apply tab filter
    const now = new Date();
    if (activeTab === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.date) >= now);
    } else if (activeTab === "past") {
      filtered = filtered.filter((event) => new Date(event.date) < now);
    }

    // Sort events by date (newest first for past, soonest first for upcoming)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return activeTab === "past"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm("");
    setActiveTab("all");
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      toast("Event deleted successfully");
      mutate(); // Refresh events list
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast("Error deleting event", {
        description: error.message || "Please try again.",
      });
    }
  };

  const isLoading = isProfileLoading || isEventsLoading;

  // Show loading state while checking user type or loading events
  if (isLoading || userType !== "startup") {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-muted-foreground">
            Create and manage events for your startup.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="md:ml-2"
              disabled={!searchTerm && activeTab === "all"}
            >
              Reset
            </Button>
          </div>
          <Button asChild>
            <Link href="/menu/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>

        {isEventsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading events...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load events</p>
            <Button variant="outline" onClick={() => mutate()}>
              Try Again
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="mt-4 text-lg font-semibold">No events found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm
                ? "Try adjusting your search term."
                : activeTab === "upcoming"
                  ? "You have no upcoming events scheduled."
                  : activeTab === "past"
                    ? "You have no past events to display."
                    : "You haven't created any events yet."}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={handleReset} className="mt-4">
                Clear Search
              </Button>
            )}
            <Button asChild className="mt-4 ml-2">
              <Link href="/menu/events/new">Create Your First Event</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
