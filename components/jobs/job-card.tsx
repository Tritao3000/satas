"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPinIcon,
  Building2Icon,
  DollarSignIcon,
  ClockIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  MoreVertical,
  Edit,
  Trash,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Job } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type JobCardProps = {
  job: Job;
  allowEdit?: boolean;
  onDelete?: () => void;
  startupName?: string;
};

export function JobCard({
  job,
  allowEdit = false,
  onDelete,
  startupName,
}: JobCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const postedDate = formatDistanceToNow(new Date(job.createdAt), {
    addSuffix: true,
  });

  const formattedSalary = job.salary
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(job.salary)
    : "Not specified";

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Full-time":
        return "default";
      case "Part-time":
        return "secondary";
      case "Contract":
        return "outline";
      case "Remote":
        return "default";
      case "Internship":
        return "default";
      default:
        return "outline";
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete job");
      }

      toast("Job deleted successfully");

      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      toast(error.message || "Error deleting job", {
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-300 h-full flex flex-col relative",
          "hover:shadow-md hover:shadow-primary/10 hover:border-primary/30"
        )}
      >
        <Link href={`/jobs/${job.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View job details for {job.title}</span>
        </Link>

        <CardContent className="p-0 relative flex-grow">
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <Badge
                  variant={getBadgeVariant(job.type) as any}
                  className="mb-2 font-medium relative z-20"
                >
                  {job.type}
                </Badge>
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
              </div>
              {allowEdit && (
                <div className="relative z-20">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 hover:bg-background dark:bg-gray-800/80 dark:hover:bg-gray-800 shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/menu/jobs/edit/${job.id}`}
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
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2Icon className="h-4 w-4 flex-shrink-0" />
                <span>
                  Company:{" "}
                  {startupName || (job.startupId ? "Startup" : "Company")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                <span>{job.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 flex-shrink-0" />
                <span>{formattedSalary}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 flex-shrink-0" />
                <span>Posted {postedDate}</span>
              </div>
            </div>

            <p className="text-sm line-clamp-3">{job.description}</p>
          </div>
        </CardContent>

        {allowEdit && (
          <CardFooter className="p-5 pt-4 relative z-20">
            <Button asChild variant="outline" className="w-full">
              <Link
                href={`/jobs/${job.id}`}
                className="flex items-center justify-center"
              >
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </CardFooter>
        )}

        {!allowEdit && (
          <div className="absolute bottom-8 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="secondary" className="flex items-center shadow-sm">
              View details
              <ArrowRightIcon className="h-3 w-3 ml-1" />
            </Badge>
          </div>
        )}

        <div
          className={cn(
            "h-1.5 w-full mt-auto",
            job.type === "Full-time" && "bg-green-600",
            job.type === "Part-time" && "bg-amber-500",
            job.type === "Remote" && "bg-blue-500",
            job.type === "Contract" && "bg-orange-500",
            job.type === "Internship" && "bg-purple-500"
          )}
        />
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Job
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job listing? This action
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
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
