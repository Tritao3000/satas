import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { jobApplications } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    console.log("Applying for job");
    const body = await request.json();
    console.log("Body:", body);
    const { jobId } = body;

    console.log("Job ID:", jobId);

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

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
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (userDataError) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    if (userData.user_type !== "individual") {
      return NextResponse.json(
        { error: "Only individuals can apply for jobs" },
        { status: 403 }
      );
    }

    // Check if user already applied for this job
    const existingApplications = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, jobId),
          eq(jobApplications.applicantId, user.id)
        )
      );

    console.log("Existing applications:", existingApplications);

    if (existingApplications.length > 0) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 400 }
      );
    }

    // Create the job application
    const newApplication = await db
      .insert(jobApplications)
      .values({
        id: randomUUID(),
        jobId: jobId,
        applicantId: user.id,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newApplication[0], { status: 201 });
  } catch (error) {
    console.error("Error applying for job:", error);
    return NextResponse.json(
      { error: "Failed to submit job application" },
      { status: 500 }
    );
  }
}
