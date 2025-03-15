import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export type StartupProfileFormData = {
  name: string;
  description: string | null;
  location: string | null;
  industry: string | null;
  stage: string | null;
  teamSize: string;
  foundedYear: string;
  linkedin: string | null;
  website: string | null;
  logo: string | null;
  banner: string | null;
};

interface StartupProfileFormProps {
  profile: StartupProfileFormData;
  uploadFiles: (userId: string) => Promise<Record<string, string | null>>;
}

export function StartupProfileForm({
  profile: initialProfile,
  uploadFiles,
}: StartupProfileFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // File state
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Logo
  const [coverPicture, setCoverPicture] = useState<File | null>(null); // Banner

  // Track if files were removed without replacement
  const [profilePictureRemoved, setProfilePictureRemoved] = useState(false);
  const [coverPictureRemoved, setCoverPictureRemoved] = useState(false);

  // Form state
  const [profile, setProfile] =
    useState<StartupProfileFormData>(initialProfile);

  const handleSubmit = async (e: React.FormEvent) => {
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
        ...profile,
        ...(uploadedFiles.logo && { logo: uploadedFiles.logo }),
        ...(uploadedFiles.banner && { banner: uploadedFiles.banner }),
        // Set fields to null if files were removed without replacement
        ...(profilePictureRemoved && !uploadedFiles.logo && { logo: null }),
        ...(coverPictureRemoved && !uploadedFiles.banner && { banner: null }),
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

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Startup Information</h3>

            <div className="space-y-2">
              <Label htmlFor="startup-name">Startup Name</Label>
              <Input
                id="startup-name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.industry || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.stage || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.location || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.teamSize || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.foundedYear || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
              previewUrl={profile.logo}
              onChange={(file) => {
                setProfilePicture(file);
                setProfilePictureRemoved(file === null);
              }}
              previewClassName="aspect-square h-32 w-32"
            />

            <FileUpload
              label="Company Banner"
              previewUrl={profile.banner}
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
                value={profile.website || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.linkedin || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
            value={profile.description || ""}
            onChange={(e) =>
              setProfile((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </form>
  );
}
