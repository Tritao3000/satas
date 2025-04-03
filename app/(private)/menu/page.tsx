"use client";

import {
  Users,
  Calendar,
  Briefcase,
  ArrowRight,
  FileCheck,
  Building2,
  BadgeCheck,
  Clock,
  MapPin,
  CalendarDays,
  XCircle,
  Clock8,
  ExternalLinkIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useState, useEffect, ReactNode, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetcher } from "@/lib/fetcher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEvents, useMyEventRegistrations } from "@/lib/hooks/use-events";
import { useJobs } from "@/lib/hooks/use-jobs";
import { useProfile } from "@/lib/hooks/use-profile-content";

type ProfileStatus = {
  userType: "startup" | "individual";
  hasUserType: boolean;
  hasProfile: boolean;
  userId: string;
};

function Progress({
  value = 0,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={`w-full bg-muted rounded-full overflow-hidden ${className}`}
    >
      <div
        className="bg-primary h-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

type TrendInfo = {
  value: string;
  label: string;
  direction: "up" | "down" | "neutral";
};

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  trend?: TrendInfo;
  footer?: ReactNode;
};

type JobApplication = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  job?: {
    title: string;
  };
  startup?: {
    name: string;
  };
};

type Job = {
  id: string;
  title: string;
  createdAt: string;
  applicationCount: number;
};

type Event = {
  id: string;
  title: string;
  date: string;
};

type DashboardStats = {
  profileCompletion: number;
  jobsPosted: number;
  activeJobs: number;
  jobsApplied: number;
  pendingApplications: number;
  receivedApplications: number;
  acceptedApplications: number;
  events: number;
};

type DetailedJobApplication = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  applicant?: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  job?: {
    id: string;
    title: string;
    startupId: string;
  };
  startup?: {
    id: string;
    name: string;
    logo?: string;
  };
};

type DetailedJob = {
  id: string;
  title: string;
  location: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  applicationCount: number;
  startup?: {
    id: string;
    name: string;
    logo?: string;
  };
};

type DetailedEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  eventImagePath?: string;
  startup?: {
    id: string;
    name: string;
    logo?: string;
  };
};

