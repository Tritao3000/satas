"use client";

import { use, useEffect, useState } from "react";
import { useEvent, useEventRegistrations } from "@/lib/hooks/use-events";
import {
  useRegisterForEvent,
  useUnregisterFromEvent,
  useEventRegistrationStatus,
} from "@/lib/hooks/use-event-registration";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  Users,
  Building,
  Loader2,
  UserPlusIcon,
  MoreVertical,
  Pencil,
  Trash2,
  UserRoundX,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDate, cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

const getInitial = (name?: string) => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

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
  const { userId, userType, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    if (registrations?.length) {
      console.log("First registration user data:", registrations[0]?.user);
    }
  }, [registrations]);

  const { isRegistered, isLoading: isRegistrationStatusLoading } =
    useEventRegistrationStatus(eventId, userId || undefined);

  const { register, isRegistering } = useRegisterForEvent();
  const { unregister, isUnregistering } = useUnregisterFromEvent();

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    await register(eventId);
  };

  const handleUnregister = async () => {
    await unregister(eventId);
  };

  const handleEditEvent = () => {
    router.push(`/menu/events/${eventId}/edit`);
  };

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      toast.success("Event deleted successfully");
      router.push("/menu/events");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (eventLoading || isProfileLoading || isRegistrationStatusLoading) {
    return (
      <main className="container py-6 max-w-6xl">
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-xl aspect-[21/9] bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-20 w-20 rounded-md" />
            </div>
            <div className="absolute top-4 right-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div className="space-y-2">
                <Skeleton className="h-9 w-72 mb-1" />
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-10 w-36 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>

          <div className="border rounded-lg shadow-sm overflow-hidden">
            <div className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                <div className="flex items-center p-4 md:p-6">
                  <div className="p-3 rounded-full mr-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                </div>

                <div className="flex items-center p-4 md:p-6">
                  <div className="p-3 rounded-full mr-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>

                <div className="flex items-center p-4 md:p-6">
                  <div className="p-3 rounded-full mr-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-2">
              <div className="border rounded-lg shadow-sm h-full">
                <div className="p-6 pb-2">
                  <Skeleton className="h-7 w-40 mb-4" />
                </div>
                <div className="p-6 pt-0">
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="border rounded-lg shadow-sm h-full">
                <div className="p-6 pb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                </div>
                <div className="p-6 pt-2">
                  <Skeleton className="h-5 w-40 mb-3" />
                  <div className="flex flex-wrap gap-3 mb-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="w-11 h-11 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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

  const attendees =
    registrations?.map((registration) => ({
      id: registration.id,
      userId: registration.userId,
      username:
        registration.user?.name ||
        (registration.user?.email
          ? registration.user.email.split("@")[0]
          : "User"),
      profilePicture: registration.user?.profilePicture || null,
    })) || [];

  return (
    <main className="container py-6 max-w-6xl">
      <div className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-xl aspect-[21/9] bg-gradient-to-br from-primary/5 to-primary/10">
          {event.eventImagePath ? (
            <Image
              src={event.eventImagePath}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <CalendarIcon className="h-20 w-20 text-muted-foreground/40" />
            </div>
          )}

          <div className="absolute top-4 right-4">
            <Badge
              variant={isUpcoming ? "default" : "secondary"}
              className="text-sm px-3 py-1 shadow-md"
            >
              {isUpcoming ? "Upcoming" : "Past"}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap justify-between gap-4 items-start">
            <div className="space-y-2 max-w-[70%]">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight line-clamp-2">
                  {event.title}
                </h1>
              </div>
              {event.startup?.name && (
                <div className="flex items-center text-muted-foreground">
                  <Building className="h-4 w-4 mr-2" />
                  <span>Hosted by {event.startup.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {userType === "individual" &&
                isUpcoming &&
                (isRegistered ? (
                  <Button
                    variant="outline"
                    onClick={handleUnregister}
                    disabled={isUnregistering || isRegistrationStatusLoading}
                    className="gap-2"
                    size="sm"
                  >
                    {isUnregistering || isRegistrationStatusLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserRoundX className="h-4 w-4" />
                    )}
                    Unregister
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering || isRegistrationStatusLoading}
                    className="gap-2"
                    size="sm"
                  >
                    {isRegistering || isRegistrationStatusLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlusIcon className="h-4 w-4" />
                    )}
                    Register
                  </Button>
                ))}
              {userType === "startup" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-md hover:bg-muted"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={handleEditEvent}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleOpenDeleteDialog}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        <Card className="border shadow-sm overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="flex items-center p-4 md:p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">{eventDate}</p>
                </div>
              </div>

              <div className="flex items-center p-4 md:p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <ClockIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <p className="font-medium">
                    {formattedStartTime && formattedEndTime
                      ? `${formattedStartTime} - ${formattedEndTime}`
                      : formattedStartTime ||
                        formattedEndTime ||
                        "Time not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 md:p-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPinIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>About this Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {event.description ? (
                    <p className="whitespace-pre-line leading-relaxed">
                      {event.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No description provided for this event.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                {registrationsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-40 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-9 h-9 rounded-full" />
                      ))}
                    </div>
                  </div>
                ) : attendees.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {attendees.length}{" "}
                      {attendees.length === 1 ? "person" : "people"} registered
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <TooltipProvider delayDuration={300}>
                        {attendees.slice(0, 12).map((attendee) => (
                          <Tooltip key={attendee.id}>
                            <TooltipTrigger asChild>
                              <div className="relative group">
                                <Avatar className="h-11 w-11 border-2 border-background shadow-sm cursor-pointer group-hover:ring-2 group-hover:ring-primary/30 group-hover:scale-105 transition-all duration-200">
                                  {attendee.profilePicture ? (
                                    <AvatarImage
                                      src={attendee.profilePicture}
                                      alt={attendee.username}
                                      className="object-cover"
                                    />
                                  ) : null}
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {getInitial(attendee.username)}
                                  </AvatarFallback>
                                </Avatar>
                                {attendee.userId === userId && (
                                  <div className="absolute -top-1 -right-1">
                                    <Badge
                                      variant="default"
                                      className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                                    >
                                      You
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="center"
                              className="font-medium"
                            >
                              <p>{attendee.username}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>

                      {attendees.length > 12 && (
                        <div className="h-11 w-11 rounded-full bg-muted/80 flex items-center justify-center text-sm font-medium shadow-sm hover:bg-muted transition-colors cursor-pointer">
                          +{attendees.length - 12}
                        </div>
                      )}
                    </div>

                    {attendees.length > 12 && (
                      <Button
                        variant="link"
                        className="text-xs h-auto p-0 text-muted-foreground hover:text-primary"
                      >
                        Show all attendees
                      </Button>
                    )}

                    {userType === "individual" &&
                      isUpcoming &&
                      !isRegistered && (
                        <Button
                          className="w-full mt-4"
                          onClick={handleRegister}
                          disabled={
                            isRegistering || isRegistrationStatusLoading
                          }
                        >
                          {isRegistering || isRegistrationStatusLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Users className="mr-2 h-4 w-4" />
                          )}
                          Join this Event
                        </Button>
                      )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      No one has registered for this event yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
