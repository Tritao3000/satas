"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/lib/hooks/use-events";
import { useMyEventRegistrations } from "@/lib/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, CalendarPlus, Filter, X } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import Link from "next/link";
import { toast } from "sonner";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const { userId, userType, isLoading: isProfileLoading } = useProfile();

  const isStartup = userType === "startup";

  const {
    events: startupEvents,
    isLoading: isStartupEventsLoading,
    isError: isStartupEventsError,
    mutate: mutateStartupEvents,
  } = useEvents(isStartup ? userId || undefined : undefined);

  const {
    myEvents: individualEvents,
    isLoading: isIndividualEventsLoading,
    isError: isIndividualEventsError,
    mutate: mutateIndividualEvents,
  } = useMyEventRegistrations();

  const isEventsLoading = isStartup
    ? isStartupEventsLoading
    : isIndividualEventsLoading;
  const isEventsError = isStartup
    ? isStartupEventsError
    : isIndividualEventsError;
  const events = isStartup ? startupEvents : individualEvents;
  const mutate = isStartup ? mutateStartupEvents : mutateIndividualEvents;

  useEffect(() => {
    if (!events) return;

    let filtered = [...events];

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

    const now = new Date();
    if (activeTab === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.date) >= now);
    } else if (activeTab === "past") {
      filtered = filtered.filter((event) => new Date(event.date) < now);
    }

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

  const filtersActive = activeTab !== "all" || searchTerm.trim() !== "";

  const handleReset = () => {
    setSearchTerm("");
    setActiveTab("all");
    setFilterOpen(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!isStartup) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      toast("Event deleted successfully");
      mutate();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast("Error deleting event", {
        description: error.message || "Please try again.",
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (isStartup) return;

    try {
      const response = await fetch("/api/events/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to unregister from event");
      }

      toast("Unregistered successfully", {
        description: "You have been removed from this event.",
      });
      mutate();
    } catch (error: any) {
      console.error("Unregistration error:", error);
      toast("Unregistration failed", {
        description: error.message || "Please try again.",
      });
    }
  };

  const isLoading = isProfileLoading || isEventsLoading;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground text-sm">
              {isStartup
                ? "Create and manage events for your startup"
                : "View and manage your event registrations"}
            </p>
          </div>
          <Skeleton className="h-10 w-32" />
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
    <div className="container py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isStartup ? "Manage Events" : "My Events"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isStartup
                ? "Create and manage events for your startup"
                : "View and manage your event registrations"}
            </p>
          </div>

          <div className="flex gap-2">
            {isStartup ? (
              <Button asChild>
                <Link href="/menu/events/create">
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse Events
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-2">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {filtersActive && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1">
                      {activeTab !== "all" ? 1 : 0}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Filter by status</h4>
                  </div>

                  <div className="flex w-full gap-2">
                    <Button
                      variant={activeTab === "all" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setActiveTab("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={activeTab === "upcoming" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setActiveTab("upcoming")}
                    >
                      Upcoming
                    </Button>
                    <Button
                      variant={activeTab === "past" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setActiveTab("past")}
                    >
                      Past
                    </Button>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button size="sm" onClick={() => setFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isEventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : isEventsError ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-destructive mb-4">Failed to load events</p>
            <Button variant="outline" onClick={() => mutate()}>
              Try Again
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center p-12 border rounded-lg bg-card/50">
            <Calendar className="mx-auto size-10 text-muted-foreground mb-2" />
            <h3 className="font-medium text-lg mt-2">No events found</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search criteria."
                : activeTab === "upcoming"
                  ? "No upcoming events scheduled at the moment."
                  : activeTab === "past"
                    ? "No past events are available."
                    : isStartup
                      ? "You haven't created any events yet"
                      : "You haven't registered for any events yet"}
            </p>

            {isStartup ? (
              <Button asChild className="mt-4">
                <Link href="/menu/events/create">Create Your First Event</Link>
              </Button>
            ) : (
              <Button asChild className="mt-4">
                <Link href="/events">Browse Events</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                allowEdit={isStartup}
                onDelete={isStartup ? handleDeleteEvent : undefined}
                showUnRegisterButton={!isStartup}
                isPublic={!isStartup}
                link={
                  !isStartup
                    ? `/events/${event.id}?from=manage-events`
                    : undefined
                }
                onUnregister={
                  !isStartup ? () => handleUnregister(event.id) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
