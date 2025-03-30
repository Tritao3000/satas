import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { jobs } from "@/src/db/schema";
import { eq, desc, or, ilike, and } from "drizzle-orm";
import { randomUUID } from "crypto";

// GET - List all jobs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get("startupId");
    const searchValue = searchParams.get("search");
    const jobType = searchParams.get("type");

    const conditions = [];

    if (startupId) {
      conditions.push(eq(jobs.startupId, startupId));
    }

    if (jobType) {
      conditions.push(eq(jobs.type, jobType));
    }

    if (searchValue) {
      conditions.push(
        or(
          ilike(jobs.title, `%${searchValue}%`),
          ilike(jobs.location, `%${searchValue}%`),
        ),
      );
    }

    let jobsList;

    if (conditions.length > 0) {
      jobsList = await db
        .select()
        .from(jobs)
        .where(and(...conditions))
        .orderBy(desc(jobs.createdAt));
    } else {
      jobsList = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    }

    return NextResponse.json(jobsList);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}

// POST - Create a new job
export async function POST(request: Request) {
  try {
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
        { status: 401 },
      );
    }

    // Create new job in database
    const newJob = await db
      .insert(jobs)
      .values({
        id: randomUUID(),
        startupId: user.id,
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
