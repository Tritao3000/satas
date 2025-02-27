import { createClient } from "./client";

// Constants for storage buckets
export const PROFILE_PICTURES_BUCKET = "profile-pictures";
export const COVER_PICTURES_BUCKET = "cover-pictures";
export const CV_BUCKET = "cvs";
export const LOGO_BUCKET = "logos";
export const BANNER_BUCKET = "banners";

// Initialize storage buckets if they don't exist
export async function initStorageBuckets() {
  const supabase = createClient();

  // Create needed buckets if they don't exist
  const buckets = [
    PROFILE_PICTURES_BUCKET,
    COVER_PICTURES_BUCKET,
    CV_BUCKET,
    LOGO_BUCKET,
    BANNER_BUCKET,
  ];

  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.getBucket(bucket);

    if (error && error.message.includes("not found")) {
      // Bucket doesn't exist, create it
      const { error: createError } = await supabase.storage.createBucket(
        bucket,
        {
          public: true, // Files will be publicly accessible
          fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
        }
      );

      if (createError) {
        console.error(`Error creating bucket ${bucket}:`, createError);
      } else {
        console.log(`Created bucket: ${bucket}`);
      }
    } else if (error) {
      console.error(`Error checking bucket ${bucket}:`, error);
    }
  }
}

// Upload a file to a specific bucket and return the public URL
export async function uploadFile(
  bucket: string,
  file: File,
  userId: string,
  fileType: string
): Promise<string | null> {
  if (!file) return null;

  const supabase = await createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileType}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return publicUrl;
}

// Delete a file from storage
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error("Error deleting file:", error);
    return false;
  }

  return true;
}

// Helper to get the file path from a public URL
export function getFilePathFromUrl(publicUrl: string): string | null {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split("/");
    // Get everything after the bucket name
    const bucketIndex = pathParts.findIndex((part) =>
      [
        PROFILE_PICTURES_BUCKET,
        COVER_PICTURES_BUCKET,
        CV_BUCKET,
        LOGO_BUCKET,
        BANNER_BUCKET,
      ].includes(part)
    );

    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join("/");
    }
    return null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}
