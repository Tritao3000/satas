import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { events, eventRegistrations, startupProfiles } from "@/src/db/schema";
import { eq, inArray, desc, gt } from "drizzle-orm";

export async function GET() {
  try {
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

    const registrations = await db
      .select({
        id: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
      })
      .from(eventRegistrations)
      .where(eq(eventRegistrations.registrantId, user.id));

    if (registrations.length === 0) {
      return NextResponse.json([]);
    }

    const eventIds = registrations.map((reg) => reg.eventId);

    const currentDate = new Date();

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
      .where(inArray(events.id, eventIds))
      .orderBy(desc(events.date));

    const startupIds = eventsData.map((event) => event.startupId);
    const startupData = await db
      .select({
        userId: startupProfiles.userId,
        name: startupProfiles.name,
        logo: startupProfiles.logo,
      })
      .from(startupProfiles)
      .where(inArray(startupProfiles.userId, startupIds));

    const startupsMap = new Map();
    startupData.forEach((startup) => {
      startupsMap.set(startup.userId, startup);
    });

    const formattedEvents = eventsData.map((event) => {
      const startup = startupsMap.get(event.startupId);

      return {
        id: event.id,
        title: event.title,
        description: event.description || "",
        location: event.location,
        date: event.date?.toISOString() || "",
        startTime: event.startTime?.toISOString() || null,
        endTime: event.endTime?.toISOString() || null,
        eventImagePath: event.eventImagePath || null,
        startup: startup
          ? {
              id: startup.userId,
              name: startup.name,
              logo: startup.logo,
            }
          : null,
      };
    });

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 }
    );
  }
}
