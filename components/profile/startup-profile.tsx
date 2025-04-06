import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { StartupProfileProps } from "@/lib/type";
import { ensureHttps } from "@/lib/utils";

export function StartupProfile({ profile }: StartupProfileProps) {
  return (
    <div className="flex flex-col w-full min-w-full">
      <div className="relative w-full h-[250px] bg-muted rounded-t-lg">
        {profile.banner ? (
          <Image
            src={profile.banner}
            alt="Banner"
            fill
            className="object-cover rounded-t-lg"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r rounded-t-xl from-blue-600 to-purple-600" />
        )}

        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-white text-black hover:text-black"
            asChild
          >
            <Link href="/menu/profile/edit">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex flex-col items-start -mt-16 mb-6">
              <div className="relative w-full flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="rounded-full w-32 h-32 overflow-hidden bg-white ring-4 ring-white">
                    {profile.logo ? (
                      <Image
                        src={profile.logo}
                        alt={profile.name}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50">
                        <Building className="h-12 w-12 text-blue-500" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0">
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      {profile.industry && (
                        <Badge
                          variant="secondary"
                          className="inline-flex items-center"
                        >
                          <Briefcase className="h-3 w-3 mr-1" />
                          {profile.industry}
                        </Badge>
                      )}
                      {profile.stage && (
                        <Badge variant="outline">{profile.stage}</Badge>
                      )}
                      {profile.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  {profile.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={ensureHttps(profile.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <GlobeIcon className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {profile.linkedin && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={ensureHttps(profile.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                {profile.description ? (
                  <div className="prose max-w-none">
                    <p>{profile.description}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided
                  </p>
                )}
              </div>
            </div>

            <div className="lg:w-80">
              <div className="bg-muted/20 p-6 rounded-lg border border-border/50">
                <h3 className="text-lg font-medium mb-4">Company Details</h3>
                <div className="space-y-5">
                  {profile.teamSize && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Team Size</p>
                        <p className="text-muted-foreground">
                          {profile.teamSize} employees
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.foundedYear && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Founded</p>
                        <p className="text-muted-foreground">
                          {profile.foundedYear}
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">
                          {profile.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {!profile.teamSize &&
                    !profile.foundedYear &&
                    !profile.location && (
                      <p className="text-sm text-muted-foreground italic">
                        No company details provided
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
