import {
  BANNER_BUCKET,
  COVER_PICTURES_BUCKET,
  CV_BUCKET,
  LOGO_BUCKET,
  PROFILE_PICTURES_BUCKET,
} from "@/utils/supabase/storage";

export type ProfileType = "individual" | "startup";

export interface FileState {
  profilePicture: File | null;
  coverPicture: File | null;
  cv: File | null;
}

// Upload files and get URLs
export async function uploadFiles(
  userId: string,
  profileType: ProfileType,
  files: FileState
): Promise<Record<string, string | null>> {
  try {
    let uploadedFiles: Record<string, string | null> = {};

    // For Individual Profile
    if (profileType === "individual") {
      // Profile Picture
      if (files.profilePicture) {
        const formData = new FormData();
        formData.append("file", files.profilePicture);
        formData.append("bucket", PROFILE_PICTURES_BUCKET);
        formData.append(
          "fileName",
          `${userId}-${Date.now()}-profile.${files.profilePicture.name.split(".").pop()}`
        );

        const response = await fetch("/api/profile/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const data = await response.json();
        uploadedFiles.profilePicture = data.url;
      }

      // Cover Picture
      if (files.coverPicture) {
        const formData = new FormData();
        formData.append("file", files.coverPicture);
        formData.append("bucket", COVER_PICTURES_BUCKET);
        formData.append(
          "fileName",
          `${userId}-${Date.now()}-cover.${files.coverPicture.name.split(".").pop()}`
        );

        const response = await fetch("/api/profile/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload cover picture");
        }

        const data = await response.json();
        uploadedFiles.coverPicture = data.url;
      }

      // CV
      if (files.cv) {
        const formData = new FormData();
        formData.append("file", files.cv);
        formData.append("bucket", CV_BUCKET);
        formData.append(
          "fileName",
          `${userId}-${Date.now()}-cv.${files.cv.name.split(".").pop()}`
        );

        const response = await fetch("/api/profile/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload CV");
        }

        const data = await response.json();
        uploadedFiles.cvPath = data.url;
      }
    }
    // For Startup Profile
    else if (profileType === "startup") {
      // Logo
      if (files.profilePicture) {
        const formData = new FormData();
        formData.append("file", files.profilePicture);
        formData.append("bucket", LOGO_BUCKET);
        formData.append(
          "fileName",
          `${userId}-${Date.now()}-logo.${files.profilePicture.name.split(".").pop()}`
        );

        const response = await fetch("/api/profile/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload logo");
        }

        const data = await response.json();
        uploadedFiles.logo = data.url;
      }

      // Banner
      if (files.coverPicture) {
        const formData = new FormData();
        formData.append("file", files.coverPicture);
        formData.append("bucket", BANNER_BUCKET);
        formData.append(
          "fileName",
          `${userId}-${Date.now()}-banner.${files.coverPicture.name.split(".").pop()}`
        );

        const response = await fetch("/api/profile/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload banner");
        }

        const data = await response.json();
        uploadedFiles.banner = data.url;
      }
    }

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}
