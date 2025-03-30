"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/hooks/use-profile-content";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ProfileEditSkeleton } from "@/components/profile/edit/profile-edit-skeleton";
import {
  IndividualProfileForm,
  IndividualProfileFormData,
} from "@/components/profile/edit/individual-profile-form";
import {
  StartupProfileForm,
  StartupProfileFormData,
} from "@/components/profile/edit/startup-profile-form";
import {
  ProfileType,
  uploadFiles as uploadFilesToStorage,
  FileState,
} from "@/components/profile/edit/file-upload-utils";

export default function ProfileEditPage() {
  const { userType: contextUserType, isLoading: isProfileLoading } =
    useProfile();

  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);

  // Files for uploads
  const [fileState, setFileState] = useState<FileState>({
    profilePicture: null,
    coverPicture: null,
    cv: null,
  });

  // Individual-specific
  const [individualProfile, setIndividualProfile] =
    useState<IndividualProfileFormData>({
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
    });

  // Startup-specific
  const [startupProfile, setStartupProfile] = useState<StartupProfileFormData>({
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
  });

  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      try {
        // Use user type from context
        if (contextUserType) {
          setProfileType(contextUserType as ProfileType);

          // Fetch profile data using API endpoints that use Drizzle ORM
          if (contextUserType === "individual") {
            // Fetch user profile using API endpoint
            const response = await fetch("/api/profile/individual");
            if (!response.ok) {
              throw new Error("Failed to fetch individual profile");
            }
            const data = await response.json();

            // Update form state with fetched data
            setIndividualProfile({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              location: data.location || "",
              industry: data.industry || "",
              role: data.role || "",
              description: data.description || "",
              linkedin: data.linkedin || "",
              twitter: data.twitter || "",
              github: data.github || "",
              website: data.website || "",
              profilePicture: data.profilePicture || null,
              coverPicture: data.coverPicture || null,
              cvPath: data.cvPath || null,
            });
          } else if (contextUserType === "startup") {
            // Fetch startup profile using API endpoint
            const response = await fetch("/api/profile/startup");
            if (!response.ok) {
              throw new Error("Failed to fetch startup profile");
            }
            const data = await response.json();

            // Update form state with fetched data
            setStartupProfile({
              name: data.name || "",
              description: data.description || "",
              location: data.location || "",
              industry: data.industry || "",
              stage: data.stage || "",
              teamSize: data.teamSize ? data.teamSize.toString() : "",
              foundedYear: data.foundedYear ? data.foundedYear.toString() : "",
              linkedin: data.linkedin || "",
              website: data.website || "",
              logo: data.logo || null,
              banner: data.banner || null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [contextUserType]);

  // Wrapper for file upload
  const handleFileUpload = async (userId: string) => {
    if (!profileType) return {};
    return uploadFilesToStorage(userId, profileType, fileState);
  };

  const isLoading = loading || isProfileLoading;

  if (isLoading) {
    return <ProfileEditSkeleton />;
  }

  if (!profileType) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile Error</CardTitle>
            <CardDescription>
              We couldn't determine your profile type. Please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Back navigation */}
      <div className=" mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/menu/profile">Profile</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information to help others know you better.
          </CardDescription>
        </CardHeader>

        {profileType === "individual" ? (
          <IndividualProfileForm
            profile={individualProfile}
            uploadFiles={handleFileUpload}
          />
        ) : (
          <StartupProfileForm
            profile={startupProfile}
            uploadFiles={handleFileUpload}
          />
        )}
      </Card>
    </div>
  );
}