function calculateProfileCompletion(profile: any, userType: string): number {
  if (!profile) return 0;

  let fieldsToCheck: string[] = [];

  if (userType === "individual") {
    fieldsToCheck = [
      "name",
      "email",
      "phone",
      "location",
      "industry",
      "role",
      "description",
      "linkedin",
      "cvPath",
      "profilePicture",
    ];
  } else if (userType === "startup") {
    fieldsToCheck = [
      "name",
      "description",
      "logo",
      "location",
      "industry",
      "stage",
      "teamSize",
      "foundedYear",
      "linkedin",
      "website",
    ];
  }

  if (fieldsToCheck.length === 0) return 0;

  let filledFields = fieldsToCheck.filter(
    (field) =>
      profile[field] !== null &&
      profile[field] !== undefined &&
      profile[field] !== ""
  );

  return Math.round((filledFields.length / fieldsToCheck.length) * 100);
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({
    jobs: { url: "", tested: false, success: false, message: "" },
    events: { url: "", tested: false, success: false, message: "" },
  });

  const { userId, userType, isLoading: isProfileLoading } = useProfile();

  const { data: profileStatus, error: profileStatusError } =
    useSWR<ProfileStatus>("/api/user/profile-status", fetcher);

  const { data: profile, error: profileError } = useSWR(
    () =>
      profileStatus?.userType ? `/api/profile/${profileStatus.userType}` : null,
    fetcher
  );

  const { data: dashboardStats, error: dashboardStatsError } =
    useSWR<DashboardStats>(
      () => (profileStatus?.userType ? "/api/dashboard" : null),
      fetcher,
      {
        onError: (err) =>
          console.error("Failed to fetch dashboard stats:", err),
        revalidateOnFocus: false,
        dedupingInterval: 60000,
      }
    );

  const {
    jobs: fetchedJobs = [],
    isLoading: jobsLoading,
    isError: jobsError,
  } = useJobs(userType === "startup" && userId ? userId : undefined);

  const jobs = useMemo<DetailedJob[]>(() => {
    return fetchedJobs.map((job) => {
      return {
        ...job,
        applicationCount: 0,
        startup: {
          id: job.startupId,
          name: "",
        },
      } as DetailedJob;
    });
  }, [fetchedJobs]);

  const isStartup = userType === "startup";

  const {
    myEvents: individualEvents = [],
    isLoading: individualEventsLoading,
    isError: individualEventsError,
    mutate: mutateIndividualEvents,
  } = useMyEventRegistrations();

  const eventsLoading = isStartup ? false : individualEventsLoading;
  const eventsError = isStartup ? false : individualEventsError;
  const events = isStartup ? [] : individualEvents;
  const mutateEvents = isStartup ? () => {} : mutateIndividualEvents;

  const userEvents = useMemo(() => events || [], [events]);

  useEffect(() => {
    if (!userType || !userId) return;

    const newApiStatus = { ...apiStatus };

    const jobsUrl = `/api/jobs?startupId=${userId}`;

    const currentJobsCount = jobs?.length || 0;

    if (
      apiStatus.jobs.url !== jobsUrl ||
      apiStatus.jobs.success !== !jobsError ||
      apiStatus.jobs.message !== `Fetched ${currentJobsCount} jobs` ||
      !jobsError
    ) {
      newApiStatus.jobs = {
        url: jobsUrl,
        tested: true,
        success: !jobsError,
        message: jobsError
          ? "Failed to fetch jobs"
          : `Fetched ${currentJobsCount} jobs`,
      };
    }

    if (JSON.stringify(newApiStatus.jobs) !== JSON.stringify(apiStatus.jobs)) {
      setApiStatus(newApiStatus);
    }
  }, [userType, userId, isStartup, jobsError, jobs]);

  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsLoading,
  } = useSWR<DetailedJobApplication[]>(
    () => {
      if (userType === "individual") {
        return "/api/applications/user";
      } else if (userType === "startup") {
        return "/api/applications/startup";
      }
      return null;
    },
    fetcher,
    {
      onError: (err) => console.error("Failed to fetch applications:", err),
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    if (profileStatusError) {
      router.push("/sign-in");
      return;
    }

    if (profileStatus) {
      if (!profileStatus.hasUserType) {
        router.push("/menu/profile-setup");
        return;
      }

      if (!profileStatus.hasProfile) {
        router.push(
          profileStatus.userType === "startup"
            ? "/menu/startup-profile"
            : "/menu/individual-profile"
        );
        return;
      }

      setIsLoading(false);
    }
  }, [profileStatus, profileStatusError, router]);

  const profileCompletionPercentage = useMemo(() => {
    if (dashboardStats?.profileCompletion) {
      return dashboardStats.profileCompletion;
    }

    if (!profile || !userType) return 0;
    return calculateProfileCompletion(profile, userType);
  }, [dashboardStats, profile, userType]);

  const userName = useMemo(() => {
    if (!profile) return "User";

    const type = userType || "user";
    if (type === "startup") {
      return profile.name || "Your Startup";
    } else {
      return (
        `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
        profile.name ||
        "User"
      );
    }
  }, [userType, profile]);

  if (isLoading || isProfileLoading || !profileStatus || !profile) {
    return <DashboardSkeleton />;
  }

  const jobsCount = dashboardStats?.jobsPosted || 0;
  const applicationsCount = dashboardStats?.jobsApplied || 0;
  const pendingApplicationsCount = dashboardStats?.pendingApplications || 0;
  const activePostedJobsCount = dashboardStats?.activeJobs || 0;
  const receivedApplicationsCount = dashboardStats?.receivedApplications || 0;
  const acceptedApplicationsCount = dashboardStats?.acceptedApplications || 0;
  const eventsCount = dashboardStats?.events || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Rejected
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
    }
  };

  const safeUserType = userType || "individual";

  return (
    <div className="flex-1 space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome, {userName}</h1>
          <p className="text-blue-100 max-w-xl">
            {safeUserType === "startup"
              ? "Manage your job listings, view applicants, and connect with talent from your startup dashboard."
              : "Discover job opportunities, track your applications, and advance your career from your personal dashboard."}
          </p>

          <div className="flex mt-6 gap-3">
            <Button
              asChild
              variant="default"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <Link
                href={
                  safeUserType === "startup" ? "/menu/jobs/create" : "/jobs"
                }
              >
                {safeUserType === "startup" ? "Post a Job" : "Browse Jobs"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-transparent text-white hover:bg-white/20 hover:text-white border-white/30"
            >
              <Link href="/events">Explore Events</Link>
            </Button>
          </div>

          <Badge className="absolute top-8 right-8 bg-white/10 text-white hover:bg-white/20 border-white/20">
            {safeUserType.charAt(0).toUpperCase() + safeUserType.slice(1)}{" "}
            Account
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Profile Completion"
          value={`${profileCompletionPercentage}%`}
          description={
            profileCompletionPercentage < 100
              ? "Complete your profile for better visibility"
              : "Your profile is complete"
          }
          icon={<FileCheck className="h-5 w-5 text-emerald-500" />}
          footer={
            <div className="pt-2">
              <Progress value={profileCompletionPercentage} className="h-1.5" />
            </div>
          }
        />

        {safeUserType === "startup" ? (
          <StatCard
            title="Posted Jobs"
            value={jobsCount}
            description={`${activePostedJobsCount} active jobs`}
            icon={<Briefcase className="h-5 w-5 text-blue-500" />}
          />
        ) : (
          <StatCard
            title="Jobs Applied"
            value={dashboardStats?.jobsApplied ?? applicationsCount}
            description={`${dashboardStats?.pendingApplications ?? pendingApplicationsCount} pending applications`}
            icon={<Briefcase className="h-5 w-5 text-blue-500" />}
          />
        )}

        <StatCard
          title={safeUserType === "startup" ? "Applications" : "Interviews"}
          value={
            safeUserType === "startup"
              ? receivedApplicationsCount
              : acceptedApplicationsCount
          }
          description={
            safeUserType === "startup"
              ? "Candidates applied"
              : "Accepted applications"
          }
          icon={<Users className="h-5 w-5 text-indigo-500" />}
        />

        <StatCard
          title={safeUserType === "startup" ? "Events Hosted" : "Events Joined"}
          value={dashboardStats?.events ?? eventsCount}
          description="This month"
          icon={<Calendar className="h-5 w-5 text-violet-500" />}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap w-full md:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger
            value={safeUserType === "startup" ? "applicants" : "jobs"}
          >
            {safeUserType === "startup" ? "Applicants" : "Jobs"}
          </TabsTrigger>
          {safeUserType === "individual" && (
            <TabsTrigger value="events">Events</TabsTrigger>
          )}
          {safeUserType === "startup" && (
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>
                    Your key metrics at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {safeUserType === "startup" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          Posted Jobs
                        </span>
                        <span className="text-2xl font-semibold">
                          {jobsCount}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          Active Applications
                        </span>
                        <span className="text-2xl font-semibold">
                          {receivedApplicationsCount}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          Hired Candidates
                        </span>
                        <span className="text-2xl font-semibold">
                          {acceptedApplicationsCount}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          Applications
                        </span>
                        <span className="text-2xl font-semibold">
                          {applicationsCount}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          Interviews
                        </span>
                        <span className="text-2xl font-semibold">
                          {acceptedApplicationsCount}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          Pending Applications
                        </span>
                        <span className="text-2xl font-semibold">
                          {pendingApplicationsCount}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="ml-auto"
                  >
                    <Link
                      href={
                        safeUserType === "startup"
                          ? "/menu/jobs"
                          : "/menu/applications"
                      }
                    >
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    {safeUserType === "startup"
                      ? "Recent Applications"
                      : "Recent Activity"}
                  </CardTitle>
                  <CardDescription>
                    {safeUserType === "startup"
                      ? "Latest candidates who applied to your jobs"
                      : "Your recent job applications and activities"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : (safeUserType === "startup" &&
                      (!applications || applications.length === 0)) ||
                    (safeUserType === "individual" &&
                      applicationsCount === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="mx-auto h-12 w-12 opacity-20 mb-3" />
                      <p>No recent activity to display</p>
                      <p className="text-sm">
                        {safeUserType === "startup"
                          ? "Applications to your job listings will appear here"
                          : "Your job application activity will appear here"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {safeUserType === "individual" &&
                        applications &&
                        applications.length > 0 &&
                        applications.slice(0, 3).map((application) => (
                          <div key={application.id} className="relative">
                            <div className="flex gap-4 p-4 rounded-lg border bg-card">
                              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      Applied to{" "}
                                      {application.job?.title || "Unknown Job"}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                      <span>
                                        {application.startup?.name ||
                                          "Unknown Company"}
                                      </span>
                                      <span>•</span>
                                      <span>
                                        {formatDate(application.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                  {application.status === "accepted" ? (
                                    <Badge className="bg-green-100 text-green-800">
                                      Accepted
                                    </Badge>
                                  ) : application.status === "rejected" ? (
                                    <Badge className="bg-red-100 text-red-800">
                                      Rejected
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                      {safeUserType === "startup" &&
                        applications &&
                        applications.length > 0 &&
                        applications.slice(0, 3).map((application) => (
                          <div
                            key={application.id}
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={application.applicant?.profilePicture}
                                  alt={
                                    application.applicant?.name || "Applicant"
                                  }
                                />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {application.applicant?.name
                                    ?.substring(0, 2)
                                    .toUpperCase() || "AP"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {application.applicant?.name ||
                                    "Anonymous Applicant"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Applied for{" "}
                                  {application.job?.title || "Job Position"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-xs text-muted-foreground mb-1">
                                {formatDate(application.createdAt)}
                              </div>
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Overview</CardTitle>
                  <CardDescription>
                    Your public profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4 text-center mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          safeUserType === "startup"
                            ? profile?.logo
                            : profile?.profilePicture
                        }
                        alt={userName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {safeUserType === "startup"
                          ? (
                              profile?.name?.substring(0, 2) || "CO"
                            ).toUpperCase()
                          : `${profile?.firstName?.charAt(0) || ""}${profile?.lastName?.charAt(0) || ""}`.toUpperCase() ||
                            profile?.name?.substring(0, 2)?.toUpperCase() ||
                            "US"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{userName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {safeUserType === "startup"
                          ? profile?.industry || "Technology"
                          : profile?.title || profile?.role || "Professional"}
                      </p>
                    </div>
                    <div className="w-full">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profile completion</span>
                        <span className="font-medium">
                          {profileCompletionPercentage}%
                        </span>
                      </div>
                      <Progress
                        value={profileCompletionPercentage}
                        className="h-1.5"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {safeUserType === "startup" ? (
                      <>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {profile?.location || "Location not specified"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {profile?.teamSize
                              ? `${profile?.teamSize} employees`
                              : "Company size not specified"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {profile?.role || "Experience not specified"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            {profile?.skills?.join(", ") ||
                              profile?.industry ||
                              "Skills not specified"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href="/menu/profile">Edit Profile</Link>
                  </Button>
                </CardFooter>
              </Card>

              {safeUserType === "startup" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recommended Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/menu/jobs/create">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Post New Job
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/menu/events/create">
                          <Calendar className="mr-2 h-4 w-4" />
                          Create Event
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {applicationsError ? (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="mx-auto h-12 w-12 opacity-20 mb-3" />
                  <p>Failed to load activity data</p>
                  <p className="text-sm">Please try again later</p>
                </div>
              ) : applicationsLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : safeUserType === "startup" ? (
                applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application) => (
                      <div key={application.id} className="relative">
                        <div className="flex gap-4 p-4 rounded-lg border bg-card">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">
                                  New application for{" "}
                                  {application.job?.title || "Unknown Job"}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <span>
                                    {application.applicant?.name || "Anonymous"}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {formatDate(application.createdAt)}
                                  </span>
                                </div>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-lg">
                    <Clock className="mx-auto h-10 w-10 opacity-20 mb-3" />
                    <p className="font-medium">No recent activity to display</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Activity related to your job listings will appear here
                    </p>
                    <Button variant="default" size="sm" asChild>
                      <Link href="/menu/jobs/create">Post a Job</Link>
                    </Button>
                  </div>
                )
              ) : applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="relative">
                      <div className="flex gap-4 p-4 rounded-lg border bg-card">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                Applied to{" "}
                                {application.job?.title || "Unknown Job"}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <span>
                                  {application.startup?.name ||
                                    "Unknown Company"}
                                </span>
                                <span>•</span>
                                <span>{formatDate(application.createdAt)}</span>
                              </div>
                            </div>
                            {application.status === "accepted" ? (
                              <Badge className="bg-green-100 text-green-800">
                                Accepted
                              </Badge>
                            ) : application.status === "rejected" ? (
                              <Badge className="bg-red-100 text-red-800">
                                Rejected
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <Clock className="mx-auto h-10 w-10 opacity-20 mb-3" />
                  <p className="font-medium">No recent activity to display</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your job application activity will appear here
                  </p>
                  <Button variant="default" size="sm" asChild>
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value={safeUserType === "startup" ? "applicants" : "jobs"}
          className="pt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {safeUserType === "startup"
                  ? "Recent Applicants"
                  : "Your Job Applications"}
              </CardTitle>
              <CardDescription>
                {safeUserType === "startup"
                  ? "Candidates who applied to your job listings"
                  : "Track your job application progress"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicationsError ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Failed to load applications data</p>
                  <p className="text-sm">Please try again later</p>
                </div>
              ) : applicationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              ) : safeUserType === "startup" ? (
                applications && applications.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Job Position</TableHead>
                          <TableHead>Date Applied</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={application.applicant?.profilePicture}
                                  />
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {application.applicant?.name
                                      ?.substring(0, 2)
                                      .toUpperCase() || "AP"}
                                  </AvatarFallback>
                                </Avatar>
                                <span>
                                  {application.applicant?.name || "Anonymous"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {application.job?.title || "Unknown Job"}
                            </TableCell>
                            <TableCell>
                              {formatDate(application.createdAt)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(application.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p>No applicants yet</p>
                    <p className="text-sm">
                      Post a job to start receiving applications
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      asChild
                    >
                      <Link href="/jobs/create">Post a Job</Link>
                    </Button>
                  </div>
                )
              ) : applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={application.startup?.logo} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {application.startup?.name
                              ?.substring(0, 2)
                              .toUpperCase() || "CO"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {application.job?.title || "Unknown Position"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {application.startup?.name || "Unknown Company"}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Clock8 className="mr-1 h-3 w-3" />
                            <span>
                              Applied {formatDate(application.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="mx-auto h-12 w-12 opacity-20 mb-3" />
                  <p>You haven't applied to any jobs yet</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" asChild className="ml-auto">
                <Link
                  href={
                    safeUserType === "startup"
                      ? "/menu/jobs"
                      : "/menu/applications"
                  }
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {safeUserType === "startup" && (
          <TabsContent value="jobs" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>
                  Manage your active job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobsError ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Failed to load job listings</p>
                    <p className="text-sm">Please try again later</p>
                  </div>
                ) : jobsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <Skeleton className="h-5 w-48" />
                          <div className="flex items-center gap-2 mt-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-9 w-16" />
                      </div>
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p>No job listings created yet</p>
                    <p className="text-sm">
                      Create job listings to attract talent
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      asChild
                    >
                      <Link href="/jobs/create">Post a Job</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                job.type === "fullTime"
                                  ? "default"
                                  : job.type === "partTime"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {job.type === "fullTime"
                                ? "Full-time"
                                : job.type === "partTime"
                                  ? "Part-time"
                                  : "Contract"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Posted {formatDate(job.createdAt)}
                            </span>
                            {job.applicationCount > 0 && (
                              <Badge variant="outline" className="ml-2">
                                {job.applicationCount}{" "}
                                {job.applicationCount === 1
                                  ? "applicant"
                                  : "applicants"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/jobs/${job.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" asChild className="ml-auto">
                  <Link href="/menu/jobs">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {safeUserType === "individual" && (
          <TabsContent value="events" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Events You're Attending</CardTitle>
                <CardDescription>
                  Your upcoming event registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eventsError ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Failed to load events data</p>
                    <p className="text-sm">Please try again later</p>
                  </div>
                ) : eventsLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                      <Card
                        key={i}
                        className="overflow-hidden flex flex-col h-full"
                      >
                        <Skeleton className="h-40 w-full" />
                        <CardHeader className="p-4">
                          <Skeleton className="h-5 w-3/4" />
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : userEvents?.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p>No upcoming events joined</p>
                    <p className="text-sm">
                      Register for events to network and learn
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      asChild
                    >
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userEvents.map((event) => {
                      return (
                        <Card
                          key={event.id}
                          className="overflow-hidden flex flex-col h-full"
                        >
                          <div className="aspect-video w-full bg-muted relative">
                            {event.eventImagePath ? (
                              <img
                                src={event.eventImagePath}
                                alt={event.title}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-muted">
                                <Calendar className="h-10 w-10 text-muted-foreground opacity-30" />
                              </div>
                            )}
                          </div>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg line-clamp-2">
                                {event.title}
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarDays className="mr-1 h-4 w-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              <span>{event.location || "No location"}</span>
                            </div>
                            <p className="text-sm line-clamp-2">
                              {event.description || "No description available"}
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 mt-auto">
                            <Button size="sm" asChild className="w-full">
                              <Link href={`/events/${event.id}`}>
                                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                                View Event
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" asChild className="ml-auto">
                  <Link href="/events">
                    View All Events <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  footer,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend.value} {trend.label}
          </p>
        )}
        {footer}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
        <Skeleton className="h-8 w-40 bg-white/20 mb-3" />
        <Skeleton className="h-4 w-full max-w-md bg-white/20 mb-2" />
        <Skeleton className="h-4 w-full max-w-sm bg-white/20 mb-6" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32 bg-white/20" />
          <Skeleton className="h-9 w-32 bg-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-full max-w-md" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Skeleton className="h-20 w-20 rounded-full mb-4" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
