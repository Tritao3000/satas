import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userType } = await request.json();

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

    // Update user metadata in Supabase auth
    await supabase.auth.updateUser({
      data: { user_type: userType },
    });

    // Update or insert user in our database using Drizzle
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    if (existingUser.length === 0) {
      // Insert user if they don't exist
      await db.insert(users).values({
        id: user.id,
        userType,
        name: user.user_metadata?.full_name || "",
        email: user.email || "",
      });
    } else {
      // Update user type if they exist
      await db.update(users).set({ userType }).where(eq(users.id, user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user type:", error);
    return NextResponse.json(
      { error: "Failed to update user type" },
      { status: 500 }
    );
  }
}
