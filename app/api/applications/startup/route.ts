import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import {
  jobApplications,
  jobs,
  individualProfiles,
  users,
} from "@/src/db/schema";
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

    const userData = await db
      .select({ userType: users.userType })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!userData || userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userData[0].userType !== "startup") {
      return NextResponse.json(
        { error: "Only startups can view their job applications" },
        { status: 403 }
      );
    }

    const jobsList = await db
      .select({
        id: jobs.id,
        title: jobs.title,
      })
      .from(jobs)
      .where(eq(jobs.startupId, user.id));

    if (jobsList.length === 0) {
      return NextResponse.json([]);
    }

    const jobIds = jobsList.map((job) => job.id);
    const jobsMap = new Map();
    jobsList.forEach((job) => {
      jobsMap.set(job.id, job);
    });

    const applications = await db
      .select({
        id: jobApplications.id,
        jobId: jobApplications.jobId,
        applicantId: jobApplications.applicantId,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
      })
      .from(jobApplications)
      .where(inArray(jobApplications.jobId, jobIds))
      .orderBy(desc(jobApplications.createdAt));

    if (applications.length === 0) {
      return NextResponse.json([]);
    }

    const applicantIds = applications.map((app) => app.applicantId);
    const applicantsData = await db
      .select({
        userId: individualProfiles.userId,
        name: individualProfiles.name,
        profilePicture: individualProfiles.profilePicture,
      })
      .from(individualProfiles)
      .where(inArray(individualProfiles.userId, applicantIds));

    const applicantsMap = new Map();
    applicantsData.forEach((applicant) => {
      applicantsMap.set(applicant.userId, applicant);
    });

    const transformedData = applications.map((application) => {
      const job = jobsMap.get(application.jobId);
      const applicant = applicantsMap.get(application.applicantId);

      return {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt?.toISOString(),
        job: job
          ? {
              id: job.id,
              title: job.title,
              startupId: user.id,
            }
          : null,
        applicant: applicant
          ? {
              id: applicant.userId,
              name: applicant.name,
              profilePicture: applicant.profilePicture,
            }
          : null,
      };
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching startup job applications:", error);
    return NextResponse.json(
      { error: "Failed to load applications" },
      { status: 500 }
    );
  }
}
