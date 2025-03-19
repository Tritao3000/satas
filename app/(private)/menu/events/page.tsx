"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/app/hooks/use-events";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, Calendar } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/components/dashboard/profile-context";
import { PlusIcon } from "lucide-react";

export default function EventsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { userId, userType, isLoading: isProfileLoading } = useProfile();

  const {
    events,
    isLoading: isEventsLoading,
    isError,
    mutate,
  } = useEvents(userId || undefined);



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
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Manage Events</h1>
            <p className="text-muted-foreground text-sm">
              Create and manage events for your startup
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage Events</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage events for your startup
          </p>
        </div>
        <Button asChild>
          <Link href="/menu/events/new">
            <PlusIcon className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full md:w-auto"
          disabled={!searchTerm && activeTab === "all"}
        >
          Reset
        </Button>
      </div>

      {isEventsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load events</p>
          <Button variant="outline" onClick={() => mutate()}>
            Try Again
          </Button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/50">
          <Calendar className="mx-auto size-8 text-muted-foreground" />
          <h3 className="font-medium text-lg  mt-2">No events found</h3>
          <p className="text-muted-foreground text-sm">
            You haven't created any events yet
          </p>

          <Button asChild className="mt-4 ">
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
  );
}
