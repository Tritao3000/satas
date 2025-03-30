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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StartupProfileFormData, StartupProfileFormProps } from "@/lib/type";

export function StartupProfileForm({
  profile: initialProfile,
  uploadFiles,
  isSubmitting = false,
  onSubmit,
}: StartupProfileFormProps) {
  const router = useRouter();

  const [profile, setProfile] =
    useState<StartupProfileFormData>(initialProfile);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPicture, setCoverPicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(initialProfile.logo);
  const [coverPicturePreview, setCoverPicturePreview] = useState<string | null>(
    initialProfile.banner
  );

  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const [isBannerLoading, setIsBannerLoading] = useState(false);

  const [profilePictureRemoved, setProfilePictureRemoved] = useState(false);
  const [coverPictureRemoved, setCoverPictureRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialProfile.logo && !profilePictureRemoved) {
      setProfilePicturePreview(initialProfile.logo);
    }
    if (initialProfile.banner && !coverPictureRemoved) {
      setCoverPicturePreview(initialProfile.banner);
    }
  }, [
    initialProfile.logo,
    initialProfile.banner,
    profilePictureRemoved,
    coverPictureRemoved,
  ]);

  const createFilePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Logo file is too large. Maximum size is 5MB");
          return;
        }

        setIsLogoLoading(true);
        setProfilePicture(file);

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          setProfilePicturePreview(objectUrl);
          setProfilePictureRemoved(false);
          setIsLogoLoading(false);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          setIsLogoLoading(false);
        };
        img.src = objectUrl;
      } catch (error) {
        console.error("Error creating preview:", error);
        setIsLogoLoading(false);
      }
    }
  };

  const handleCoverPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      try {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Banner file is too large. Maximum size is 10MB");
          return;
        }

        setIsBannerLoading(true);
        setCoverPicture(file);

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          setCoverPicturePreview(objectUrl);
          setCoverPictureRemoved(false);
          setIsBannerLoading(false);
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          setIsBannerLoading(false);
        };
        img.src = objectUrl;
      } catch (error) {
        console.error("Error creating preview:", error);
        setIsBannerLoading(false);
      }
    }
  };

  const handleRemoveLogo = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setProfilePictureRemoved(true);

    const fileInput = document.getElementById(
      "logo-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveBanner = () => {
    setCoverPicture(null);
    setCoverPicturePreview(null);
    setCoverPictureRemoved(true);

    const fileInput = document.getElementById(
      "banner-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(profile, {
        profilePicture,
        coverPicture,
        profilePictureRemoved,
        coverPictureRemoved,
      });

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
      toast.success("Profile updated successfully!");
    }
  };

  useEffect(() => {
    return () => {
      if (
        profilePicturePreview &&
        !profile.logo?.includes(profilePicturePreview)
      ) {
        URL.revokeObjectURL(profilePicturePreview);
      }
      if (
        coverPicturePreview &&
        !profile.banner?.includes(coverPicturePreview)
      ) {
        URL.revokeObjectURL(coverPicturePreview);
      }
    };
  }, [
    profilePicturePreview,
    coverPicturePreview,
    profile.logo,
    profile.banner,
  ]);

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-10">
      <div className="w-full space-y-4 relative">
        <div className="w-full h-64 relative rounded-lg overflow-hidden bg-muted">
          {isBannerLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
            </div>
          ) : coverPicturePreview ? (
            <img
              src={coverPicturePreview}
              alt="Company Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No banner image</p>
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
                    document.getElementById("banner-upload")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {coverPicturePreview ? "Change Banner" : "Upload Banner"}
                </DropdownMenuItem>
                {coverPicturePreview && (
                  <DropdownMenuItem
                    onClick={handleRemoveBanner}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove Banner
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <input
          type="file"
          id="banner-upload"
          className="hidden"
          accept="image/png,image/jpeg,image/gif"
          onChange={handleCoverPictureChange}
        />
        <p className="text-sm text-right text-muted-foreground">
          Recommended: 1200x300px banner image (max 10MB)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="relative -mt-36 ml-4 z-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background overflow-hidden bg-white bg-muted flex items-center justify-center">
              {isLogoLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Company Logo"
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
                      document.getElementById("logo-upload")?.click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {profilePicturePreview ? "Change Logo" : "Upload Logo"}
                  </DropdownMenuItem>
                  {profilePicturePreview && (
                    <DropdownMenuItem
                      onClick={handleRemoveLogo}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remove Logo
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/png,image/jpeg,image/gif"
              onChange={handleProfilePictureChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
          <div className="space-y-2">
            <Label htmlFor="startup-name" className="text-base">
              Name
            </Label>
            <Input
              id="startup-name"
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
            <Label htmlFor="startup-industry" className="text-base">
              Industry
            </Label>
            <Input
              id="startup-industry"
              value={profile.industry || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  industry: e.target.value,
                }))
              }
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-8 mt-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Startup Information
            </h2>
            <p className="text-muted-foreground text-sm">
              Update your startup details to help others understand your
              business
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="startup-description" className="text-base">
              About the Startup
            </Label>
            <Textarea
              id="startup-description"
              rows={5}
              value={profile.description || ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="resize-none"
              placeholder="Describe your startup, mission, and what makes it unique..."
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startup-stage" className="text-base">
                  Stage
                </Label>
                <Input
                  id="startup-stage"
                  value={profile.stage || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      stage: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="e.g. Seed, Series A, Growth"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startup-location" className="text-base">
                  Location
                </Label>
                <Input
                  id="startup-location"
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
                <Label htmlFor="startup-team-size" className="text-base">
                  Team Size
                </Label>
                <Input
                  id="startup-team-size"
                  type="number"
                  value={profile.teamSize || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      teamSize: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="Number of employees"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startup-founded-year" className="text-base">
                  Founded Year
                </Label>
                <Input
                  id="startup-founded-year"
                  type="number"
                  value={profile.foundedYear || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      foundedYear: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="e.g. 2023"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Online Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="startup-website"
                  className="text-base flex items-center gap-2"
                >
                  <Link className="size-4 text-primary" />
                  Website
                </Label>
                <Input
                  id="startup-website"
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
                  htmlFor="startup-linkedin"
                  className="text-base flex items-center gap-2"
                >
                  <Link className="size-4 text-primary" />
                  LinkedIn
                </Label>
                <Input
                  id="startup-linkedin"
                  value={profile.linkedin || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                  className="h-10"
                  placeholder="https://linkedin.com/company/..."
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
          disabled={isSubmitting}
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
