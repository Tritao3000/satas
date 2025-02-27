"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/components/dashboard/profile-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  Github,
  Twitter,
  User,
  Pencil,
  Loader2,
  Loader,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import { createClient } from "@/utils/supabase/client";

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

type IndividualProfileType = {
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

type StartupProfileType = {
  name: string;
  description: string | null;
  location: string | null;
  industry: string | null;
  stage: string | null;
  teamSize: number | null;
  foundedYear: number | null;
  linkedin: string | null;
  website: string | null;
  logo: string | null;
  banner: string | null;
};

export default function ProfilePage() {
  const router = useRouter();

  // Force revalidation when the component mounts to ensure fresh data after edits
  useEffect(() => {
    mutate("/api/user/me");
    mutate("/api/profile/individual");
    mutate("/api/profile/startup");
  }, []);

  // Use SWR to fetch user data
  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR("/api/user/me", fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
  });

  // Use SWR to fetch profile data based on user type
  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useSWR(
    // Only fetch profile data when we have user data
    userData?.id && userData?.userType
      ? userData.userType === "individual"
        ? "/api/profile/individual"
        : "/api/profile/startup"
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
    }
  );

  // Handle loading
  if (userIsLoading || profileIsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="h-6 w-6 animate-spin" />
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  // Handle errors
  if (userError || profileError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">
          {userError?.message || profileError?.message || "An error occurred"}
        </p>
      </div>
    );
  }

  // Handle user type rendering
  if (userData?.userType === "individual") {
    return renderIndividualProfile(profile, router);
  } else if (userData?.userType === "startup") {
    return renderStartupProfile(profile, router);
  }

  // Default fallback
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Unable to determine user type.</p>
    </div>
  );
}

const renderIndividualProfile = (
  profile: IndividualProfileType,
  router: any
) => {
  if (!profile) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
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
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            asChild
          >
            <Link href="/menu/profile/edit">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
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
};

const renderStartupProfile = (profile: StartupProfileType, router: any) => {
  if (!profile) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
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
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            asChild
          >
            <Link href="/menu/profile/edit">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
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
};
