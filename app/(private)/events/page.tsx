"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CalendarDays, CalendarRange, Filter } from "lucide-react";
import {
  useEvents,
  useMyEventRegistrations,
} from "../../../lib/hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import Link from "next/link";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  useRegisterForEvent,
  useUnregisterFromEvent,
} from "@/lib/hooks/use-event-registration";

export default function EventsPage() {
  const { events, isLoading, isError, mutate } = useEvents();
  const { myRegistrations, isLoading: isMyRegistrationsLoading } =
    useMyEventRegistrations();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const { userType, userId } = useProfile();
  const { register, isRegistering } = useRegisterForEvent();
  const { unregister, isUnregistering } = useUnregisterFromEvent();

  const [processingEvents, setProcessingEvents] = useState<
    Record<string, boolean>
  >({});

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
          event.location.toLowerCase().includes(search) ||
          (event.startup?.name &&
            event.startup.name.toLowerCase().includes(search))
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

  const handleRegister = async (eventId: string) => {
    if (!userId) {
      window.location.href = `/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`;
      return;
    }

    if (userType !== "individual") {
      toast("Registration not allowed", {
        description: "Only individual users can register for events.",
      });
      return;
    }

    setProcessingEvents((prev) => ({ ...prev, [eventId]: true }));
    try {
      await register(eventId);
    } finally {
      setProcessingEvents((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const handleUnregister = async (eventId: string) => {
    setProcessingEvents((prev) => ({ ...prev, [eventId]: true }));
    try {
      await unregister(eventId);
    } finally {
      setProcessingEvents((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const renderEventCards = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-destructive mb-4">Failed to load events</p>
          <Button variant="outline" onClick={() => mutate()}>
            Try Again
          </Button>
        </div>
      );
    }

    if (filteredEvents.length === 0) {
      return (
        <div className="text-center p-12 border rounded-lg bg-muted/50">
          <CalendarRange className="mx-auto size-10 text-muted-foreground mb-2" />
          <h3 className="font-medium text-lg mt-2">No events found</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
            {searchTerm
              ? "Try adjusting your search criteria."
              : activeTab === "upcoming"
                ? "No upcoming events scheduled at the moment. Check back later!"
                : activeTab === "past"
                  ? "No past events are available."
                  : "There are no events available at the moment."}
          </p>
        </div>
      );
    }

    const registrationMap: Record<string, boolean> = {};
    myRegistrations?.forEach((reg) => {
      registrationMap[reg.eventId] = true;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isEventRegistered = registrationMap[event.id] || false;
          const isEventProcessing = processingEvents[event.id] || false;

          return (
            <EventCard
              key={event.id}
              event={event}
              isPublic
              link={`/events/${event.id}`}
              onRegister={() => handleRegister(event.id)}
              onUnregister={() => handleUnregister(event.id)}
              registerButtonDisabled={userType !== "individual"}
              showUnRegisterButton={isEventRegistered}
              isRegistering={isEventProcessing && !isEventRegistered}
              isUnregistering={isEventProcessing && isEventRegistered}
              isRegistered={isEventRegistered}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Community Events
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Discover networking events, workshops, and opportunities
            </p>
          </div>

          {userType && (
            <div className="flex gap-2">
              {userType === "startup" && (
                <Button asChild>
                  <Link href="/menu/events">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Manage Events
                  </Link>
                </Button>
              )}
              {userType === "individual" && (
                <Button asChild>
                  <Link href="/menu/my-events">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    My Events
                  </Link>
                </Button>
              )}
            </div>
          )}
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
                    <h4 className="font-medium text-sm">Filter</h4>
                  </div>
                  <Tabs
                    defaultValue="all"
                    value={activeTab}
                    onValueChange={(value) => {
                      setActiveTab(value);
                    }}
                    className="w-full"
                  >
                    <TabsList className="flex w-full">
                      <TabsTrigger value="all" className="flex-1">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="upcoming" className="flex-1">
                        Upcoming
                      </TabsTrigger>
                      <TabsTrigger value="past" className="flex-1">
                        Past
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="pt-2 flex justify-end">
                    <Button size="sm" onClick={() => setFilterOpen(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {renderEventCards()}
      </div>
    </div>
  );
}
