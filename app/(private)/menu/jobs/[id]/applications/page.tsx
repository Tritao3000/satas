"use client";

import { useState, use, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobWithApplications } from "@/lib/hooks/use-applications";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ViewApplication from "@/components/applications/view-application";

export default function JobApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userType, isLoading: isProfileLoading } = useProfile();

  const initialStatus = searchParams.get("status") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [activeTab, setActiveTab] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [processingApplicationIds, setProcessingApplicationIds] = useState<
    Set<string>
  >(new Set());

  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const jobId = params instanceof Promise ? use(params).id : params.id;

  useEffect(() => {
    if (debouncedSearchTerm === initialSearch && activeTab === initialStatus) {
      return;
    }

    const url = new URL(window.location.href);

    if (debouncedSearchTerm) {
      url.searchParams.set("search", debouncedSearchTerm);
    } else {
      url.searchParams.delete("search");
    }

    if (activeTab !== "all") {
      url.searchParams.set("status", activeTab);
    } else {
      url.searchParams.delete("status");
    }

    window.history.pushState({}, "", url.toString());
  }, [debouncedSearchTerm, activeTab, initialSearch, initialStatus]);

  const {
    job: jobDetails,
    applications,
    isLoading: isDataLoading,
    error,
    updateApplicationStatus: updateStatus,
  } = useJobWithApplications(jobId, {
    search: debouncedSearchTerm,
    status: activeTab !== "all" ? activeTab : undefined,
  });

  const isLoading = isDataLoading || isProfileLoading;

  useEffect(() => {
    if (!isLoading && !debouncedSearchTerm && activeTab === "all") {
      const pendingCount = applications.filter(
        (app) => app.status === "pending"
      ).length;
      const acceptedCount = applications.filter(
        (app) => app.status === "accepted"
      ).length;
      const rejectedCount = applications.filter(
        (app) => app.status === "rejected"
      ).length;

      setTotalCounts({
        all: applications.length,
        pending: pendingCount,
        accepted: acceptedCount,
        rejected: rejectedCount,
      });
    }
  }, [applications, isLoading, debouncedSearchTerm, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveTab("all");

    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    url.searchParams.delete("status");
    window.history.pushState({}, "", url.toString());
  };

  const handleUpdateStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    if (processingApplicationIds.has(applicationId)) return;

    setProcessingApplicationIds(
      new Set(processingApplicationIds.add(applicationId))
    );

    try {
      await updateStatus(applicationId, newStatus);

      toast.success(`Application ${newStatus}`, {
        description: "The applicant will be notified of this change.",
      });
    } catch (error: any) {
      toast.error("Failed to update application status", {
        description: error.message || "Please try again later.",
      });
    } finally {
      processingApplicationIds.delete(applicationId);
      setProcessingApplicationIds(new Set(processingApplicationIds));
    }
  };

  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const acceptedCount = applications.filter(
    (app) => app.status === "accepted"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  const hasActiveFilters = debouncedSearchTerm || activeTab !== "all";

  if (error) {
    return (
      <div className="container p-4">
        <Button variant="ghost" size="icon" asChild className="mb-6">
          <Link href="/menu/jobs">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to jobs</span>
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>
              An error occurred while loading data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-4 space-y-6">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            Applications for {jobDetails?.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage applications for {jobDetails?.type} position in{" "}
            {jobDetails?.location}
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={handleTabChange}>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 items-start md:items-center">
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {totalCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">
                {totalCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted
              <Badge variant="secondary" className="ml-2">
                {totalCounts.accepted}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="secondary" className="ml-2">
                {totalCounts.rejected}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 min-w-[250px]"
              disabled={isLoading}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between mb-4 rounded-md bg-muted/50 p-2 px-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Active filters:</span>
              {activeTab !== "all" && (
                <Badge
                  variant="outline"
                  className="capitalize flex items-center gap-1">
                  {activeTab === "pending" && <Clock className="h-3 w-3" />}
                  {activeTab === "accepted" && <Check className="h-3 w-3" />}
                  {activeTab === "rejected" && <X className="h-3 w-3" />}
                  Status: {activeTab}
                </Badge>
              )}
              {debouncedSearchTerm && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Search: {debouncedSearchTerm}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
              disabled={isLoading}>
              Clear filters
            </Button>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              // Table skeleton loader
              <div className="p-4">
                <div className="grid grid-cols-6 gap-4 mb-4">
                  {[
                    "Applicant",
                    "Location",
                    "Email",
                    "Applied",
                    "Status",
                    "Actions",
                    "View Application",
                  ].map((header, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
                {[1, 2, 3, 4].map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-6 gap-4 py-4 border-t">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-[130px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                {searchTerm ? (
                  <>
                    <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                    <h3 className="text-lg font-medium">
                      No matching applications
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search terms or clearing filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-4">
                      Clear Filters
                    </Button>
                  </>
                ) : activeTab !== "all" ? (
                  <>
                    <div className="mb-4 p-3 bg-muted rounded-full">
                      {activeTab === "pending" && (
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      )}
                      {activeTab === "accepted" && (
                        <Check className="h-8 w-8 text-muted-foreground" />
                      )}
                      {activeTab === "rejected" && (
                        <X className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium">
                      No {activeTab} applications
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {activeTab === "pending"
                        ? "You've processed all pending applications."
                        : activeTab === "accepted"
                          ? "You haven't accepted any applications yet."
                          : "You haven't rejected any applications yet."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mb-4 p-3 bg-muted rounded-full">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No applications yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Your job hasn't received any applications yet.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>View Application</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative group">
                                  <Link
                                    href={`/user/${application.applicant?.id}`}
                                    className="block relative">
                                    <Avatar className="h-11 w-11 border-2 border-background shadow-sm cursor-pointer group-hover:ring-2 group-hover:ring-primary/30 group-hover:scale-105 transition-all duration-200">
                                      {application.applicant?.image && (
                                        <AvatarImage
                                          className="object-cover"
                                          src={application.applicant.image}
                                          alt={
                                            application.applicant?.name ||
                                            "Applicant"
                                          }
                                        />
                                      )}
                                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                        {application.applicant?.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()
                                          .substring(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                align="center"
                                className="font-medium">
                                <p>{application.applicant?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Click to view profile
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <div>
                            <div>{application.applicant?.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {application.applicant?.location ? (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{application.applicant.location}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Not specified
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${application.applicant?.email}`}
                          className="flex items-center gap-1 text-primary hover:underline">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{application.applicant?.email}</span>
                        </a>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(application.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            application.status === "pending"
                              ? "outline"
                              : application.status === "accepted"
                                ? "default"
                                : "destructive"
                          }
                          className="flex w-fit items-center gap-1">
                          {application.status === "pending" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {application.status === "accepted" && (
                            <Check className="h-3 w-3" />
                          )}
                          {application.status === "rejected" && (
                            <X className="h-3 w-3" />
                          )}
                          <span className="capitalize">
                            {application.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {processingApplicationIds.has(application.id) ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="flex items-center gap-1 min-w-[130px] justify-between">
                            <span>Updating...</span>
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 min-w-[130px] justify-between">
                                <span>Update Status</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                disabled={application.status === "pending"}
                                onClick={() =>
                                  handleUpdateStatus(application.id, "pending")
                                }
                                className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={application.status === "accepted"}
                                onClick={() =>
                                  handleUpdateStatus(application.id, "accepted")
                                }
                                className="flex items-center gap-2 text-green-600">
                                <Check className="h-4 w-4" />
                                Accept Application
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={application.status === "rejected"}
                                onClick={() =>
                                  handleUpdateStatus(application.id, "rejected")
                                }
                                className="flex items-center gap-2 text-destructive">
                                <X className="h-4 w-4" />
                                Reject Application
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                      <TableCell>
                        <ViewApplication
                          coverLetter={application?.coverLetter}
                          cvPath={application?.cvPath}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
