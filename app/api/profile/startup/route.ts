import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { startupProfiles } from "@/src/db/schema";
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
    await db.insert(startupProfiles).values({
      userId: user.id,
      name: profileData.name,
      description: profileData.description || null,
      logo: null,
      banner: null,
      location: profileData.location || null,
      industry: profileData.industry || null,
      stage: profileData.stage || null,
      teamSize: profileData.teamSize ? parseInt(profileData.teamSize) : null,
      foundedYear: profileData.foundedYear
        ? parseInt(profileData.foundedYear)
        : null,
      linkedin: profileData.linkedin || null,
      website: profileData.website || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating startup profile:", error);
    return NextResponse.json(
      { error: "Failed to create startup profile" },
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
      .from(startupProfiles)
      .where(eq(startupProfiles.userId, user.id));

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error("Error fetching startup profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup profile" },
      { status: 500 }
    );
  }
}
