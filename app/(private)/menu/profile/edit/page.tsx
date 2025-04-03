"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/use-profile-content";
import { ProfileEditSkeleton } from "@/components/profile/edit/profile-edit-skeleton";
import { IndividualProfileForm } from "@/components/profile/edit/individual-profile-form";
import { StartupProfileForm } from "@/components/profile/edit/startup-profile-form";
import { IndividualProfileFormData, StartupProfileFormData } from "@/lib/type";
import {
  ProfileType,
  uploadFiles as uploadFilesToStorage,
  FileState,
} from "@/components/profile/edit/file-upload-utils";
import { useProfileData } from "@/lib/hooks/use-profile-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Link, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ProfileDeleteDialog } from "@/components/profile/edit/profile-delete-dialog";
import { useProfileDeletion } from "@/lib/hooks/use-profile-deletion";

export default function ProfileEditPage() {
  const router = useRouter();
  const supabase = createClient();
  const { userType, isLoading: isProfileContextLoading } = useProfile();
  const { deleteProfile, isDeleting } = useProfileDeletion();
  const [fileState, setFileState] = useState<FileState>({
    profilePicture: null,
    coverPicture: null,
    cv: null,
  });

  const {
    profileData,
    isLoading: isDataLoading,
    isSubmitting,
    updateProfile,
    error,
  } = useProfileData(userType as ProfileType);

  const handleUploadFiles = async (userId: string) => {
    if (!userType) return {};
    return uploadFilesToStorage(userId, userType as ProfileType, fileState);
  };

  const handleStartupSubmit = async (
    formData: StartupProfileFormData,
    fileState: {
      profilePicture: File | null;
      coverPicture: File | null;
      profilePictureRemoved: boolean;
      coverPictureRemoved: boolean;
    }
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const uploadFileState: FileState = {
        profilePicture: fileState.profilePicture,
        coverPicture: fileState.coverPicture,
        cv: null,
      };

      const uploadedFiles = await uploadFilesToStorage(
        user.id,
        "startup",
        uploadFileState
      );

      const updatedData = {
        ...formData,
        ...(uploadedFiles.logo && { logo: uploadedFiles.logo }),
        ...(uploadedFiles.banner && { banner: uploadedFiles.banner }),
        ...(fileState.profilePictureRemoved &&
          !uploadedFiles.logo && { logo: null }),
        ...(fileState.coverPictureRemoved &&
          !uploadedFiles.banner && { banner: null }),
      };

      await updateProfile(updatedData);
      toast.dismiss();
      router.push("/menu/profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.dismiss();
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    }
  };

  const handleDeleteProfile = async () => {
    await deleteProfile();
  };

  const handleIndividualSubmit = async (
    formData: IndividualProfileFormData,
    fileState: {
      profilePicture: File | null;
      coverPicture: File | null;
      cv: File | null;
      profilePictureRemoved: boolean;
      coverPictureRemoved: boolean;
      cvRemoved: boolean;
    }
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const uploadFileState: FileState = {
        profilePicture: fileState.profilePicture,
        coverPicture: fileState.coverPicture,
        cv: fileState.cv,
      };

      const uploadedFiles = await uploadFilesToStorage(
        user.id,
        "individual",
        uploadFileState
      );

      const updatedData = {
        ...formData,
        ...(uploadedFiles.profilePicture && {
          profilePicture: uploadedFiles.profilePicture,
        }),
        ...(uploadedFiles.coverPicture && {
          coverPicture: uploadedFiles.coverPicture,
        }),
        ...(uploadedFiles.cvPath && {
          cvPath: uploadedFiles.cvPath,
        }),
        ...(fileState.profilePictureRemoved &&
          !uploadedFiles.profilePicture && { profilePicture: null }),
        ...(fileState.coverPictureRemoved &&
          !uploadedFiles.coverPicture && { coverPicture: null }),
        ...(fileState.cvRemoved && !uploadedFiles.cvPath && { cvPath: null }),
      };

      await updateProfile(updatedData);
      toast.dismiss();
      router.push("/menu/profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.dismiss();
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    }
  };

  const isLoading = isProfileContextLoading || isDataLoading;

  if (isLoading) {
    return <ProfileEditSkeleton />;
  }

  if (!userType) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            We couldn't determine your profile type. Please contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground text-sm">
              Update your profile information to help others know you better.
            </p>
          </div>
          <ProfileDeleteDialog onDelete={handleDeleteProfile} />
        </div>

        {userType === "individual" ? (
          <IndividualProfileForm
            profile={
              (profileData as IndividualProfileFormData) || {
                name: "",
                email: "",
                phone: "",
                location: "",
                industry: "",
                role: "",
                description: "",
                linkedin: "",
                twitter: "",
                github: "",
                website: "",
                profilePicture: null,
                coverPicture: null,
                cvPath: null,
              }
            }
            uploadFiles={handleUploadFiles}
            isSubmitting={isSubmitting}
            onSubmit={handleIndividualSubmit}
          />
        ) : (
          <StartupProfileForm
            profile={
              (profileData as StartupProfileFormData) || {
                name: "",
                description: "",
                location: "",
                industry: "",
                stage: "",
                teamSize: "",
                foundedYear: "",
                linkedin: "",
                website: "",
                logo: null,
                banner: null,
              }
            }
            uploadFiles={handleUploadFiles}
            isSubmitting={isSubmitting}
            onSubmit={handleStartupSubmit}
          />
        )}
      </div>
    </div>
  );
}
