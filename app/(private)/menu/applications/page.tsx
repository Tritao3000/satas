'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building, Calendar, BriefcaseBusiness } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import useSWR from 'swr';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

// Define types for job applications
type JobApplication = {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
    location: string;
    type: string;
    startupId: string;
  } | null;
  startup: {
    name: string;
    logo: string | null;
  } | null;
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  // Fetch user data using SWR
  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR('/api/user/me', fetcher);

  // Fetch applications data based on user type
  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsIsLoading,
  } = useSWR(
    () =>
      userData?.userType === 'individual' ? '/api/jobs/applications' : null,
    fetcher
  );

  const isLoading = userIsLoading || applicationsIsLoading;
  const error = userError || applicationsError;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="text-muted-foreground text-sm">
              Manage your job applications
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading applications...</span>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="text-muted-foreground text-sm">
              Manage your job applications
            </p>
          </div>
        </div>
        <div className="text-center py-12 text-destructive">
          Error loading applications. Please try again later.
        </div>
      </div>
    );
  }

  // Handle user type check
  if (userData?.userType !== 'individual') {
    return (
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="text-muted-foreground text-sm">
              Manage your job applications
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            This page is only available for individual users.
          </p>
          <Button asChild className="mt-4">
            <Link href="/menu">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group applications by status
  const pendingApplications = applications.filter(
    (app: JobApplication) => app.status === 'pending'
  );
  const acceptedApplications = applications.filter(
    (app: JobApplication) => app.status === 'accepted'
  );
  const rejectedApplications = applications.filter(
    (app: JobApplication) => app.status === 'rejected'
  );

  // Filter applications based on active tab
  const filteredApplications = applications?.filter((app: JobApplication) => {
    if (activeTab === 'all') return true;
    return app.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Determine which applications to display based on active tab
  const applicationsToDisplay =
    activeTab === 'all'
      ? applications
      : activeTab === 'pending'
        ? pendingApplications
        : activeTab === 'accepted'
          ? acceptedApplications
          : rejectedApplications;

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="text-muted-foreground text-sm">
            Manage your job applications
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
      <Tabs
        defaultValue="all"
        className="w-full mb-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {applicationsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {applicationsToDisplay.map((application: JobApplication) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-lg bg-muted/50 mt-6">
            <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground" />
            <h3 className="font-medium text-lg mt-2">No applications found</h3>
            <p className="text-muted-foreground text-sm">
              You haven't applied to any jobs in this category yet.
            </p>
          </div>
        )}
      </Tabs>
    </div>
  );
}

function ApplicationCard({ application }: { application: JobApplication }) {
  const statusVariant = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusClass =
    statusVariant[application.status as keyof typeof statusVariant] ||
    statusVariant.pending;
  const date = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString()
    : 'Unknown date';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          {application.startup?.logo ? (
            <Image
              src={application.startup.logo}
              alt={application.startup.name || 'Company logo'}
              width={40}
              height={40}
              className="rounded-md"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-xs">No logo</span>
            </div>
          )}
          <div>
            <CardTitle>
              {application.job?.title || 'Unknown position'}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {application.startup?.name || 'Unknown company'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <Label>Location</Label>
            <span className="text-sm">
              {application.job?.location || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <Label>Type</Label>
            <span className="text-sm">
              {application.job?.type || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <Label>Applied on</Label>
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex justify-between">
            <Label>Status</Label>
            <span className={`text-sm px-2 py-1 rounded-full ${statusClass}`}>
              {application.status}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/jobs/${application.jobId}`}>View job</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
