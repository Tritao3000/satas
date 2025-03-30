import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { startupProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
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

    const profile = await db
      .select()
      .from(startupProfiles)
      .where(eq(startupProfiles.userId, user.id))
      .then((res) => res[0] || null);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching startup profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup profile" },
      { status: 500 }
    );
  }
}
