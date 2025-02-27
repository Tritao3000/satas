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

    // Step 1: Get the user's event registrations
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

    // Step 2: Get all the event details for these registrations
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

    // Create a map for quick lookup
    const eventsMap = new Map();
    eventsData.forEach((event) => {
      eventsMap.set(event.id, event);
    });

    // Step 3: Get all the startup profiles for these events
    const startupIds = eventsData.map((event) => event.startupId);
    const startupProfilesData = await db
      .select({
        userId: startupProfiles.userId,
        name: startupProfiles.name,
        logo: startupProfiles.logo,
      })
      .from(startupProfiles)
      .where(inArray(startupProfiles.userId, startupIds));

    // Create a map for quick lookup
    const startupsMap = new Map();
    startupProfilesData.forEach((startup) => {
      startupsMap.set(startup.userId, startup);
    });

    // Step 4: Combine all the data into the desired format
    const transformedData = registrations.map((registration) => {
      const event = eventsMap.get(registration.eventId);
      const startup = event ? startupsMap.get(event.startupId) : null;

      return {
        id: registration.id,
        eventId: registration.eventId,
        createdAt: registration.createdAt?.toISOString(),
        event: event
          ? {
              id: event.id,
              title: event.title,
              description: event.description,
              location: event.location,
              date: event.date?.toISOString(),
              startTime: event.startTime?.toISOString(),
              endTime: event.endTime?.toISOString(),
              eventImagePath: event.eventImagePath,
              startupId: event.startupId,
            }
          : null,
        startup: startup
          ? {
              name: startup.name,
              logo: startup.logo,
            }
          : null,
      };
    });

    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to load registrations" },
      { status: 500 }
    );
  }
}
