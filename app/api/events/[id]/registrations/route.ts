import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { eventRegistrations, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const awaitedParams = await params;
  const eventId = awaitedParams.id;

  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check authentication
    const cookieStore = cookies();
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Query registrations for this event
    const registrationsData = await db
      .select({
        id: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
        registrantId: eventRegistrations.registrantId,
        createdAt: eventRegistrations.createdAt,
        userEmail: users.email,
      })
      .from(eventRegistrations)
      .leftJoin(users, eq(eventRegistrations.registrantId, users.id))
      .where(eq(eventRegistrations.eventId, eventId));

    // Format the data to match the expected structure
    const formattedRegistrations = registrationsData.map((registration) => {
      return {
        id: registration.id,
        eventId: registration.eventId,
        registrantId: registration.registrantId,
        createdAt:
          registration.createdAt?.toISOString() || new Date().toISOString(),
        user: {
          name: registration.userEmail?.split("@")[0] || "Unknown", // Use email username as name for now
          email: registration.userEmail || "",
          // profilePicture will be undefined since we don't have it in the schema yet
        },
      };
    });

    return NextResponse.json(formattedRegistrations);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
