"use client";

import { FormEvent, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StartupProfileSetup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Use SWR to fetch user profile status
  const { data: profileStatus, error: profileStatusError } = useSWR(
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
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      industry: formData.get("industry") as string,
      stage: formData.get("stage") as string,
      teamSize: formData.get("teamSize") as string,
      foundedYear: formData.get("foundedYear") as string,
      linkedin: formData.get("linkedin") as string,
      website: formData.get("website") as string,
    };

    try {
      // Submit profile data to API
      const response = await fetch("/api/profile/startup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to create startup profile");
      }

      // Use window.location.href to force a full page refresh which will update the layout
      window.location.href = "/menu";
    } catch (error) {
      console.error("Error creating startup profile:", error);
      setIsLoading(false);
    }
  };

  // Show loading state while checking profile status
  if (!profileStatus && !profileStatusError) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-4 w-2/3 mb-10" />

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>

            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-32 w-full" />
          </div>

          <Skeleton className="h-6 w-48 mt-8 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          <Skeleton className="h-10 w-full mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Your Startup Profile</h1>
      <p className="text-muted-foreground mb-10">
        Tell us about your startup so individuals can discover you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" name="name" required />
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
            <Label htmlFor="stage">Startup Stage</Label>
            <Input
              id="stage"
              name="stage"
              placeholder="e.g. Seed, Series A, Growth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              name="teamSize"
              type="number"
              placeholder="e.g. 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundedYear">Founded Year</Label>
            <Input
              id="foundedYear"
              name="foundedYear"
              type="number"
              placeholder="e.g. 2022"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">About Your Startup</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell us about your startup, mission, products, and vision"
            className="h-32"
          />
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Online Presence</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              placeholder="https://yourstartup.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="https://linkedin.com/company/yourstartup"
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
