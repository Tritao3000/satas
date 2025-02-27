import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { individualProfiles } from "@/src/db/schema";
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
      .update(individualProfiles)
      .set({
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
        profilePicture: profileData.profilePicture || null,
        coverPicture: profileData.coverPicture || null,
        cvPath: profileData.cvPath || null,
      })
      .where(eq(individualProfiles.userId, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating individual profile:", error);
    return NextResponse.json(
      { error: "Failed to update individual profile" },
      { status: 500 }
    );
  }
}
