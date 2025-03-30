import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { eventRegistrations } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 },
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
        { status: 401 },
      );
    }

    // Check if registration exists
    const existingRegistrations = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.registrantId, user.id),
        ),
      );

    if (existingRegistrations.length === 0) {
      return NextResponse.json(
        { error: "You are not registered for this event" },
        { status: 400 },
      );
    }

    // Delete the registration
    await db
      .delete(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.registrantId, user.id),
        ),
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    return NextResponse.json(
      { error: "Failed to unregister from event" },
      { status: 500 },
    );
  }
}
