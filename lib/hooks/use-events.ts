import useSWR from "swr";
import { useProfile } from "./use-profile-content";
import { Event, EventRegistration } from "../type";
import { fetcher } from "../fetcher";

export function useEvents(startupId?: string) {
  const url = startupId ? `/api/events?startupId=${startupId}` : "/api/events";

  const { data, error, isLoading, mutate } = useSWR<Event[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,
  });

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
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
    }
  );

  return {
    event: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useEventOwnership(eventId: string) {
  const { userId, userType, isLoading: isProfileLoading } = useProfile();
  const { event, isLoading: isEventLoading, isError } = useEvent(eventId);

  const isOwner = !!(event && userId && event.startupId === userId);
  const canEdit = !!(userType === "startup" && isOwner);
  const isLoading = isProfileLoading || isEventLoading;

  return {
    event,
    isOwner,
    canEdit,
    isLoading,
    isError,
  };
}

export function useEventRegistrations(eventId: string) {
  const { data, error, isLoading, mutate } = useSWR<EventRegistration[]>(
    eventId ? `/api/events/${eventId}/registrations` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
    }
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
  }>("/api/events/my-registrations", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,
  });

  return {
    myRegistrations: data?.registrations ?? [],
    myEvents: data?.eventsData ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
