import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { events, eventRegistrations } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const startupId = (await params).id;

    const eventsWithRegistrations = await db
      .select({
        event: events,
        registrations: eventRegistrations,
      })
      .from(events)
      .leftJoin(eventRegistrations, eq(events.id, eventRegistrations.eventId))
      .where(eq(events.startupId, startupId))
      .orderBy(desc(events.date));

    const groupedEvents = eventsWithRegistrations.reduce(
      (acc, { event, registrations }) => {
        if (!acc[event.id]) {
          acc[event.id] = {
            ...event,
            registrations: [],
          };
        }
        if (registrations) {
          acc[event.id].registrations.push(registrations);
        }
        return acc;
      },
      {} as Record<string, any>
    );

    return NextResponse.json(Object.values(groupedEvents));
  } catch (error) {
    console.error("Error fetching startup events:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup events" },
      { status: 500 }
    );
  }
}
