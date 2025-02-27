import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { events } from "@/src/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { randomUUID } from "crypto";

// GET - List all events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get("startupId");

    // Build the query based on conditions
    let baseQuery = db.select().from(events);

    // Execute the query with conditional filters
    const eventsList = await (startupId
      ? baseQuery
          .where(eq(events.startupId, startupId))
          .orderBy(desc(events.date))
      : baseQuery.orderBy(desc(events.date)));

    return NextResponse.json(eventsList);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST - Create a new event
export async function POST(request: Request) {
  try {
    const eventData = await request.json();

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

    // Check if user is a startup
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

    if (userData.user_type !== "startup") {
      return NextResponse.json(
        { error: "Only startups can create events" },
        { status: 403 }
      );
    }

    // Parse the date and time inputs
    const date = new Date(eventData.date);
    const startTime = eventData.startTime
      ? new Date(eventData.startTime)
      : null;
    const endTime = eventData.endTime ? new Date(eventData.endTime) : null;

    // Create new event in database
    const newEvent = await db
      .insert(events)
      .values({
        id: randomUUID(),
        startupId: user.id,
        title: eventData.title,
        description: eventData.description || null,
        location: eventData.location,
        date: date,
        startTime: startTime,
        endTime: endTime,
        eventImagePath: eventData.eventImagePath || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
