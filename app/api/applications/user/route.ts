import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { jobApplications, jobs, users, startupProfiles } from "@/src/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const applications = await db
      .select({
        id: jobApplications.id,
        jobId: jobApplications.jobId,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
      })
      .from(jobApplications)
      .where(eq(jobApplications.applicantId, user.id))
      .orderBy(desc(jobApplications.createdAt));

    if (applications.length === 0) {
      return NextResponse.json([]);
    }

    const jobIds = applications.map((app) => app.jobId);
    const jobsData = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        location: jobs.location,
        type: jobs.type,
        startupId: jobs.startupId,
      })
      .from(jobs)
      .where(inArray(jobs.id, jobIds));

    const jobsMap = new Map();
    jobsData.forEach((job) => {
      jobsMap.set(job.id, job);
    });

    const startupIds = jobsData.map((job) => job.startupId);
    const startupProfilesData = await db
      .select({
        userId: startupProfiles.userId,
        name: startupProfiles.name,
        logo: startupProfiles.logo,
      })
      .from(startupProfiles)
      .where(inArray(startupProfiles.userId, startupIds));

    const startupsMap = new Map();
    startupProfilesData.forEach((startup) => {
      startupsMap.set(startup.userId, startup);
    });

    const transformedData = applications.map((application) => {
      const job = jobsMap.get(application.jobId);
      const startup = job ? startupsMap.get(job.startupId) : null;

      return {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt?.toISOString(),
        job: job
          ? {
              id: job.id,
              title: job.title,
              startupId: job.startupId,
            }
          : null,
        startup: startup
          ? {
              id: startup.userId,
              name: startup.name,
              logo: startup.logo,
            }
          : null,
      };
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to load job applications" },
      { status: 500 }
    );
  }
}
