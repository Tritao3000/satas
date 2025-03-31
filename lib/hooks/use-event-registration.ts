import { useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "../fetcher";

export const useEventRegistrationStatus = (
  eventId: string | undefined,
  userId: string | undefined
) => {
  const shouldFetch = !!eventId && !!userId;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/events/my-registrations` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 300000,
      suspense: false,
      keepPreviousData: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      shouldRetryOnError: false,
    }
  );

  const isRegistered =
    data?.registrations?.some((reg: any) => reg.eventId === eventId) || false;

  return {
    isRegistered,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useRegisterForEvent = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { mutate } = useSWRConfig();

  const register = async (eventId: string) => {
    setIsRegistering(true);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register for event");
      }

      await mutate(`/api/events/${eventId}/registrations`);
      await mutate(`/api/events/my-registrations`);

      toast("Registration successful", {
        description: "You have successfully registered for this event.",
      });

      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast("Registration failed", {
        description: error.message || "Please try again.",
      });
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    register,
    isRegistering,
  };
};

export const useUnregisterFromEvent = () => {
  const [isUnregistering, setIsUnregistering] = useState(false);
  const { mutate } = useSWRConfig();

  const unregister = async (eventId: string) => {
    setIsUnregistering(true);
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

      await mutate(`/api/events/${eventId}/registrations`);
      await mutate(`/api/events/my-registrations`);

      toast("Unregistered successfully", {
        description: "You have been removed from this event.",
      });

      return true;
    } catch (error: any) {
      console.error("Unregistration error:", error);
      toast("Unregistration failed", {
        description: error.message || "Please try again.",
      });
      return false;
    } finally {
      setIsUnregistering(false);
    }
  };

  return {
    unregister,
    isUnregistering,
  };
};
