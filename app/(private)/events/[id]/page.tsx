"use client";

import { use, useEffect, useState } from "react";
import {
  useEvent,
  useEventRegistrations,
  type EventRegistration,
} from "@/lib/hooks/use-events";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  Users,
  ArrowLeft,
  Building,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const eventId = params instanceof Promise ? use(params).id : params.id;
  const {
    event,
    isLoading: eventLoading,
    isError: eventError,
  } = useEvent(eventId);
  const { registrations, isLoading: registrationsLoading } =
    useEventRegistrations(eventId);

  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const router = useRouter();
  const { userId, userType, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    if (userId && registrations) {
      const userRegistration = registrations.find(
        (reg) => reg.userId === userId
      );
      setIsRegistered(!!userRegistration);
    }
  }, [userId, registrations]);

  const handleRegister = async () => {
    if (!userId) {
      router.push(
        "/login?redirect=" + encodeURIComponent(`/events/${eventId}`)
      );
      return;
    }

    if (userType !== "individual") {
      toast("Registration not allowed", {
        description: "Only individual users can register for events.",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register for event");
      }

      toast("Registration successful", {
        description: "You have successfully registered for this event.",
      });
      setIsRegistered(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast("Registration failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setIsUnregistering(true);
    try {
      const response = await fetch("/api/events/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to unregister from event");
      }

      toast("Unregistered successfully", {
        description: "You have been removed from this event.",
      });
      setIsRegistered(false);
    } catch (error: any) {
      console.error("Unregistration error:", error);
      toast("Unregistration failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsUnregistering(false);
    }
  };

  if (eventLoading || isProfileLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-1" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-9 w-72 mb-2" />
                <div className="flex items-center mt-2">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              <Skeleton className="h-10 w-36" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-5 w-24" />
              </div>

              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="relative aspect-video w-full overflow-hidden rounded-lg md:max-w-3xl mx-auto">
            <Skeleton className="h-full w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-7 w-48 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>

            <div>
              <div className="bg-muted p-4 rounded-lg">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-9 h-9 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="container py-8 text-center min-h-[60vh] flex flex-col justify-center">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The event you are looking for might have been removed or doesn't
          exist.
        </p>
        <Button asChild>
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    );
  }

  const eventDate = formatDate(event.date);
  const formattedStartTime = event.startTime
    ? new Date(event.startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;
  const formattedEndTime = event.endTime
    ? new Date(event.endTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <main>
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{event.title}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {event.title}
              </h1>
              {event.startup?.name && (
                <div className="flex items-center mt-2 text-muted-foreground">
                  <Building className="h-4 w-4 mr-2" />
                  <span>Hosted by {event.startup.name}</span>
                </div>
              )}
            </div>
            <div>
              <Badge
                variant={isUpcoming ? "default" : "secondary"}
                className="mb-2"
              >
                {isUpcoming ? "Upcoming" : "Past"}
              </Badge>
            </div>

            {userType === "individual" && isUpcoming && (
              <div>
                {isRegistered ? (
                  <Button
                    variant="outline"
                    onClick={handleUnregister}
                    disabled={isUnregistering}
                  >
                    {isUnregistering && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Cancel Registration
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering || isUnregistering || isRegistered}
                  >
                    {isRegistering && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Users className="mr-2 h-4 w-4" />
                    Register for Event
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{eventDate}</span>
            </div>

            {(formattedStartTime || formattedEndTime) && (
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  {formattedStartTime && formattedEndTime
                    ? `${formattedStartTime} - ${formattedEndTime}`
                    : formattedStartTime || formattedEndTime}
                </span>
              </div>
            )}

            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <Separator />

        {event.eventImagePath && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg md:max-w-3xl mx-auto">
            <Image
              src={event.eventImagePath}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">About this Event</h2>
            <div className="prose max-w-none">
              {event.description ? (
                <p className="whitespace-pre-line">{event.description}</p>
              ) : (
                <p className="text-muted-foreground">
                  No description provided.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Attendees</h3>
              {registrationsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40 mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="w-9 h-9 rounded-full" />
                    ))}
                  </div>
                </div>
              ) : registrations && registrations.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    {registrations.length}{" "}
                    {registrations.length === 1 ? "person" : "people"}{" "}
                    registered
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {registrations
                      .slice(0, 10)
                      .map((registration: EventRegistration) => (
                        <Avatar
                          key={registration.id}
                          title={registration.user?.name || "Attendee"}
                        >
                          <AvatarImage
                            src={registration.user?.profilePicture || undefined}
                          />
                          <AvatarFallback>
                            {registration.user?.name?.charAt(0) || "A"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    {registrations.length > 10 && (
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm">
                        +{registrations.length - 10}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No one has registered for this event yet. Be the first!
                </p>
              )}

              {userType === "individual" && isUpcoming && (
                <Button
                  className="w-full mt-4"
                  onClick={handleRegister}
                  disabled={isRegistering || isUnregistering || isRegistered}
                >
                  {isRegistering && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
