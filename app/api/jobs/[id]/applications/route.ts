import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import {
  jobApplications,
  jobs,
  users,
  individualProfiles,
} from "@/src/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jobId = (await params).id;
    const { searchParams } = new URL(request.url);

    const searchTerm = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || "";

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

    const jobDetails = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.startupId, user.id)))
      .limit(1);

    if (jobDetails.length === 0) {
      return NextResponse.json(
        { error: "Job not found or unauthorized" },
        { status: 403 }
      );
    }

    const applications = await db
      .select({
        id: jobApplications.id,
        jobId: jobApplications.jobId,
        applicantId: jobApplications.applicantId,
        status: jobApplications.status,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
      })
      .from(jobApplications)
      .where(eq(jobApplications.jobId, jobId));

    if (applications.length === 0) {
      return NextResponse.json([]);
    }

    const applicantIds = applications.map((app) => app.applicantId);
    const applicants = await db
      .select({
        userId: individualProfiles.userId,
        name: individualProfiles.name,
        email: users.email,
        location: individualProfiles.location,
        profilePicture: individualProfiles.profilePicture,
      })
      .from(individualProfiles)
      .innerJoin(users, eq(individualProfiles.userId, users.id))
      .where(inArray(individualProfiles.userId, applicantIds));

    const applicantMap = new Map();
    applicants.forEach((applicant) => {
      applicantMap.set(applicant.userId, applicant);
    });

    let transformedData = applications.map((application) => {
      const applicant = applicantMap.get(application.applicantId);

      return {
        id: application.id,
        jobId: application.jobId,
        status: application.status,
        createdAt: application.createdAt?.toISOString(),
        updatedAt: application.updatedAt?.toISOString(),
        applicant: applicant
          ? {
              id: applicant.userId,
              name: applicant.name,
              email: applicant.email,
              location: applicant.location,
              image: applicant.profilePicture,
            }
          : null,
      };
    });

    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      transformedData = transformedData.filter((app) => app.status === status);
    }

    if (searchTerm) {
      transformedData = transformedData.filter(
        (app) =>
          app.applicant?.name.toLowerCase().includes(searchTerm) ||
          app.applicant?.email.toLowerCase().includes(searchTerm) ||
          (app.applicant?.location &&
            app.applicant.location.toLowerCase().includes(searchTerm))
      );
    }

    transformedData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to load job applications" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const jobId = (await params).id;
    const { applicationId, status } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be pending, accepted, or rejected" },
        { status: 400 }
      );
    }

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

    const jobDetails = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.startupId, user.id)))
      .limit(1);

    if (jobDetails.length === 0) {
      return NextResponse.json(
        { error: "Job not found or unauthorized" },
        { status: 403 }
      );
    }

    const existingApplication = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.id, applicationId),
          eq(jobApplications.jobId, jobId)
        )
      )
      .limit(1);

    if (existingApplication.length === 0) {
      return NextResponse.json(
        { error: "Application not found or does not belong to this job" },
        { status: 404 }
      );
    }

    const updatedApplication = await db
      .update(jobApplications)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(eq(jobApplications.id, applicationId))
      .returning();

    return NextResponse.json(updatedApplication[0]);
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
