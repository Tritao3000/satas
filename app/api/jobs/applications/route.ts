import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { jobApplications, jobs, users, startupProfiles } from "@/src/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET() {
  try {
    // Get current user from Supabase auth
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

    // Check if user is an individual
    const userData = await db
      .select({ userType: users.userType })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!userData || userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userData[0].userType !== "individual") {
      return NextResponse.json(
        { error: "Only individuals can view their job applications" },
        { status: 403 }
      );
    }

    // Fetch all job applications for the user
    const applications = await db
      .select({
        id: jobApplications.id,
        jobId: jobApplications.jobId,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
      })
      .from(jobApplications)
      .where(eq(jobApplications.applicantId, user.id))
      .orderBy(jobApplications.createdAt);

    if (applications.length === 0) {
      return NextResponse.json([]);
    }

    // Get the job details for each application
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

    // Create a map for quick lookup
    const jobsMap = new Map();
    jobsData.forEach((job) => {
      jobsMap.set(job.id, job);
    });

    // Get startup profiles for the jobs
    const startupIds = jobsData.map((job) => job.startupId);
    const startupProfilesData = await db
      .select({
        userId: startupProfiles.userId,
        name: startupProfiles.name,
        logo: startupProfiles.logo,
      })
      .from(startupProfiles)
      .where(inArray(startupProfiles.userId, startupIds));

    // Create a map for quick lookup
    const startupsMap = new Map();
    startupProfilesData.forEach((startup) => {
      startupsMap.set(startup.userId, startup);
    });

    // Combine the data into the required format
    const transformedData = applications.map((application) => {
      const job = jobsMap.get(application.jobId);
      const startup = job ? startupsMap.get(job.startupId) : null;

      return {
        id: application.id,
        jobId: application.jobId,
        status: application.status,
        createdAt: application.createdAt?.toISOString(),
        job: job
          ? {
              title: job.title,
              location: job.location,
              type: job.type,
              startupId: job.startupId,
            }
          : null,
        startup: startup
          ? {
              name: startup.name,
              logo: startup.logo,
            }
          : null,
      };
    });

    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to load job applications" },
      { status: 500 }
    );
  }
}
