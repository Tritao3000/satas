import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { jobs } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Retrieve a specific job
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const awaitedParams = await params;
    const jobId = awaitedParams.id;

    const job = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);

    if (job.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job[0]);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// PUT - Update a job
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const awaitedParams = await params;
    const jobId = awaitedParams.id;
    const jobData = await request.json();

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

    // Verify the job belongs to the current user
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.startupId, user.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return NextResponse.json(
        { error: "Job not found or not authorized" },
        { status: 403 }
      );
    }

    // Update the job
    const updatedJob = await db
      .update(jobs)
      .set({
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary || null,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId))
      .returning();

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a job
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const awaitedParams = await params;
    const jobId = awaitedParams.id;

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

    // Verify the job belongs to the current user
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.startupId, user.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return NextResponse.json(
        { error: "Job not found or not authorized" },
        { status: 403 }
      );
    }

    // Delete the job
    await db.delete(jobs).where(eq(jobs.id, jobId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
