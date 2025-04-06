import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  GlobeIcon,
  User,
  MapPin,
  Briefcase,
  Calendar,
  Linkedin,
  Github,
  Twitter,
  Pencil,
} from "lucide-react";
import { IndividualProfileProps } from "@/lib/type";
import { ensureHttps } from "@/lib/utils";

export function IndividualProfile({ profile }: IndividualProfileProps) {
  return (
    <div className="flex flex-col w-full min-w-full">
      <div className="relative w-full h-[250px] bg-muted rounded-t-lg">
        {profile.coverPicture ? (
          <Image
            src={profile.coverPicture}
            alt="Banner"
            fill
            className="object-cover rounded-t-lg"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg" />
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
                    {profile.profilePicture ? (
                      <Image
                        src={profile.profilePicture}
                        alt={profile.name}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50">
                        <User className="h-12 w-12 text-blue-500" />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0">
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      {profile.role && (
                        <Badge
                          variant="secondary"
                          className="inline-flex items-center"
                        >
                          <Briefcase className="h-3 w-3 mr-1" />
                          {profile.role}
                        </Badge>
                      )}
                      {profile.industry && (
                        <Badge variant="outline">{profile.industry}</Badge>
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
                <h3 className="text-lg font-medium mb-4">Contact Details</h3>
                <div className="space-y-5">
                  {profile.email && (
                    <div className="flex items-start">
                      <GlobeIcon className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">{profile.phone}</p>
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

                  <div className="pt-4 space-y-2">
                    {profile.github && (
                      <a
                        href={ensureHttps(profile.github)}
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
                        href={ensureHttps(profile.twitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:text-primary"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    )}
                  </div>

                  {profile.cvPath && (
                    <div className="pt-4">
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
                    </div>
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
