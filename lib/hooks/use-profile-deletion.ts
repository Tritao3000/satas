import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "./use-profile-content";
import { toast } from "sonner";

export function useProfileDeletion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { userType, userId } = useProfile();

  const deleteProfile = async () => {
    if (!userId || !userType) {
      toast.error("User information not found");
      return false;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/profile/${userType}/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete profile");
      }

      toast.success("Profile deleted successfully");
      router.push("/sign-in");
      return true;
    } catch (error: any) {
      console.error("Error deleting profile:", error);
      toast.error(error.message || "Failed to delete profile");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProfile,
    isDeleting,
  };
}
