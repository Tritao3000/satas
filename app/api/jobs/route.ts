import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { jobs } from "@/src/db/schema";
import { eq, desc, or, ilike, and } from "drizzle-orm";
import { randomUUID } from "crypto";

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
          ilike(jobs.location, `%${searchValue}%`)
        )
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
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json();

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

    const { data: startupProfile, error: startupProfileError } = await supabase
      .from("startup_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (startupProfileError) {
      console.error("Error checking startup profile:", startupProfileError);
      return NextResponse.json(
        { error: "Failed to verify startup profile" },
        { status: 500 }
      );
    }

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
      { status: 500 }
    );
  }
}
