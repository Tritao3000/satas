import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { startupProfiles, individualProfiles } from "@/src/db/schema";
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
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store, max-age=0",
            Pragma: "no-cache",
          },
        }
      );
    }

    // Check if user has completed profile setup
    let hasProfile = false;
    const userType = user.user_metadata?.user_type;

    if (userType) {
      try {
        if (userType === "startup") {
          // Check if startup profile exists
          const profile = await db
            .select()
            .from(startupProfiles)
            .where(eq(startupProfiles.userId, user.id));
          hasProfile = profile.length > 0;
        } else if (userType === "individual") {
          // Check if individual profile exists
          const profile = await db
            .select()
            .from(individualProfiles)
            .where(eq(individualProfiles.userId, user.id));
          hasProfile = profile.length > 0;
        }
      } catch (dbError) {
        console.error("Error checking profile:", dbError);
      }
    }

    // Return user info with profile status and no-cache headers
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      userType: userType || null,
      hasProfile,
    });

    // Add cache control headers to prevent stale data
    response.headers.set("Cache-Control", "no-store, max-age=0");
    response.headers.set("Pragma", "no-cache");

    return response;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          Pragma: "no-cache",
        },
      }
    );
  }
}
