"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Search,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetcher } from "@/lib/fetcher";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { format } from "date-fns";

interface EventRegistration {
  id: string;
  eventId: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  eventImagePath?: string;
  startupId: string;
}

interface RegistrationsResponse {
  registrations: EventRegistration[];
  eventsData: Event[];
}

const RegistrationCardSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="h-40 bg-muted" />
    <CardContent className="p-4">
      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-1/2 mb-4" />
      <div className="h-4 bg-muted rounded w-4/5 mb-3" />
      <div className="h-4 bg-muted rounded w-2/3 mb-5" />
      <div className="h-8 bg-muted rounded w-full" />
    </CardContent>
  </Card>
);

const RegistrationCard = ({
  event,
}: {
  registration: EventRegistration;
  event: Event;
}) => {
  const eventDate = new Date(`${event.date}T${event.startTime}`);
  const isPast = eventDate < new Date();

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div
        className="h-40 bg-cover bg-center"
        style={{
          backgroundImage: event.eventImagePath
            ? `url(${event.eventImagePath})`
            : "linear-gradient(to right, #4f46e5, #8b5cf6)",
        }}
      />
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="mb-auto">
          <h3 className="text-lg font-semibold line-clamp-1 mb-1">
            {event.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">
            {format(new Date(event.date), "PPP")}
          </p>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {event.description}
          </p>
          <p className="text-sm mb-4">
            <span className="text-muted-foreground">Location:</span>{" "}
            {event.location}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <Badge variant={isPast ? "default" : "outline"}>
            {isPast ? "Attended" : "Registered"}
          </Badge>

          <Button asChild size="sm">
            <Link href={`/events/${event.id}`}>
              View Event
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RegistrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { userId, userType, isLoading: isProfileLoading } = useProfile();

  const {
    data,
    error: registrationsError,
    isLoading: registrationsIsLoading,
  } = useSWR<RegistrationsResponse>(
    () => (userType === "individual" ? "/api/events/my-registrations" : null),
    fetcher
  );

  const isLoading = isProfileLoading || registrationsIsLoading;
  const error = registrationsError;

  const HeaderSection = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Registrations</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your event registrations
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild className="gap-2" size="sm">
          <Link href="/events">
            <Search className="h-4 w-4" />
            <span>Explore Events</span>
          </Link>
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <HeaderSection />
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your registrations..."
              value=""
              onChange={() => {}}
              className="pl-9"
              disabled={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <RegistrationCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <HeaderSection />
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading your event registrations. Please try
            refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (userType !== "individual") {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <HeaderSection />
        <Card className="p-8 text-center">
          <CalendarDays className="mx-auto size-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            This page is only available for individual user accounts. Please
            return to the dashboard.
          </p>
          <Button asChild>
            <Link href="/menu">Go to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!data || !data.registrations || data.registrations.length === 0) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <HeaderSection />
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your registrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <Card className="p-8 text-center border-dashed">
          <CalendarDays className="mx-auto size-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-xl mb-2">
            No event registrations found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't registered for any events yet. Discover and join
            upcoming events!
          </p>
          <Button asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const eventMap = data.eventsData.reduce(
    (acc, event) => {
      acc[event.id] = event;
      return acc;
    },
    {} as Record<string, Event>
  );

  const filterRegistrations = (registrations: EventRegistration[]) => {
    if (!searchQuery.trim()) return registrations;

    return registrations.filter((registration) => {
      const event = eventMap[registration.eventId];
      if (!event) return false;

      const searchLower = searchQuery.toLowerCase();
      return (
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower)
      );
    });
  };

  const registrationsToDisplay = filterRegistrations(data.registrations);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <HeaderSection />

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your registrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {registrationsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {registrationsToDisplay.map((registration) => {
              const event = eventMap[registration.eventId];
              if (!event) return null;

              return (
                <RegistrationCard
                  key={registration.id}
                  registration={registration}
                  event={event}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center border-dashed">
            <CalendarDays className="mx-auto size-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">
              No registrations found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {searchQuery
                ? "No registrations match your search criteria. Try adjusting your search."
                : "You haven't registered for any events yet. Discover upcoming events now!"}
            </p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
