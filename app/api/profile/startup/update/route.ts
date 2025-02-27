import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { startupProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
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

    // Update profile in database using Drizzle
    await db
      .update(startupProfiles)
      .set({
        name: profileData.name,
        description: profileData.description || null,
        logo: profileData.logo || null,
        banner: profileData.banner || null,
        location: profileData.location || null,
        industry: profileData.industry || null,
        stage: profileData.stage || null,
        teamSize: profileData.teamSize ? parseInt(profileData.teamSize) : null,
        foundedYear: profileData.foundedYear
          ? parseInt(profileData.foundedYear)
          : null,
        linkedin: profileData.linkedin || null,
        website: profileData.website || null,
      })
      .where(eq(startupProfiles.userId, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating startup profile:", error);
    return NextResponse.json(
      { error: "Failed to update startup profile" },
      { status: 500 }
    );
  }
}
