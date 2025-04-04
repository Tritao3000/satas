import useSWR from "swr";
import { fetcher } from "../fetcher";

type Applicant = {
  id: string;
  name: string;
  email: string;
  location: string | null;
  image?: string | null;
};

type Application = {
  id: string;
  jobId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  applicant: Applicant | null;
  coverLetter: string;
  cvPath: string;
};

type JobDetails = {
  id: string;
  title: string;
  startupId: string;
  type: string;
  location: string;
  createdAt: string;
};

export function useJobDetails(jobId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<JobDetails>(
    jobId ? `/api/jobs/${jobId}` : null,
    fetcher,
  );

  return {
    job: data,
    isLoading,
    error,
    mutate,
  };
}

export function useApplications(
  jobId: string | null,
  searchParams?: { search?: string; status?: string },
) {
  const getUrl = () => {
    if (!jobId) return null;

    const url = new URL(
      `/api/jobs/${jobId}/applications`,
      window.location.origin,
    );

    if (searchParams?.search) {
      url.searchParams.set("search", searchParams.search);
    }

    if (searchParams?.status && searchParams.status !== "all") {
      url.searchParams.set("status", searchParams.status);
    }

    return url.toString();
  };

  const {
    data = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Application[]>(getUrl, fetcher);

  return {
    applications: data,
    isLoading,
    error,
    mutate,
  };
}

export function useJobWithApplications(
  jobId: string | null,
  searchParams?: { search?: string; status?: string },
) {
  const {
    job,
    isLoading: isJobLoading,
    error: jobError,
    mutate: mutateJob,
  } = useJobDetails(jobId);

  const {
    applications,
    isLoading: isApplicationsLoading,
    error: applicationsError,
    mutate: mutateApplications,
  } = useApplications(jobId, searchParams);

  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: string,
  ) => {
    if (!jobId) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}/applications`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update application status",
        );
      }

      const updatedApplications = applications.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus as any } : app,
      );

      await mutateApplications(updatedApplications, {
        revalidate: true,
      });

      return true;
    } catch (error) {
      mutateApplications();
      throw error;
    }
  };

  return {
    job,
    applications,
    isLoading: isJobLoading || isApplicationsLoading,
    error: jobError || applicationsError,
    mutateJob,
    mutateApplications,
    updateApplicationStatus,
  };
}

export type { Application, JobDetails, Applicant };
