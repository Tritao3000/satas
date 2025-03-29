import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

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
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusClass =
    statusVariant[application.status as keyof typeof statusVariant] ||
    statusVariant.pending;
  const date = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          {application.startup?.logo ? (
            <Image
              src={application.startup.logo}
              alt={application.startup.name || "Company logo"}
              width={40}
              height={40}
              className="rounded-md"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-xs">No logo</span>
            </div>
          )}
          <div>
            <CardTitle>
              {application.job?.title || "Unknown position"}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {application.startup?.name || "Unknown company"}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <Label>Location</Label>
            <span className="text-sm">
              {application.job?.location || "Not specified"}
            </span>
          </div>
          <div className="flex justify-between">
            <Label>Type</Label>
            <span className="text-sm">
              {application.job?.type || "Not specified"}
            </span>
          </div>
          <div className="flex justify-between">
            <Label>Applied on</Label>
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex justify-between">
            <Label>Status</Label>
            <span className={`text-sm px-2 py-1 rounded-full ${statusClass}`}>
              {application.status}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/jobs/${application.jobId}`}>View job</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
