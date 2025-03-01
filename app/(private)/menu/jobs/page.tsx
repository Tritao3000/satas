'use client';

import { useEffect, useState } from 'react';
import { useJobs } from '@/app/hooks/use-jobs';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/jobs/job-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlusIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/components/dashboard/profile-context';

export default function JobsManagementPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const { userType, isLoading: isProfileLoading } = useProfile();
  const {
    jobs,
    isLoading: isJobsLoading,
    isError,
    mutate,
  } = useJobs(userId || undefined);

  useEffect(() => {
    async function getUserDetails() {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast('Authentication required');
        router.push('/sign-in');
        return;
      }

      setUserId(user.id);
    }

    getUserDetails();
  }, [router]);

  // Redirect if not a startup user
  useEffect(() => {
    if (!isProfileLoading && userType !== 'startup') {
      toast('Only startups can access this page');
      router.push('/menu');
    }
  }, [userType, isProfileLoading, router]);

  const handleDeleteJob = () => {
    mutate();
  };

  const isLoading = isProfileLoading || isJobsLoading || !userId;

  if (isLoading || userType !== 'startup') {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Job Listings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your startup's job postings
          </p>
        </div>
        <Button asChild>
          <Link href="/menu/jobs/create">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Job
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Jobs</TabsTrigger>
          <TabsTrigger value="all">All Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isJobsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center p-8 text-destructive">
              Failed to load jobs. Please try again.
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  allowEdit={true}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground mb-4">
                You haven't posted any jobs yet
              </p>
              <Button asChild>
                <Link href="/menu/jobs/create">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {isJobsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="text-center p-8 text-destructive">
              Failed to load jobs. Please try again.
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  allowEdit={true}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No jobs found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
