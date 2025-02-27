"use client";

import { FormEvent, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { User } from "@supabase/supabase-js";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function IndividualProfileSetup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Use SWR to fetch user profile status
  const { data: profileStatus, error: profileStatusError } = useSWR(
    "/api/user/profile-status",
    fetcher
  );

  // Use SWR to fetch user data
  const { data: userData, error: userError } = useSWR(
    "/api/user/profile-status",
    fetcher
  );

  // Check if user already has a profile - redirect if they do
  useEffect(() => {
    if (profileStatus && profileStatus.hasProfile) {
      router.push("/menu");
    }
  }, [profileStatus, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const profileData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      industry: formData.get("industry") as string,
      role: formData.get("role") as string,
      description: formData.get("description") as string,
      linkedin: formData.get("linkedin") as string,
      twitter: formData.get("twitter") as string,
      github: formData.get("github") as string,
      website: formData.get("website") as string,
    };

    try {
      // Submit profile data to API
      const response = await fetch("/api/profile/individual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to create individual profile");
      }

      // Use window.location.href to force a full page refresh which will update the layout
      window.location.href = "/menu";
    } catch (error) {
      console.error("Error creating individual profile:", error);
      setIsLoading(false);
    }
  };

  // Show loading state while checking profile status
  if (!profileStatus && !profileStatusError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Create Your Individual Profile
      </h1>
      <p className="text-muted-foreground mb-10">
        Tell us about yourself so startups can discover you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={userData?.email || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="City, Country" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              placeholder="e.g. Technology, Healthcare"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Current Role</Label>
            <Input
              id="role"
              name="role"
              placeholder="e.g. Software Engineer, Designer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">About You</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell us about your experience, skills, and what you're looking for"
            className="h-32"
          />
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Social Profiles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              name="twitter"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              name="github"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              name="website"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <Button type="submit" className="w-full mt-8" disabled={isLoading}>
          {isLoading ? "Creating Profile..." : "Create Profile"}
        </Button>
      </form>
    </div>
  );
}
