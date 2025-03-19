"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number | null;
  createdAt: string;
};

type JobCardProps = {
  job: Job;
  allowEdit?: boolean;
  onDelete?: () => void;
};

export function JobCard({ job, allowEdit = false, onDelete }: JobCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Format the date using date-fns
  const postedDate = formatDistanceToNow(new Date(job.createdAt), {
    addSuffix: true,
  });

  // Format salary if available
  const formattedSalary = job.salary
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(job.salary)
    : null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

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
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">{job.title}</h3>
          <Badge variant={getBadgeVariant(job.type)}>{job.type}</Badge>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mt-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>{job.location}</span>
          {formattedSalary && (
            <>
              <span className="mx-2">•</span>
              <span>{formattedSalary}</span>
            </>
          )}
          <span className="mx-2">•</span>
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{postedDate}</span>
        </div>

        <p className="text-sm mt-4 line-clamp-3">{job.description}</p>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4">
        <Button asChild variant="default">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>

        {allowEdit && (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="icon">
              <Link href={`/menu/jobs/edit/${job.id}`}>
                <PencilIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2Icon className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

// Helper function to get badge variant based on job type
function getBadgeVariant(type: string): "default" | "secondary" | "outline" {
  switch (type) {
    case "Full-time":
      return "default";
    case "Part-time":
    case "Contract":
      return "secondary";
    case "Internship":
    case "Remote":
    default:
      return "outline";
  }
}
