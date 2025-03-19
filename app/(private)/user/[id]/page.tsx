"use client";

import { db } from "@/src/db";
import { individualProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  GlobeIcon,
  MapPin,
  Briefcase,
  Linkedin,
  Github,
  Twitter,
  User,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useSWR, { mutate } from "swr";
import { useEffect } from "react";
import { useProfile } from "@/components/dashboard/profile-context";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { userId: currentUserId, userType, isLoading: isProfileLoading } = useProfile();

  // Force revalidation when the component mounts
  useEffect(() => {
    mutate(`/api/profile/individual/${userId}`);
  }, [userId]);



  // Fetch individual profile
  const {
    data: profile,
    error: profileError,
    isLoading,
  } = useSWR(`/api/profile/individual/${userId}`, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="h-6 w-6 animate-spin" />
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  // Handle errors
  if (profileError || !profile) {
    return notFound();
  }

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUserId === userId;

  return (
    <div>
      {/* Cover Picture */}
      <div className="relative w-full h-[200px] md:h-[300px] rounded-t-xl overflow-hidden bg-muted">
        {profile.coverPicture ? (
          <Image
            src={profile.coverPicture}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
        )}

        {/* Edit Profile Button */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
              asChild
            >
              <Link href="/menu/profile/edit">Edit Profile</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className="relative bg-card border rounded-b-xl p-6 shadow-sm">
        <div className="flex flex-col items-start">
          <div className="relative -mt-20 mb-4">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-background bg-muted flex-shrink-0">
              {profile.profilePicture ? (
                <Image
                  src={profile.profilePicture}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.role}</p>

            <div className="flex items-center gap-2 mt-2">
              {profile.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.location}
                </div>
              )}
              {profile.industry && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {profile.industry}
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.description ? (
                <p className="text-sm">{profile.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description provided
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-primary"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-primary"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-primary"
                  >
                    <GlobeIcon className="h-4 w-4 mr-2" />
                    Website
                  </a>
                )}
                {![
                  profile.linkedin,
                  profile.github,
                  profile.twitter,
                  profile.website,
                ].some(Boolean) && (
                  <p className="text-sm text-muted-foreground italic">
                    No social links provided
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Resume/CV Download */}
            {profile.cvPath && (
              <Card>
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild className="w-full">
                    <a
                      href={profile.cvPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Download CV
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
