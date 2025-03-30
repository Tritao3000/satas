"use client";

import { formatDistanceToNow, format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  Trash2Icon,
  ClockIcon,
  Users,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/lib/type";

type EventCardProps = {
  event: Event;
  allowEdit?: boolean;
  onDelete?: (eventId: string) => void;
  isPublic?: boolean;
  link?: string;
  registerButtonDisabled?: boolean;
};

export function EventCard({
  event,
  allowEdit = false,
  onDelete,
  isPublic = false,
  link,
  registerButtonDisabled = false,
}: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Format the event date
  const eventDate = format(new Date(event.date), "MMMM d, yyyy");

  // Format the times if available
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

  const cardContent = (
    <>
      {event.eventImagePath && (
        <div className="h-48 w-full relative">
          <Image
            src={event.eventImagePath}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className={event.eventImagePath ? "pt-4" : "pt-6"}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1">{event.title}</CardTitle>
            {event.startup?.name && isPublic && (
              <CardDescription className="mt-1">
                Hosted by {event.startup.name}
              </CardDescription>
            )}
          </div>
          <Badge variant={isUpcoming ? "default" : "secondary"}>
            {isUpcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-3">
        <div className="flex items-start">
          <CalendarIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
          <span>{eventDate}</span>
        </div>

        {(formattedStartTime || formattedEndTime) && (
          <div className="flex items-start">
            <ClockIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>
              {formattedStartTime && formattedEndTime
                ? `${formattedStartTime} - ${formattedEndTime}`
                : formattedStartTime || formattedEndTime}
            </span>
          </div>
        )}

        <div className="flex items-start">
          <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {event.description && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col space-y-2 pt-2">
        {isPublic ? (
          link ? (
            <Button className="w-full">View Details</Button>
          ) : (
            <Button asChild className="w-full">
              <Link href={`/events/${event.id}`}>View Details</Link>
            </Button>
          )
        ) : (
          <div className="flex space-x-2 w-full">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/events/${event.id}`}>See details</Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href={`/menu/events/${event.id}/edit`}>
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Button>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Event</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this event? This action
                    cannot be undone.
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
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          disabled={registerButtonDisabled || !isPublic || !isUpcoming}
        >
          <Users className="h-4 w-4" />
          Register
        </Button>
      </CardFooter>
    </>
  );

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {link ? (
        <Link href={link} className="flex flex-col flex-grow">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </Card>
  );
}
