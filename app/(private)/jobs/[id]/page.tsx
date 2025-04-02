import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { jobs, startupProfiles } from "@/src/db/schema";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import JobDetails from "./components/job-details";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const jobId = id;
  const jobData = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);

  const job = jobData[0];

  if (!job) {
    throw new Error("Job not found");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const startup = await db
    .select({
      user_id: startupProfiles.userId,
      name: startupProfiles.name,
      logo: startupProfiles.logo,
      location: startupProfiles.location,
    })
    .from(startupProfiles)
    .where(eq(startupProfiles.userId, job.startupId))
    .limit(1);

  const startupData = startup[0];

  const formattedDate = format(new Date(job.createdAt), "MMMM d, yyyy");
  const userType = user?.user_metadata?.user_type;

  const formattedSalary = job.salary
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(job.salary)
    : "Not specified";

  return (
    <JobDetails
      job={job}
      startupData={startupData}
      formattedDate={formattedDate}
      formattedSalary={formattedSalary}
      userType={userType}
    />
  );
}
