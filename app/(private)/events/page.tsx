"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  CalendarDays,
  CalendarRange,
  Filter,
  Calendar,
  Clock,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

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
              <PopoverContent className="w-80 p-0 shadow-lg border border-border/40">
                <div className="p-4 border-b border-border/40">
                  <h4 className="font-medium">Filter Events</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Browse events by timeframe
                  </p>
                </div>

                <div className="p-4 space-y-6">
                  <div className="grid gap-2">
                    <RadioGroupItem
                      id="all-events"
                      checked={activeTab === "all"}
                      onChange={() => {
                        setActiveTab("all");
                        setFilterOpen(false);
                      }}
                      label="All Events"
                      description="View all upcoming and past events"
                      icon={<Calendar className="h-4 w-4 text-primary" />}
                    />

                    <RadioGroupItem
                      id="upcoming-events"
                      checked={activeTab === "upcoming"}
                      onChange={() => {
                        setActiveTab("upcoming");
                        setFilterOpen(false);
                      }}
                      label="Upcoming Events"
                      description="Events that haven't happened yet"
                      icon={<Clock className="h-4 w-4 text-green-500" />}
                      indicator={
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                      }
                    />

                    <RadioGroupItem
                      id="past-events"
                      checked={activeTab === "past"}
                      onChange={() => {
                        setActiveTab("past");
                        setFilterOpen(false);
                      }}
                      label="Past Events"
                      description="Events that have already occurred"
                      icon={<CalendarDays className="h-4 w-4 text-gray-400" />}
                      indicator={
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-gray-400" />
                        </div>
                      }
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab("all");
                        setFilterOpen(false);
                      }}
                    >
                      Reset
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

interface RadioGroupItemProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  indicator?: React.ReactNode;
}

function RadioGroupItem({
  id,
  checked,
  onChange,
  label,
  description,
  icon,
  indicator,
}: RadioGroupItemProps) {
  return (
    <div
      className={cn(
        "relative flex items-start p-3 rounded-md transition-all cursor-pointer",
        checked
          ? "bg-primary/5 border-primary/10 border"
          : "border border-transparent hover:bg-accent/50"
      )}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }}
      tabIndex={0}
      role="radio"
      aria-checked={checked}
    >
      <input
        type="radio"
        id={id}
        name="event-filter"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onChange();
        }}
        className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
        aria-labelledby={`${id}-label`}
      />
      <div className="flex w-full gap-3">
        {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1 space-y-1">
          <label
            id={`${id}-label`}
            htmlFor={id}
            className="font-medium text-sm flex items-center gap-2 cursor-pointer"
          >
            {label}
            {indicator && <div className="ml-1.5">{indicator}</div>}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0 flex h-5 items-center">
          <div
            className={cn(
              "h-4 w-4 rounded-full border transition-all flex items-center justify-center",
              checked
                ? "border-primary border-[5px]"
                : "border-muted-foreground/30"
            )}
          />
        </div>
      </div>
    </div>
  );
}
