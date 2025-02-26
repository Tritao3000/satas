import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { individualProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const profileData = await request.json();

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

    // Insert profile into database using Drizzle
    await db.insert(individualProfiles).values({
      userId: user.id,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone || null,
      location: profileData.location || null,
      industry: profileData.industry || null,
      role: profileData.role || null,
      description: profileData.description || null,
      linkedin: profileData.linkedin || null,
      twitter: profileData.twitter || null,
      github: profileData.github || null,
      website: profileData.website || null,
      profilePicture: null,
      coverPicture: null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating individual profile:", error);
    return NextResponse.json(
      { error: "Failed to create individual profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
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

    // Fetch profile using Drizzle
    const profile = await db
      .select()
      .from(individualProfiles)
      .where(eq(individualProfiles.userId, user.id));

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error("Error fetching individual profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch individual profile" },
      { status: 500 }
    );
  }
}
