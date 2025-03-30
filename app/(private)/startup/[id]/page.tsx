"use client";

import { db } from "@/src/db";
import { startupProfiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound, useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  GlobeIcon,
  Building,
  MapPin,
  Users,
  Calendar,
  Linkedin,
  Briefcase,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useProfile } from "@/lib/hooks/use-profile-content";

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

export default function StartupProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const {
    userId: currentUserId,
    userType,
    isLoading: isProfileLoading,
  } = useProfile();

  // Force revalidation when the component mounts
  useEffect(() => {
    mutate(`/api/profile/startup/${userId}`);
  }, [userId]);

  // Fetch startup profile
  const {
    data: profile,
    error: profileError,
    isLoading,
  } = useSWR(`/api/profile/startup/${userId}`, fetcher, {
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
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[300px] rounded-t-xl overflow-hidden bg-muted">
        {profile.banner ? (
          <Image
            src={profile.banner}
            alt="Banner"
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
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-background bg-white flex-shrink-0">
              {profile.logo ? (
                <Image
                  src={profile.logo}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Building className="h-12 w-12 text-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.industry && (
                <Badge variant="outline">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {profile.industry}
                </Badge>
              )}
              {profile.stage && (
                <Badge variant="outline">{profile.stage}</Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              {profile.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.location}
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
            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.teamSize && (
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-2">
                      Team size:
                    </span>
                    {profile.teamSize} employees
                  </div>
                )}

                {profile.foundedYear && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-2">Founded:</span>
                    {profile.foundedYear}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Links */}
            <Card>
              <CardHeader>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {!profile.website && !profile.linkedin && (
                  <p className="text-sm text-muted-foreground italic">
                    No links provided
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
