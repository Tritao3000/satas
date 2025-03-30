import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  Link,
  Trash,
  Plus,
  MoreVertical,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  IndividualProfileFormData,
  IndividualProfileFormProps,
} from "@/lib/type";

export function IndividualProfileForm({
  profile: initialProfile,
  onSubmit,
}: IndividualProfileFormProps) {
  const router = useRouter();

  const [profile, setProfile] =
    useState<IndividualProfileFormData>(initialProfile);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPicture, setCoverPicture] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(initialProfile.profilePicture);
  const [coverPicturePreview, setCoverPicturePreview] = useState<string | null>(
    initialProfile.coverPicture
  );
  const [cvPreview, setCvPreview] = useState<string | null>(
    initialProfile.cvPath
  );

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [isCvLoading, setIsCvLoading] = useState(false);

  const [profilePictureRemoved, setProfilePictureRemoved] = useState(false);
  const [coverPictureRemoved, setCoverPictureRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cvRemoved, setCvRemoved] = useState(false);

  useEffect(() => {
    if (initialProfile.profilePicture && !profilePictureRemoved) {
      setProfilePicturePreview(initialProfile.profilePicture);
    }
    if (initialProfile.coverPicture && !coverPictureRemoved) {
      setCoverPicturePreview(initialProfile.coverPicture);
    }
    if (initialProfile.cvPath && !cvRemoved) {
      setCvPreview(initialProfile.cvPath);
    }
  }, [
    initialProfile.profilePicture,
    initialProfile.coverPicture,
    initialProfile.cvPath,
    profilePictureRemoved,
    coverPictureRemoved,
    cvRemoved,
  ]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Profile picture is too large. Maximum size is 5MB");
          return;
        }

        setIsProfileLoading(true);
        setProfilePicture(file);

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          setProfilePicturePreview(objectUrl);
          setProfilePictureRemoved(false);
          setIsProfileLoading(false);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          setIsProfileLoading(false);
        };
        img.src = objectUrl;
      } catch (error) {
        console.error("Error creating preview:", error);
        setIsProfileLoading(false);
      }
    }
  };

  const handleCoverPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      try {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Cover picture is too large. Maximum size is 10MB");
          return;
        }

        setIsCoverLoading(true);
        setCoverPicture(file);

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          setCoverPicturePreview(objectUrl);
          setCoverPictureRemoved(false);
          setIsCoverLoading(false);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          setIsCoverLoading(false);
        };
        img.src = objectUrl;
      } catch (error) {
        console.error("Error creating preview:", error);
        setIsCoverLoading(false);
      }
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      try {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("CV file is too large. Maximum size is 10MB");
          return;
        }

        setIsCvLoading(true);
        setCv(file);
        setCvPreview(file.name);
        setCvRemoved(false);
        setIsCvLoading(false);
      } catch (error) {
        console.error("Error handling CV:", error);
        setIsCvLoading(false);
      }
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setProfilePictureRemoved(true);

    const fileInput = document.getElementById(
      "profile-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveCoverPicture = () => {
    setCoverPicture(null);
    setCoverPicturePreview(null);
    setCoverPictureRemoved(true);

    const fileInput = document.getElementById(
      "cover-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveCv = () => {
    setCv(null);
    setCvPreview(null);
    setCvRemoved(true);

    const fileInput = document.getElementById("cv-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(profile, {
        profilePicture,
        coverPicture,
        cv,
        profilePictureRemoved,
        coverPictureRemoved,
        cvRemoved,
      });
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
      toast.success("Profile updated successfully");
    }
  };

  useEffect(() => {
    return () => {
      if (
        profilePicturePreview &&
        !profile.profilePicture?.includes(profilePicturePreview)
      ) {
        URL.revokeObjectURL(profilePicturePreview);
      }
      if (
        coverPicturePreview &&
        !profile.coverPicture?.includes(coverPicturePreview)
      ) {
        URL.revokeObjectURL(coverPicturePreview);
      }
    };
  }, [
    profilePicturePreview,
    coverPicturePreview,
    profile.profilePicture,
    profile.coverPicture,
  ]);

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-10">
      <div className="w-full space-y-4 relative">
        <div className="w-full h-64 relative rounded-lg overflow-hidden bg-muted">
          {isCoverLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
            </div>
          ) : coverPicturePreview ? (
            <img
              src={coverPicturePreview}
              alt="Cover Picture"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No cover image</p>
            </div>
          )}

          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border shadow-md"
                  variant="ghost"
                  size="icon"
                >
                  <MoreVertical className="h-6 w-6 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    document.getElementById("cover-upload")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {coverPicturePreview ? "Change Cover" : "Upload Cover"}
                </DropdownMenuItem>
                {coverPicturePreview && (
                  <DropdownMenuItem
                    onClick={handleRemoveCoverPicture}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove Cover
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <input
          type="file"
          id="cover-upload"
          className="hidden"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleCoverPictureChange}
        />
        <p className="text-sm text-right text-muted-foreground">
          Recommended: 1200x300px cover image (max 10MB)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="relative -mt-36 ml-4 z-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background overflow-hidden bg-white bg-muted flex items-center justify-center">
              {isProfileLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="absolute bottom-0 right-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="rounded-full h-8 w-8 p-0 bg-white hover:bg-gray-100 border shadow-md"
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      document.getElementById("profile-upload")?.click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {profilePicturePreview ? "Change Photo" : "Upload Photo"}
                  </DropdownMenuItem>
                  {profilePicturePreview && (
                    <DropdownMenuItem
                      onClick={handleRemoveProfilePicture}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remove Photo
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/png,image/jpeg,image/gif"
              onChange={handleProfilePictureChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Full Name
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="h-10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="h-10"
              required
            />
          </div>
        </div>

        <div className="space-y-8 mt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Personal Information
            </h2>
            <p className="text-muted-foreground text-sm">
              Update your personal details to help others understand your
              background
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              About Me
            </Label>
            <Textarea
              id="description"
              rows={5}
              value={profile.description || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="resize-none"
              placeholder="Describe your background, experience, and what you're looking for..."
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base">
                  Role
                </Label>
                <Input
                  id="role"
                  value={profile.role || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="e.g. Software Engineer, Product Manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-base">
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={profile.industry || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="e.g. Technology, Healthcare, Finance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-base">
                  Location
                </Label>
                <Input
                  id="location"
                  value={profile.location || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="e.g. +1 (123) 456-7890"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Curriculum Vitae (CV)
            </h3>
            <div className="w-full p-6 border border-dashed rounded-lg bg-muted/10">
              {isCvLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : cvPreview ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Resume/CV</p>
                      <p className="text-sm text-muted-foreground">
                        {cvRemoved ? "Removed" : "Uploaded"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveCv}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-8 cursor-pointer"
                  onClick={() => document.getElementById("cv-upload")?.click()}
                >
                  <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="font-medium">Upload your CV</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOC or DOCX up to 10MB
                  </p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                </div>
              )}
              <input
                type="file"
                id="cv-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleCvChange}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Online Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-base flex items-center gap-2"
                >
                  <Link className="size-4 text-primary" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={profile.website || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="linkedin"
                  className="text-base flex items-center gap-2"
                >
                  <Link className="size-4 text-primary" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={profile.linkedin || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="github"
                  className="text-base flex items-center gap-2"
                >
                  <Link className="size-4 text-primary" />
                  GitHub
                </Label>
                <Input
                  id="github"
                  value={profile.github || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      github: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="twitter"
                  className="text-base flex items-center gap-2"
                >
                  <Link className="size-4 text-primary" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={profile.twitter || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      twitter: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          Update
        </Button>
      </div>
    </form>
  );
}
