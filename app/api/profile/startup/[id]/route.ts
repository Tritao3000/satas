import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { startupProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = await db
      .select()
      .from(startupProfiles)
      .where(eq(startupProfiles.userId, userId))
      .limit(1);

    if (!profile || profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile[0]);
  } catch (error: any) {
    console.error("Error fetching startup profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;

    const supabase = createAdminClient();
    const supabaseServer = createClient();

    const { data: userData, error: userError } = await (
      await supabaseServer
    ).auth.getUser();

    if (userError) {
      return NextResponse.json(
        { error: "Failed to get user data" },
        { status: 500 }
      );
    }

    if (userData.user?.id !== userId || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete user account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Profile deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting individual profile:", error);
    return NextResponse.json(
      { error: "Failed to delete individual profile" },
      { status: 500 }
    );
  }
}
