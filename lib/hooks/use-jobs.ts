import useSWR from "swr";
import { Job } from "../type";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    const errorData = await res.json().catch(() => ({}));
    (error as any).info = errorData;
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

export function useJobs(startupId?: string) {
  const url = startupId ? `/api/jobs?startupId=${startupId}` : "/api/jobs";

  const { data, error, isLoading, mutate } = useSWR<Job[]>(url, fetcher);

  return {
    jobs: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useJob(jobId: string) {
  const { data, error, isLoading, mutate } = useSWR<Job>(
    jobId ? `/api/jobs/${jobId}` : null,
    fetcher,
  );

  return {
    job: data,
    isLoading,
    isError: error,
    mutate,
  };
}
