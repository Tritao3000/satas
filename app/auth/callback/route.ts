import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { users, individualProfiles, startupProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Check if the user has a profile type selected
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // If the user doesn't have a user_type in their metadata, redirect to profile setup
      if (!user.user_metadata?.user_type) {
        return NextResponse.redirect(`${origin}/menu/profile-setup`);
      }

      // Check if the user has created their profile
      if (user.user_metadata.user_type === "startup") {
        // Check if startup profile exists using Drizzle ORM
        const profile = await db
          .select()
          .from(startupProfiles)
          .where(eq(startupProfiles.userId, user.id));

        if (profile.length === 0) {
          return NextResponse.redirect(`${origin}/menu/startup-profile`);
        }
      } else if (user.user_metadata.user_type === "individual") {
        // Check if individual profile exists using Drizzle ORM
        const profile = await db
          .select()
          .from(individualProfiles)
          .where(eq(individualProfiles.userId, user.id));

        if (profile.length === 0) {
          return NextResponse.redirect(`${origin}/menu/individual-profile`);
        }
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/menu`);
}
