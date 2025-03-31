import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import {
  events,
  eventRegistrations,
  startupProfiles,
  users,
} from "@/src/db/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function GET() {
  try {
    // Get current user from Supabase auth (keep using Supabase just for auth)
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

    // Check if user is an individual using Drizzle instead of Supabase
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
        { error: "Only individuals can view their event registrations" },
        { status: 403 }
      );
    }

    const registrations = await db
      .select({
        id: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
        createdAt: eventRegistrations.createdAt,
      })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.registrantId, user.id))
      .orderBy(eventRegistrations.createdAt);

    if (registrations.length === 0) {
      return NextResponse.json([]);
    }

    const eventIds = registrations.map((reg) => reg.eventId);
    const eventsData = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        location: events.location,
        date: events.date,
        startTime: events.startTime,
        endTime: events.endTime,
        eventImagePath: events.eventImagePath,
        startupId: events.startupId,
      })
      .from(events)
      .where(inArray(events.id, eventIds));

    const responseData = {
      registrations,
      eventsData,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to load registrations" },
      { status: 500 }
    );
  }
}
