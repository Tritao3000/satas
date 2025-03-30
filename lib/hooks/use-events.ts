import useSWR from "swr";
import { useCallback } from "react";

export type Event = {
  id: string;
  startupId: string;
  title: string;
  description: string | null;
  location: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  eventImagePath?: string | null;
  createdAt: string;
  updatedAt: string;
  startup?: {
    id: string;
    name: string;
    logo?: string;
  };
};

export type EventRegistration = {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    profilePicture?: string;
  };
};

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    const errorInfo = await res.json();
    (error as any).info = errorInfo;
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

export function useEvents(startupId?: string) {
  const url = startupId ? `/api/events?startupId=${startupId}` : "/api/events";

  const { data, error, isLoading, mutate } = useSWR<Event[]>(url, fetcher);

  return {
    events: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useEvent(eventId: string) {
  const { data, error, isLoading, mutate } = useSWR<Event>(
    eventId ? `/api/events/${eventId}` : null,
    fetcher,
  );

  return {
    event: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useEventRegistrations(eventId: string) {
  const { data, error, isLoading, mutate } = useSWR<EventRegistration[]>(
    eventId ? `/api/events/${eventId}/registrations` : null,
    fetcher,
  );

  return {
    registrations: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMyEventRegistrations() {
  const { data, error, isLoading, mutate } = useSWR<{
    registrations: EventRegistration[];
    eventsData: Event[];
  }>("/api/events/my-registrations", fetcher);
  console.log("data", data);
  return {
    myRegistrations: data?.registrations ?? [],
    myEvents: data?.eventsData ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
