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

export type IndividualProfileFormData = {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  industry: string | null;
  role: string | null;
  description: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
  website: string | null;
  profilePicture: string | null;
  coverPicture: string | null;
  cvPath: string | null;
};

interface IndividualProfileFormProps {
  profile: IndividualProfileFormData;
  uploadFiles: (userId: string) => Promise<Record<string, string | null>>;
}

export function IndividualProfileForm({
  profile: initialProfile,
  uploadFiles,
}: IndividualProfileFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // File state
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPicture, setCoverPicture] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  // Track if files were removed without replacement
  const [profilePictureRemoved, setProfilePictureRemoved] = useState(false);
  const [coverPictureRemoved, setCoverPictureRemoved] = useState(false);
  const [cvRemoved, setCvRemoved] = useState(false);

  // Form state
  const [profile, setProfile] =
    useState<IndividualProfileFormData>(initialProfile);

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

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
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
              <Label htmlFor="email">Email</Label>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
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
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={profile.role || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
              previewUrl={profile.profilePicture}
              onChange={(file) => {
                setProfilePicture(file);
                setProfilePictureRemoved(file === null);
              }}
              previewClassName="aspect-square h-32 w-32"
            />

            <FileUpload
              label="Cover Picture"
              previewUrl={profile.coverPicture}
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
              previewUrl={profile.cvPath}
              onChange={(file) => {
                setCv(file);
                setCvRemoved(file === null);
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={profile.linkedin || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.github || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.twitter || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
                value={profile.website || ""}
                onChange={(e) =>
                  setProfile((prev) => ({
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
