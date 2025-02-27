"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  BANNER_BUCKET,
  COVER_PICTURES_BUCKET,
  CV_BUCKET,
  LOGO_BUCKET,
  PROFILE_PICTURES_BUCKET,
} from "@/utils/supabase/storage";
import { useProfile } from "@/components/dashboard/profile-context";
import Link from "next/link";

type ProfileType = "individual" | "startup";

export default function ProfileEditPage() {
  const supabase = createClient();
  const router = useRouter();
  const { userType: contextUserType, isLoading: isProfileLoading } =
    useProfile();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);

  // Common files
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPicture, setCoverPicture] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  // Track if files were removed without replacement
  const [profilePictureRemoved, setProfilePictureRemoved] = useState(false);
  const [coverPictureRemoved, setCoverPictureRemoved] = useState(false);
  const [cvRemoved, setCvRemoved] = useState(false);

  // Individual-specific
  const [individualProfile, setIndividualProfile] = useState({
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
    profilePicture: null as string | null,
    coverPicture: null as string | null,
    cvPath: null as string | null,
  });

  // Startup-specific
  const [startupProfile, setStartupProfile] = useState({
    name: "",
    description: "",
    location: "",
    industry: "",
    stage: "",
    teamSize: "",
    foundedYear: "",
    linkedin: "",
    website: "",
    logo: null as string | null,
    banner: null as string | null,
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
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [contextUserType]);

  // Upload files and get URLs
  async function uploadFiles(userId: string) {
    try {
      let uploadedFiles: Record<string, string | null> = {};

      // For Individual Profile
      if (profileType === "individual") {
        // Profile Picture
        if (profilePicture) {
          const formData = new FormData();
          formData.append("file", profilePicture);
          formData.append("bucket", PROFILE_PICTURES_BUCKET);
          formData.append(
            "fileName",
            `${userId}-${Date.now()}-profile.${profilePicture.name.split(".").pop()}`
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
        if (coverPicture) {
          const formData = new FormData();
          formData.append("file", coverPicture);
          formData.append("bucket", COVER_PICTURES_BUCKET);
          formData.append(
            "fileName",
            `${userId}-${Date.now()}-cover.${coverPicture.name.split(".").pop()}`
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
        if (cv) {
          const formData = new FormData();
          formData.append("file", cv);
          formData.append("bucket", CV_BUCKET);
          formData.append(
            "fileName",
            `${userId}-${Date.now()}-cv.${cv.name.split(".").pop()}`
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
        if (profilePicture) {
          const formData = new FormData();
          formData.append("file", profilePicture);
          formData.append("bucket", LOGO_BUCKET);
          formData.append(
            "fileName",
            `${userId}-${Date.now()}-logo.${profilePicture.name.split(".").pop()}`
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
        if (coverPicture) {
          const formData = new FormData();
          formData.append("file", coverPicture);
          formData.append("bucket", BANNER_BUCKET);
          formData.append(
            "fileName",
            `${userId}-${Date.now()}-banner.${coverPicture.name.split(".").pop()}`
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

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get the user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload files if any
      const uploadedFiles = await uploadFiles(user.id);

      // Prepare data with existing data + any uploaded file URLs
      const formData = {
        ...individualProfile,
        ...(uploadedFiles.profilePicture && {
          profilePicture: uploadedFiles.profilePicture,
        }),
        ...(uploadedFiles.coverPicture && {
          coverPicture: uploadedFiles.coverPicture,
        }),
        ...(uploadedFiles.cvPath && { cvPath: uploadedFiles.cvPath }),
        // Set fields to null if files were removed without replacement
        ...(profilePictureRemoved &&
          !uploadedFiles.profilePicture && {
            profilePicture: null,
          }),
        ...(coverPictureRemoved &&
          !uploadedFiles.coverPicture && {
            coverPicture: null,
          }),
        ...(cvRemoved &&
          !uploadedFiles.cvPath && {
            cvPath: null,
          }),
      };

      // Update profile via API
      const response = await fetch("/api/profile/individual/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast.success("Your profile has been updated.");

      // Redirect to profile page
      router.push("/menu/profile");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleStartupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Get the user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload files if any
      const uploadedFiles = await uploadFiles(user.id);

      // Prepare data with existing data + any uploaded file URLs
      const formData = {
        ...startupProfile,
        ...(uploadedFiles.logo && { logo: uploadedFiles.logo }),
        ...(uploadedFiles.banner && { banner: uploadedFiles.banner }),
        // Set fields to null if files were removed without replacement
        ...(profilePictureRemoved &&
          !uploadedFiles.logo && {
            logo: null,
          }),
        ...(coverPictureRemoved &&
          !uploadedFiles.banner && {
            banner: null,
          }),
      };

      // Update profile via API
      const response = await fetch("/api/profile/startup/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast.success("Your startup profile has been updated.");

      // Redirect to profile page
      router.push("/menu/profile");
    } catch (error: any) {
      console.error("Error updating startup profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
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
    <div className="container py-10">
      {/* Back navigation */}
      <div className="max-w-4xl mx-auto mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/menu/profile">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information to help others know you better.
          </CardDescription>
        </CardHeader>

        {profileType === "individual" ? (
          <form onSubmit={handleIndividualSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={individualProfile.name}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={individualProfile.email}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={individualProfile.phone || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={individualProfile.location || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={individualProfile.industry || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          industry: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={individualProfile.role || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Media & Links</h3>

                  <FileUpload
                    label="Profile Picture"
                    previewUrl={individualProfile.profilePicture}
                    onChange={(file) => {
                      setProfilePicture(file);
                      setProfilePictureRemoved(file === null);
                    }}
                    previewClassName="aspect-square h-32 w-32"
                  />

                  <FileUpload
                    label="Cover Picture"
                    previewUrl={individualProfile.coverPicture}
                    onChange={(file) => {
                      setCoverPicture(file);
                      setCoverPictureRemoved(file === null);
                    }}
                    previewClassName="aspect-[3/1] h-32"
                  />

                  <FileUpload
                    label="Curriculum Vitae (CV)"
                    accept=".pdf,.doc,.docx"
                    isCV={true}
                    previewUrl={individualProfile.cvPath}
                    onChange={(file) => {
                      setCv(file);
                      setCvRemoved(file === null);
                    }}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={individualProfile.linkedin || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          linkedin: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      value={individualProfile.github || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          github: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter URL</Label>
                    <Input
                      id="twitter"
                      value={individualProfile.twitter || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          twitter: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      value={individualProfile.website || ""}
                      onChange={(e) =>
                        setIndividualProfile((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About Me</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={individualProfile.description || ""}
                  onChange={(e) =>
                    setIndividualProfile((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleStartupSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Startup Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="startup-name">Startup Name</Label>
                    <Input
                      id="startup-name"
                      value={startupProfile.name}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startup-industry">Industry</Label>
                    <Input
                      id="startup-industry"
                      value={startupProfile.industry || ""}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          industry: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startup-stage">Stage</Label>
                    <Input
                      id="startup-stage"
                      value={startupProfile.stage || ""}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          stage: e.target.value,
                        }))
                      }
                      placeholder="e.g. Seed, Series A, Growth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startup-location">Location</Label>
                    <Input
                      id="startup-location"
                      value={startupProfile.location || ""}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startup-team-size">Team Size</Label>
                    <Input
                      id="startup-team-size"
                      type="number"
                      value={startupProfile.teamSize || ""}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          teamSize: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startup-founded-year">Founded Year</Label>
                    <Input
                      id="startup-founded-year"
                      type="number"
                      value={startupProfile.foundedYear || ""}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          foundedYear: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Media & Links</h3>

                  <FileUpload
                    label="Company Logo"
                    previewUrl={startupProfile.logo}
                    onChange={(file) => {
                      setProfilePicture(file);
                      setProfilePictureRemoved(file === null);
                    }}
                    previewClassName="aspect-square h-32 w-32"
                  />

                  <FileUpload
                    label="Company Banner"
                    previewUrl={startupProfile.banner}
                    onChange={(file) => {
                      setCoverPicture(file);
                      setCoverPictureRemoved(file === null);
                    }}
                    previewClassName="aspect-[3/1] h-32"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="startup-website">Website</Label>
                    <Input
                      id="startup-website"
                      value={startupProfile.website || ""}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startup-linkedin">LinkedIn</Label>
                    <Input
                      id="startup-linkedin"
                      value={startupProfile.linkedin || ""}
                      onChange={(e) =>
                        setStartupProfile((prev) => ({
                          ...prev,
                          linkedin: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startup-description">About the Startup</Label>
                <Textarea
                  id="startup-description"
                  rows={5}
                  value={startupProfile.description || ""}
                  onChange={(e) =>
                    setStartupProfile((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
