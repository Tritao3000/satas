"use client";

import { formatDistanceToNow, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  Users,
  UserRoundX,
  Loader2,
  MoreVertical,
  Edit,
  Trash,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Event } from "@/lib/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: Event;
  allowEdit?: boolean;
  onDelete?: (eventId: string) => void;
  isPublic?: boolean;
  link?: string;
  showUnRegisterButton?: boolean;
  registerButtonDisabled?: boolean;
  onUnregister?: () => void;
  onRegister?: () => void;
  isRegistering?: boolean;
  isUnregistering?: boolean;
  isRegistered?: boolean;
};

export function EventCard({
  event,
  allowEdit = false,
  onDelete,
  isPublic = false,
  link,
  showUnRegisterButton,
  registerButtonDisabled = false,
  onUnregister,
  onRegister,
  isRegistering = false,
  isUnregistering = false,
  isRegistered = false,
}: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const eventDate = format(new Date(event.date), "MMMM d, yyyy");
  const eventMonth = format(new Date(event.date), "MMM");
  const eventDay = format(new Date(event.date), "d");
  const eventYear = format(new Date(event.date), "yyyy");

  const formattedStartTime = event.startTime
    ? format(new Date(event.startTime), "h:mm a")
    : null;

  const formattedEndTime = event.endTime
    ? format(new Date(event.endTime), "h:mm a")
    : null;

  const timeRange =
    formattedStartTime && formattedEndTime
      ? `${formattedStartTime} - ${formattedEndTime}`
      : formattedStartTime
        ? `Starts at ${formattedStartTime}`
        : "Time not specified";

  const isUpcoming = new Date(event.date) >= new Date();

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(event.id);
      toast.success("Event deleted successfully");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group overflow-hidden h-full flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-all bg-card text-card-foreground">
      <div className="flex flex-col flex-grow">
        <div className="relative w-full overflow-hidden">
          {allowEdit && (
            <div
              className="absolute top-2 right-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-background/80 hover:bg-background dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full shadow-sm"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/menu/events/${event.id}/edit`}
                      className="cursor-pointer flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {link && !allowEdit ? (
            <Link href={link} className="block">
              {event.eventImagePath ? (
                <div className="h-48 w-full relative">
                  <Image
                    src={event.eventImagePath}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {isRegistered && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="default"
                        className="px-3 py-1 text-xs font-medium"
                      >
                        Registered
                      </Badge>
                    </div>
                  )}

                  <div className="absolute top-0 left-0 m-4 bg-background/90 dark:bg-gray-800/90 py-1 px-2 rounded text-center shadow-sm border border-border">
                    <div className="text-sm font-semibold">
                      {eventMonth.toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold">{eventDay}</div>
                    <div className="text-xs">{eventYear}</div>
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-muted/60 to-muted flex items-center justify-center relative">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                  {isRegistered && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="default"
                        className="px-3 py-1 text-xs font-medium"
                      >
                        Registered
                      </Badge>
                    </div>
                  )}

                  <div className="absolute top-0 left-0 m-4 bg-background/90 dark:bg-gray-800/90 py-1 px-2 rounded text-center shadow-sm border border-border">
                    <div className="text-sm font-semibold">
                      {eventMonth.toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold">{eventDay}</div>
                    <div className="text-xs">{eventYear}</div>
                  </div>
                </div>
              )}
            </Link>
          ) : (
            <Link href={`/events/${event.id}`} className="block">
              {event.eventImagePath ? (
                <div className="h-48 w-full relative">
                  <Image
                    src={event.eventImagePath}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {isRegistered && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="default"
                        className="px-3 py-1 text-xs font-medium"
                      >
                        Registered
                      </Badge>
                    </div>
                  )}

                  <div className="absolute top-0 left-0 m-4 bg-background/90 dark:bg-gray-800/90 py-1 px-2 rounded text-center shadow-sm border border-border">
                    <div className="text-sm font-semibold">
                      {eventMonth.toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold">{eventDay}</div>
                    <div className="text-xs">{eventYear}</div>
                  </div>
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-muted/60 to-muted flex items-center justify-center relative">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                  {isRegistered && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="default"
                        className="px-3 py-1 text-xs font-medium"
                      >
                        Registered
                      </Badge>
                    </div>
                  )}

                  <div className="absolute top-0 left-0 m-4 bg-background/90 dark:bg-gray-800/90 py-1 px-2 rounded text-center shadow-sm border border-border">
                    <div className="text-sm font-semibold">
                      {eventMonth.toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold">{eventDay}</div>
                    <div className="text-xs">{eventYear}</div>
                  </div>
                </div>
              )}
            </Link>
          )}
        </div>

        <div className="p-4 pb-2 flex flex-col flex-grow">
          {link && !allowEdit ? (
            <Link href={link} className="block flex-grow">
              <Badge
                variant={isUpcoming ? "default" : "secondary"}
                className="self-start"
              >
                {isUpcoming ? "Upcoming" : "Past"}
              </Badge>

              <h3 className="font-extrabold text-lg line-clamp-2 mt-1">
                {event.title}
              </h3>

              {event.startup?.name && isPublic && (
                <p className="text-sm text-muted-foreground">
                  Hosted by {event.startup.name}
                </p>
              )}

              <div className="space-y-2 text-sm flex-grow">
                <div className="flex items-start">
                  <ClockIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>
                    {formattedStartTime && formattedEndTime
                      ? `${formattedStartTime} - ${formattedEndTime}`
                      : formattedStartTime || "Time not specified"}
                  </span>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                    {event.description}
                  </p>
                )}
              </div>
            </Link>
          ) : (
            <Link href={`/events/${event.id}`} className="block flex-grow">
              <Badge
                variant={isUpcoming ? "default" : "secondary"}
                className="self-start"
              >
                {isUpcoming ? "Upcoming" : "Past"}
              </Badge>

              <h3 className="font-extrabold text-lg line-clamp-2 mt-1">
                {event.title}
              </h3>

              {event.startup?.name && isPublic && (
                <p className="text-sm text-muted-foreground">
                  Hosted by {event.startup.name}
                </p>
              )}

              <div className="space-y-2 text-sm flex-grow">
                <div className="flex items-start">
                  <ClockIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>
                    {formattedStartTime && formattedEndTime
                      ? `${formattedStartTime} - ${formattedEndTime}`
                      : formattedStartTime || "Time not specified"}
                  </span>
                </div>

                <div className="flex items-start">
                  <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                    {event.description}
                  </p>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 mt-auto">
        {isPublic ? (
          <Button
            variant={showUnRegisterButton ? "outline" : "default"}
            className="w-full"
            disabled={
              registerButtonDisabled ||
              !isPublic ||
              !isUpcoming ||
              isRegistering ||
              isUnregistering
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (showUnRegisterButton && onUnregister) {
                onUnregister();
              } else if (onRegister) {
                onRegister();
              }
            }}
          >
            {showUnRegisterButton ? (
              <>
                {isUnregistering && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {!isUnregistering && <UserRoundX className="h-4 w-4 mr-2" />}
                Unregister
              </>
            ) : (
              <>
                {isRegistering && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {!isRegistering && <Users className="h-4 w-4 mr-2" />}
                Register
              </>
            )}
          </Button>
        ) : (
          <div className="flex w-full">
            {link ? (
              <Button asChild variant="default" className="w-full">
                <Link href={link}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="default"
                className="w-full flex items-center justify-center"
              >
                <Link href={`/events/${event.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          "h-1.5 w-full mt-auto",
          isUpcoming ? "bg-green-600" : "bg-gray-400"
        )}
      />

      {allowEdit && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
