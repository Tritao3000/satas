import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, ExternalLink } from "lucide-react";

export type JobApplication = {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
    location: string;
    type: string;
    startupId: string;
  } | null;
  startup: {
    name: string;
    logo: string | null;
  } | null;
};

interface ApplicationCardProps {
  application: JobApplication;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const statusVariant = {
    pending: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    accepted:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
    rejected: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200",
  };

  const statusClass =
    statusVariant[application.status as keyof typeof statusVariant] ||
    statusVariant.pending;
  const date = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <Card className="overflow-hidden border transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          {application.startup?.logo ? (
            <div className="relative w-12 h-12 overflow-hidden rounded-md border bg-background flex-shrink-0">
              <Image
                src={application.startup.logo}
                alt={application.startup.name || "Company logo"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-medium">
                {application.startup?.name?.substring(0, 2) || "CO"}
              </span>
            </div>
          )}
          <div>
            <CardTitle className="text-lg line-clamp-1">
              {application.job?.title || "Unknown position"}
            </CardTitle>
            <div className="text-sm text-muted-foreground font-medium">
              {application.startup?.name || "Unknown company"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <Badge variant="outline" className={`mb-4 ${statusClass}`}>
          {application.status.charAt(0).toUpperCase() +
            application.status.slice(1)}
        </Badge>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{application.job?.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{application.job?.type || "Full-time"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Applied on {date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="default" className="w-full gap-2 group" asChild>
          <Link href={`/jobs/${application.jobId}`}>
            View job details
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
