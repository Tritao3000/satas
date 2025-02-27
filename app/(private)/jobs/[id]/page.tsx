"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useJob } from "@/app/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  Building,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { job, isLoading, isError } = useJob(params.id);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [startupData, setStartupData] = useState<any>(null);

  // Check user authentication and type
  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!userError && user) {
        setUserId(user.id);

        // Get user type
        const { data: userData } = await supabase
          .from("users")
          .select("user_type")
          .eq("id", user.id)
          .single();

        setUserType(userData?.user_type);

        // Check if user already applied to this job
        if (userData?.user_type === "individual" && job) {
          const { data: applicationData } = await supabase
            .from("job_applications")
            .select("id")
            .eq("job_id", job.id)
            .eq("applicant_id", user.id)
            .limit(1);

          setHasApplied(Boolean(applicationData && applicationData.length > 0));
        }
      }
    }

    if (job) {
      checkUser();
    }
  }, [job]);

  // Fetch startup data
  useEffect(() => {
    async function fetchStartupData() {
      if (job) {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("startup_profiles")
          .select("name, logo, location")
          .eq("user_id", job.startupId)
          .single();

        if (!error && data) {
          setStartupData(data);
        }
      }
    }

    fetchStartupData();
  }, [job]);

  const handleApply = async () => {
    if (!userId) {
      toast("Please sign in to apply for jobs", {
        description: "You'll be redirected to the sign in page.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/sign-in"),
        },
      });
      return;
    }

    if (userType !== "individual") {
      toast("Only individuals can apply for jobs");
      return;
    }

    if (hasApplied) {
      toast("You have already applied to this job");
      return;
    }

    setIsSubmittingApplication(true);

    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to apply for job");
      }

      toast("Application submitted successfully", {
        description: "The company will be in touch if they want to proceed.",
      });

      setHasApplied(true);
    } catch (error: any) {
      console.error("Error applying for job:", error);
      toast(error.message || "Failed to apply for job", {
        description: "Please try again",
      });
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="container py-10">
        <div className="text-center p-8">
          Job not found or an error occurred
        </div>
      </div>
    );
  }

  // Format job date
  const formattedDate = format(new Date(job.createdAt), "MMMM d, yyyy");

  // Format salary
  const formattedSalary = job.salary
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(job.salary)
    : "Not specified";

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 text-sm">
                    {startupData?.name && (
                      <span className="font-medium">{startupData.name}</span>
                    )}
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      Posted {formattedDate}
                    </span>
                  </div>
                </CardDescription>
              </div>
              <Badge className="text-sm">{job.type}</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Job Type</div>
                  <div>{job.type}</div>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Salary</div>
                  <div>{formattedSalary}</div>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Posted</div>
                  <div>{formattedDate}</div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Job Description</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <div className="whitespace-pre-wrap">{job.description}</div>
                </div>
              </TabsContent>

              <TabsContent value="company" className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-medium mb-2">
                    About the Company
                  </h3>
                  {startupData ? (
                    <div>
                      <p className="flex items-center mb-2">
                        <Building className="h-4 w-4 mr-2" />
                        {startupData.name}
                      </p>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {startupData.location}
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" asChild>
                          <Link href={`/startup/${job.startupId}`}>
                            View Company Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p>Loading company information...</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleApply}
            disabled={
              isSubmittingApplication || hasApplied || userType === "startup"
            }
          >
            {hasApplied
              ? "Already Applied"
              : isSubmittingApplication
                ? "Submitting..."
                : "Apply Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
