import { Button } from "../ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import {
  Card,
  CardTitle,
  CardFooter,
  CardContent,
  CardHeader,
  CardDescription,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useProfile } from "@/lib/hooks/use-profile-content";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

interface ApplyButtonProps {
  jobId: string;
  isApplying: boolean;
  setIsApplying: (value: boolean) => void;
}

export default function ApplyButton({
  jobId,
  isApplying,
  setIsApplying,
}: ApplyButtonProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();

  const {
    userId: currentUserId,
    userType,
    isLoading: isProfileLoading,
  } = useProfile();

  //TODO: profile loading and isprofile loading

  const {
    data: profile,
    error: profileError,
    isLoading,
  } = useSWR(`/api/profile/individual/${currentUserId}`, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });

  const applyForJob = async () => {
    if (!profile.cvPath) {
      toast.error("No CV found on your profile", {
        action: {
          label: "Add CV",
          onClick: () => router.push("/menu/profile/edit"),
        },
      });
      return;
    }
    if (userType === "startup") return;

    setIsApplying(true);
    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("coverLetter", coverLetter);
      formData.append("cv", profile.cvPath);
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to apply for this job");
      }

      toast.success("Application submitted successfully", {
        description: "Your application has been sent to the company.",
      });
      setIsPopoverOpen(false);
      setCoverLetter("");
    } catch (error: any) {
      if (error.message === "You have already applied for this job") {
        toast.info("You have already applied for this job");
      } else {
        toast.error(error.message || "Error applying for job", {
          description: "Please try again later.",
        });
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className="mt-4" disabled={isApplying}>
          <Send className="mr-2 h-4 w-4" />
          {isApplying ? "Applying..." : "Apply Now"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Apply for this position</CardTitle>
            <CardDescription>
              Include a cover letter to stand out from other applicants.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Write a brief message explaining why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-32"
              />
            </div>
          </CardContent>
          <CardFooter className="px-0 pb-0 flex justify-end gap-2">
            <Button onClick={applyForJob} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
