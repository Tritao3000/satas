import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { events } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Retrieve a specific event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (event.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT - Update an event
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
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

    // Verify the event belongs to the current user
    const existingEvent = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.startupId, user.id)))
      .limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json(
        { error: "Event not found or not authorized" },
        { status: 403 }
      );
    }

    // Parse the date and time inputs
    const date = new Date(eventData.date);
    const startTime = eventData.startTime
      ? new Date(eventData.startTime)
      : null;
    const endTime = eventData.endTime ? new Date(eventData.endTime) : null;

    // Update the event
    const updatedEvent = await db
      .update(events)
      .set({
        title: eventData.title,
        description: eventData.description || null,
        location: eventData.location,
        date: date,
        startTime: startTime,
        endTime: endTime,
        eventImagePath:
          eventData.eventImagePath || existingEvent[0].eventImagePath,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();

    return NextResponse.json(updatedEvent[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE - Remove an event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

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

    // Verify the event belongs to the current user
    const existingEvent = await db
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.startupId, user.id)))
      .limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json(
        { error: "Event not found or not authorized" },
        { status: 403 }
      );
    }

    // Delete the event
    await db.delete(events).where(eq(events.id, eventId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
