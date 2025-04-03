import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface Job {
  id: string;
  created_at: string;
}

interface ApplicationWithStatus {
  id: string;
  status: string;
}

interface DashboardStats {
  profileCompletion: number;
  jobsPosted: number;
  activeJobs: number;
  jobsApplied: number;
  pendingApplications: number;
  receivedApplications: number;
  acceptedApplications: number;
  events: number;
  profileViewsCount: number;
  [key: string]: number;
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profileType, error: profileTypeError } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (profileTypeError) {
      console.error("Error fetching user type:", profileTypeError);
      return NextResponse.json(
        { error: "Error fetching user type" },
        { status: 500 }
      );
    }

    const userType = profileType.user_type;

    const stats: DashboardStats = {
      profileCompletion: 0,
      jobsPosted: 0,
      activeJobs: 0,
      jobsApplied: 0,
      pendingApplications: 0,
      receivedApplications: 0,
      acceptedApplications: 0,
      events: 0,
      profileViewsCount: 0,
    };

    if (userType === "startup") {
      const { data: startupProfile, error: startupProfileError } =
        await supabase
          .from("startup_profiles")
          .select("user_id")
          .eq("user_id", user.id)
          .single();

      if (startupProfileError) {
        console.error("Error fetching startup profile:", startupProfileError);
      } else {
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select("id, created_at")
          .eq("startup_id", user.id);

        if (jobsError) {
          console.error("Error fetching jobs:", jobsError);
        } else {
          if (jobs) {
            stats.jobsPosted = jobs.length;

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            stats.activeJobs = jobs.filter(
              (job: Job) => new Date(job.created_at) >= thirtyDaysAgo
            ).length;

            if (jobs.length > 0) {
              const jobIds = jobs.map((job: Job) => job.id);

              const { data: applications, error: applicationsError } =
                await supabase
                  .from("job_applications")
                  .select("id, job_id, status")
                  .in("job_id", jobIds);

              if (applicationsError) {
                console.error(
                  "Error fetching applications:",
                  applicationsError
                );
              } else {
                if (applications) {
                  stats.receivedApplications = applications.length;

                  stats.acceptedApplications = applications.filter(
                    (app: ApplicationWithStatus) => app.status === "accepted"
                  ).length;
                }
              }
            }
          }
        }
      }

      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id")
        .eq("startup_id", user.id);

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
      } else {
        if (events) {
          stats.events = events.length;
        }
      }
    } else if (userType === "individual") {
      const { data: applications, error: applicationsError } = await supabase
        .from("job_applications")
        .select("id, status")
        .eq("applicant_id", user.id);

      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
      } else if (applications) {
        stats.jobsApplied = applications.length;
        stats.pendingApplications = applications.filter(
          (app: ApplicationWithStatus) => app.status === "pending"
        ).length;
        stats.acceptedApplications = applications.filter(
          (app: ApplicationWithStatus) => app.status === "accepted"
        ).length;
      }

      const { data: eventRegistrations, error: eventsError } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("registrant_id", user.id);

      if (eventsError) {
        console.error("Error fetching event registrations:", eventsError);
      } else if (eventRegistrations) {
        stats.events = eventRegistrations.length;
      }
    }

    if (userType === "startup") {
      const { data: startupProfile, error: startupProfileError } =
        await supabase
          .from("startup_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

      if (startupProfileError) {
        console.error("Error fetching startup profile:", startupProfileError);
      }

      if (!startupProfileError && startupProfile) {
        const fields = [
          "name",
          "description",
          "logo",
          "location",
          "industry",
          "stage",
          "team_size",
          "founded_year",
          "linkedin",
          "website",
        ];

        const filledFields = fields.filter(
          (field) =>
            startupProfile[field] !== null &&
            startupProfile[field] !== undefined &&
            startupProfile[field] !== ""
        );

        stats.profileCompletion = Math.round(
          (filledFields.length / fields.length) * 100
        );
      }
    } else if (userType === "individual") {
      const { data: individualProfile, error: individualProfileError } =
        await supabase
          .from("individual_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

      if (individualProfileError) {
        console.error(
          "Error fetching individual profile:",
          individualProfileError
        );
      }

      if (!individualProfileError && individualProfile) {
        const fields = [
          "name",
          "email",
          "phone",
          "location",
          "industry",
          "role",
          "description",
          "linkedin",
          "profile_picture",
          "cv_path",
        ];

        const filledFields = fields.filter(
          (field) =>
            individualProfile[field] !== null &&
            individualProfile[field] !== undefined &&
            individualProfile[field] !== ""
        );

        stats.profileCompletion = Math.round(
          (filledFields.length / fields.length) * 100
        );
      }
    }

    for (const key in stats) {
      stats[key] = Number(stats[key]) || 0;
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({
      profileCompletion: 0,
      jobsPosted: 0,
      activeJobs: 0,
      jobsApplied: 0,
      pendingApplications: 0,
      receivedApplications: 0,
      acceptedApplications: 0,
      events: 0,
      profileViewsCount: 0,
    });
  }
}
