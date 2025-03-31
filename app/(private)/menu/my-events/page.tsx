"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyEventRegistrations } from "@/lib/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { useUnregisterFromEvent } from "@/lib/hooks/use-event-registration";

export default function MyEventsPage() {
  const router = useRouter();
  const {
    myEvents,
    myRegistrations,
    isLoading: isEventsLoading,
    isError,
    mutate,
  } = useMyEventRegistrations();
  const { unregister, isUnregistering } = useUnregisterFromEvent();
  const [activeTab, setActiveTab] = useState("upcoming");
  const { userType, isLoading: isProfileLoading } = useProfile();
  const [processingEvents, setProcessingEvents] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!isProfileLoading) {
      if (!userType) {
        router.push("/login");
      } else if (userType !== "individual") {
        router.push("/menu/events");
      }
    }
  }, [userType, isProfileLoading, router]);

  const handleUnregister = async (eventId: string) => {
    setProcessingEvents((prev) => ({ ...prev, [eventId]: true }));
    try {
      await unregister(eventId);
    } finally {
      setProcessingEvents((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const now = new Date();
  const upcomingEvents =
    myEvents?.filter((event) => new Date(event.date) >= now) || [];
  const pastEvents =
    myEvents?.filter((event) => new Date(event.date) < now) || [];

  if (isProfileLoading || (userType === "individual" && isEventsLoading)) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">My Events</h1>
            <p className="text-muted-foreground text-sm">
              View and manage your event registrations
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

  if (userType !== "individual") {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
            <p className="text-muted-foreground text-sm mt-1">
              View and manage your event registrations
            </p>
          </div>
          <Button asChild variant="outline" className="h-11">
            <Link href="/events">
              <CalendarDays className="h-4 w-4 mr-2" />
              Browse Events
            </Link>
          </Button>
        </div>

        <Tabs
          defaultValue="upcoming"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
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
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-muted/50">
                <Calendar className="mx-auto size-8 text-muted-foreground" />
                <h3 className="font-medium text-lg  mt-2">
                  No upcoming events
                </h3>
                <p className="text-muted-foreground text-sm">
                  You haven't registered for any upcoming events.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="relative">
                    <EventCard
                      event={event}
                      showUnRegisterButton={true}
                      isPublic
                      link={`/events/${event.id}?from=my-events`}
                      onUnregister={() => handleUnregister(event.id)}
                      isUnregistering={processingEvents[event.id]}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
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
            ) : pastEvents.length === 0 ? (
              <div className="text-center p-12 border rounded-lg bg-muted/50">
                <Calendar className="mx-auto size-8 text-muted-foreground" />
                <h3 className="font-medium text-lg  mt-2">No past events</h3>
                <p className="text-muted-foreground text-sm">
                  You haven't attended any events yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isPublic
                    link={`/events/${event.id}?from=my-events`}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
