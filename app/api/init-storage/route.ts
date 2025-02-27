import { NextResponse } from "next/server";
import { initStorageBuckets } from "@/utils/supabase/storage";

export async function GET() {
  try {
    await initStorageBuckets();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
    return NextResponse.json(
      { error: "Failed to initialize storage buckets" },
      { status: 500 }
    );
  }
}
