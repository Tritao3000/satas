"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Loader2 } from "lucide-react";
import { useEvents } from "../../hooks/use-events";
import { EventCard } from "@/components/events/event-card";
import Link from "next/link";

export default function EventsPage() {
  const { events, isLoading, isError } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

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
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Discover networking events, workshops, and opportunities to connect
          with startups and professionals.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full md:w-auto"
          disabled={!searchTerm && activeTab === "all"}
        >
          Reset Filters
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-8"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading events...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load events</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No events found</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm
              ? "Try adjusting your search term."
              : activeTab === "upcoming"
                ? "There are no upcoming events scheduled at the moment."
                : activeTab === "past"
                  ? "There are no past events to display."
                  : "There are no events to display."}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={handleReset} className="mt-4">
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
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
