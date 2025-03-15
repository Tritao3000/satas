"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Loader2 } from "lucide-react";
import { useEvents } from "../../hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import { EventCardSkeleton } from "@/components/events/event-card-skeleton";
import Link from "next/link";
import { useProfile } from "@/components/dashboard/profile-context";
export default function EventsPage() {
  const { events, isLoading, isError } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { userType } = useProfile();

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
    if (activeTab === "upcoming") {
      const now = new Date();
      filtered = filtered.filter((event) => new Date(event.date) >= now);
    } else if (activeTab === "past") {
      const now = new Date();
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-muted-foreground text-sm">
            Discover networking events, workshops, and opportunities
          </p>
        </div>
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load events</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/50">
          <Calendar className="mx-auto size-8 text-muted-foreground" />
          <h3 className="font-medium text-lg  mt-2">No events found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search criteria or check back later for new
            opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              registerButtonDisabled={userType !== "individual"}
              key={event.id}
              event={event}
              isPublic
              link={`/events/${event.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
