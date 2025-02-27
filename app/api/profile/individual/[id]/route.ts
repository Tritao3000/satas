import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { individualProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = await db
      .select()
      .from(individualProfiles)
      .where(eq(individualProfiles.userId, userId))
      .limit(1);

    if (!profile || profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile[0]);
  } catch (error: any) {
    console.error("Error fetching individual profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch individual profile" },
      { status: 500 }
    );
  }
}
