import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { jobs, jobApplications } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const startupId = (await params).id;

    const jobsWithApplications = await db
      .select({
        job: jobs,
        applications: jobApplications,
      })
      .from(jobs)
      .leftJoin(jobApplications, eq(jobs.id, jobApplications.jobId))
      .where(eq(jobs.startupId, startupId))
      .orderBy(desc(jobs.createdAt));

    const groupedJobs = jobsWithApplications.reduce(
      (acc, { job, applications }) => {
        if (!acc[job.id]) {
          acc[job.id] = {
            ...job,
            applications: [],
          };
        }
        if (applications) {
          acc[job.id].applications.push(applications);
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return NextResponse.json(Object.values(groupedJobs));
  } catch (error) {
    console.error("Error fetching startup jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup jobs" },
      { status: 500 }
    );
  }
}
