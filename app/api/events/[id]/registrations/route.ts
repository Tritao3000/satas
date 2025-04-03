import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { eventRegistrations, users, individualProfiles } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
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
    const cookieStore = cookies();
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const registrationsData = await db
      .select({
        id: eventRegistrations.id,
        eventId: eventRegistrations.eventId,
        registrantId: eventRegistrations.registrantId,
        createdAt: eventRegistrations.createdAt,
        userEmail: users.email,
        userName: individualProfiles.name,
        profilePicture: individualProfiles.profilePicture,
      })
      .from(eventRegistrations)
      .leftJoin(users, eq(eventRegistrations.registrantId, users.id))
      .leftJoin(
        individualProfiles,
        eq(eventRegistrations.registrantId, individualProfiles.userId)
      )
      .where(eq(eventRegistrations.eventId, eventId));

    const formattedRegistrations = registrationsData.map((registration) => {
      return {
        id: registration.id,
        eventId: registration.eventId,
        userId: registration.registrantId,
        createdAt:
          registration.createdAt?.toISOString() || new Date().toISOString(),
        user: {
          name:
            registration.userName ||
            registration.userEmail?.split("@")[0] ||
            "Unknown",
          email: registration.userEmail || "",
          profilePicture: registration.profilePicture || null,
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
