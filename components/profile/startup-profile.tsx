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
  Pencil,
} from "lucide-react";

export type StartupProfileType = {
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

interface StartupProfileProps {
  profile: StartupProfileType;
}

export function StartupProfile({ profile }: StartupProfileProps) {
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
}
