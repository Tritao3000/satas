import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const fileName = formData.get("fileName") as string;

    if (!file || !bucket || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create the file path
    const filePath = `${userId}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: `Error uploading file: ${uploadError.message}` },
        { status: 500 },
      );
    }

    // Get the public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 },
    );
  }
}
