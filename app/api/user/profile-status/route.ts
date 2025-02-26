import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { individualProfiles, startupProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

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

    const response = {
      hasUserType: !!user.user_metadata?.user_type,
      userType: user.user_metadata?.user_type || null,
      hasProfile: false,
    };

    // Check if user has a profile based on their type
    if (response.userType === "startup") {
      const profile = await db
        .select()
        .from(startupProfiles)
        .where(eq(startupProfiles.userId, user.id));

      response.hasProfile = profile.length > 0;
    } else if (response.userType === "individual") {
      const profile = await db
        .select()
        .from(individualProfiles)
        .where(eq(individualProfiles.userId, user.id));

      response.hasProfile = profile.length > 0;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error checking user profile status:", error);
    return NextResponse.json(
      { error: "Failed to check user profile status" },
      { status: 500 }
    );
  }
}
