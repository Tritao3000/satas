"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Clock,
  MapPin,
  Building,
  DollarSign,
  Send,
  Building2,
  ExternalLink,
  FileText,
  Info,
  MoreVertical,
  Edit,
  Trash,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Job {
  id: string;
  startupId: string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: number | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
  [key: string]: any;
}

interface StartupData {
  user_id: string;
  name: string;
  location: string | null;
  logo?: string | null;
  [key: string]: any;
}

interface JobDetailsProps {
  job: Job;
  startupData?: StartupData | null;
  formattedDate: string;
  formattedSalary: string;
  userType?: string | null;
  userId: string;
}

export default function JobDetails({
  job,
  startupData,
  formattedDate,
  formattedSalary,
  userType,
  userId,
}: JobDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDeleteJob = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete job");
      }

      toast.success("Job deleted successfully");
      window.location.href = "/menu/jobs";
    } catch (error: any) {
      toast.error(error.message || "Error deleting job", {
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-5">
        <Card className="relative overflow-hidden shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getBadgeVariant(job.type) as any}
                    className="font-medium"
                  >
                    {job.type}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    Posted {formattedDate}
                  </span>
                </div>

                <CardTitle className="text-2xl font-bold leading-tight md:text-3xl">
                  {job.title}
                </CardTitle>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {startupData?.name && (
                    <Link
                      href={`/startup/${startupData.user_id}`}
                      className="flex items-center hover:text-primary transition-colors"
                    >
                      <Building2 className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="font-medium">{startupData.name}</span>
                    </Link>
                  )}

                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <Link
                      href={`/jobs?location=${encodeURIComponent(job.location)}`}
                      className="hover:text-primary transition-colors"
                    >
                      {job.location}
                    </Link>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2 md:mt-0">
                <Button
                  disabled={userType === "startup"}
                  size="lg"
                  className={cn(
                    "font-medium",
                    userType === "startup"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  )}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {userType === "startup"
                    ? "You own this posting"
                    : "Apply Now"}
                </Button>

                <div className="flex justify-end gap-2">
                  {startupData && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:cursor-pointer"
                            asChild
                          >
                            <Link href={`/startup/${job.startupId}`}>
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View company</span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View company profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {userType === "startup" && job.startupId === userId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/menu/jobs/edit/${job.id}`}
                            className="cursor-pointer flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Job
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                          onClick={() => setShowDeleteDialog(true)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Separator className="my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-start">
                <div className="bg-muted rounded-md p-2.5 mr-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Job Type</div>
                  <div className="text-muted-foreground">{job.type}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-muted rounded-md p-2.5 mr-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Salary</div>
                  <div className="text-muted-foreground">{formattedSalary}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-muted rounded-md p-2.5 mr-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Posted</div>
                  <div className="text-muted-foreground">{formattedDate}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-1 md:col-span-2 space-y-5">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Job Description</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm md:prose max-w-none">
                  <div className="whitespace-pre-wrap">{job.description}</div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t flex justify-end">
                <Button disabled={userType === "startup"} className="mt-4">
                  <Send className="mr-2 h-4 w-4" />
                  {userType === "startup"
                    ? "You own this posting"
                    : "Apply Now"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="col-span-1 space-y-5">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">About the Company</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {startupData ? (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-muted rounded-md p-2.5 mr-3">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Company Name</div>
                        <div className="text-muted-foreground">
                          {startupData.name}
                        </div>
                      </div>
                    </div>

                    {startupData.location && (
                      <div className="flex items-start">
                        <div className="bg-muted rounded-md p-2.5 mr-3">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Location</div>
                          <div className="text-muted-foreground">
                            {startupData.location}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 mr-3 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-6 w-56" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 mr-3 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-48" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {startupData && (
                <CardFooter className="pt-2 border-t flex-col gap-3">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/startup/${job.startupId}`}>
                      <Building className="h-4 w-4 mr-2" />
                      View Company Profile
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link
                      href={`/jobs?company=${encodeURIComponent(startupData.name)}`}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      See All Jobs
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="shadow-sm bg-muted/50 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-background rounded-full p-2 mt-0.5">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Job Details</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Job ID: {job.id.substring(0, 8)}</p>
                      <p>
                        Last updated:{" "}
                        {new Date(
                          job.updatedAt || job.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
              onClick={handleDeleteJob}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
