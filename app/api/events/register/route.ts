import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { eventRegistrations, users } from "@/src/db/schema";
import { eq, and,  } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
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
        { status: 401 }
      );
    }

    // Check if user is an individual
    const userData = await db
      .select({ userType: users.userType })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    if (userData[0].userType !== "individual") {
      return NextResponse.json(
        { error: "Only individuals can register for events" },
        { status: 403 }
      );
    }

    // Check if user already registered for this event
    const existingRegistrations = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.registrantId, user.id)
        )
      );

    if (existingRegistrations.length > 0) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 }
      );
    }

    // Create the event registration
    const newRegistration = await db
      .insert(eventRegistrations)
      .values({
        id: randomUUID(),
        eventId: eventId,
        registrantId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newRegistration[0], { status: 201 });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}
