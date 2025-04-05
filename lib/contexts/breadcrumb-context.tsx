"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useParams, usePathname } from "next/navigation";
import { BreadcrumbContextType, BreadcrumbItem } from "../type";
import { useEvent } from "../hooks/use-events";
import { useJob } from "../hooks/use-jobs";

const truncateTitle = (title: string, maxWords = 3): string => {
  if (!title) return "";
  const words = title.split(" ");
  if (words.length <= maxWords) return title;
  return `${words.slice(0, maxWords).join(" ")}...`;
};

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  items: [],
  isLoading: true,
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const params = useParams();
  const pathname = usePathname();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const id = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  const shouldFetchEvent =
    !!id &&
    (pathname.includes("/events/") || pathname.includes("/menu/events/"));

  const shouldFetchJob =
    !!id && (pathname.includes("/jobs/") || pathname.includes("/menu/jobs/"));

  const { event, isLoading: isEventLoading } = useEvent(
    shouldFetchEvent ? id : ""
  );

  const { job, isLoading: isJobLoading } = useJob(shouldFetchJob ? id : "");

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      setIsLoading(true);
      const breadcrumbs: BreadcrumbItem[] = [
        {
          label: "Home",
          href: "/menu",
        },
      ];

      const applicationsPathRegex = /\/menu\/jobs\/([^/]+)\/applications/;
      const isApplicationsPage = applicationsPathRegex.test(pathname);

      if (isApplicationsPage) {
        breadcrumbs.length = 1;

        breadcrumbs.push({
          label: "Jobs",
          href: "/jobs",
          isCurrentPage: false,
        });

        breadcrumbs.push({
          label: "Manage Jobs",
          href: "/menu/jobs",
          isCurrentPage: false,
        });

        breadcrumbs.push({
          label: job?.title ? truncateTitle(job.title) : "Job Details",
          href: `/jobs/${id}`,
          isCurrentPage: false,
        });

        breadcrumbs.push({
          label: "Applications",
          href: `/menu/jobs/${id}/applications`,
          isCurrentPage: true,
        });

        setItems(breadcrumbs);
        setIsLoading(false);
        return;
      }

      if (pathname.includes("/events") && !pathname.includes("/menu/events")) {
        breadcrumbs.push({
          label: "Events",
          href: "/events",
          isCurrentPage: pathname === "/events",
        });

        if (pathname.includes("/events/create")) {
          breadcrumbs.push({
            label: "Create Event",
            href: "/events/create",
            isCurrentPage: true,
          });
        }
      } else if (
        pathname.includes("/jobs") &&
        !pathname.includes("/menu/jobs")
      ) {
        breadcrumbs.push({
          label: "Jobs",
          href: "/jobs",
          isCurrentPage: pathname === "/jobs",
        });

        if (pathname.includes("/jobs/create")) {
          breadcrumbs.push({
            label: "Create Job",
            href: "/jobs/create",
            isCurrentPage: true,
          });
        }
      } else if (pathname.includes("/user")) {
        breadcrumbs.push({
          label: "User",
          href: "/user",
          isCurrentPage: pathname === "/user",
        });
      } else if (pathname.includes("/startup")) {
        breadcrumbs.push({
          label: "Startup",
          href: "/startup",
          isCurrentPage: pathname === "/startup",
        });
      }

      if (pathname.includes("/menu/profile")) {
        breadcrumbs.push({
          label: "Profile",
          href: "/menu/profile",
          isCurrentPage: pathname === "/menu/profile",
        });

        if (pathname.includes("/menu/profile/edit")) {
          breadcrumbs.push({
            label: "Edit",
            href: "/menu/profile/edit",
            isCurrentPage: true,
          });
        }
      } else if (pathname.includes("/menu/applications")) {
        breadcrumbs.push({
          label: "Applications",
          href: "/menu/applications",
          isCurrentPage: true,
        });
      } else if (pathname.includes("/menu/registrations")) {
        breadcrumbs.push({
          label: "Registrations",
          href: "/menu/registrations",
          isCurrentPage: true,
        });
      } else if (pathname.includes("/menu/profile-setup")) {
        breadcrumbs.push({
          label: "Profile Setup",
          href: "/menu/profile-setup",
          isCurrentPage: true,
        });
      } else if (pathname.includes("/menu/startup-profile")) {
        breadcrumbs.push({
          label: "Startup Profile",
          href: "/menu/startup-profile",
          isCurrentPage: true,
        });
      } else if (pathname.includes("/menu/individual-profile")) {
        breadcrumbs.push({
          label: "Individual Profile",
          href: "/menu/individual-profile",
          isCurrentPage: true,
        });
      } else if (pathname.includes("/menu/jobs")) {
        breadcrumbs.push({
          label: "Jobs",
          href: "/jobs",
          isCurrentPage: false,
        });

        breadcrumbs.push({
          label: "Manage Jobs",
          href: "/menu/jobs",
          isCurrentPage: pathname === "/menu/jobs",
        });

        if (pathname === "/menu/jobs/create") {
          breadcrumbs.push({
            label: "Create Job",
            href: "/menu/jobs/create",
            isCurrentPage: true,
          });
        }

        if (pathname.includes("/menu/jobs/edit/")) {
          if (job?.title) {
            breadcrumbs.push({
              label: truncateTitle(job.title),
              href: `/jobs/${id}`,
            });
          }
          breadcrumbs.push({
            label: "Edit Job",
            href: pathname,
            isCurrentPage: true,
          });
        }
      } else if (pathname.includes("/menu/events")) {
        breadcrumbs.push({
          label: "Events",
          href: "/events",
          isCurrentPage: false,
        });

        breadcrumbs.push({
          label: "Manage Events",
          href: "/menu/events",
          isCurrentPage: pathname === "/menu/events",
        });

        if (
          pathname === "/menu/events/new" ||
          pathname === "/menu/events/create"
        ) {
          breadcrumbs.push({
            label: "Create Event",
            href: pathname,
            isCurrentPage: true,
          });
        }
      } else if (pathname.includes("/menu/my-events")) {
        breadcrumbs.push({
          label: "Events",
          href: "/events",
          isCurrentPage: false,
        });

        breadcrumbs.push({
          label: "My Events",
          href: "/menu/my-events",
          isCurrentPage: pathname === "/menu/my-events",
        });
      } else if (pathname.includes("/menu/reset-password")) {
        breadcrumbs.push({
          label: "Reset Password",
          href: "/menu/reset-password",
          isCurrentPage: true,
        });
      }

      if (pathname === "/menu") {
        breadcrumbs[0].isCurrentPage = true;
      }

      if (params.id) {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        if (
          pathname.includes("/jobs/") &&
          !pathname.includes("/menu/jobs/") &&
          pathname !== "/jobs/create"
        ) {
          breadcrumbs.push({
            label: job?.title ? truncateTitle(job.title) : "Job Details",
            href: `/jobs/${id}`,
            isCurrentPage: true,
          });
        } else if (
          pathname.includes("/events/") &&
          !pathname.includes("/menu/events/") &&
          pathname !== "/events/create"
        ) {
          breadcrumbs.push({
            label: event?.title ? truncateTitle(event.title) : "Event Details",
            href: `/events/${id}`,
            isCurrentPage: true,
          });
        } else if (
          pathname.includes("/menu/events/") &&
          pathname !== "/menu/events/create" &&
          pathname.includes("/edit")
        ) {
          breadcrumbs.push({
            label: event?.title ? truncateTitle(event.title) : "Event Details",
            href: `/events/${id}`,
          });
          breadcrumbs.push({
            label: "Edit Event",
            href: `/menu/events/${id}/edit`,
            isCurrentPage: true,
          });
        } else if (
          pathname.includes("/menu/jobs/") &&
          pathname !== "/menu/jobs/create" &&
          !pathname.includes("/edit")
        ) {
          breadcrumbs.push({
            label: job?.title ? truncateTitle(job.title) : "Job Details",
            href: `/menu/jobs/${id}`,
            isCurrentPage: true,
          });
        } else if (
          pathname.includes("/menu/events/") &&
          pathname !== "/menu/events/create" &&
          !pathname.includes("/edit")
        ) {
          breadcrumbs.push({
            label: event?.title ? truncateTitle(event.title) : "Event",
            href: `/events/${id}`,
            isCurrentPage: true,
          });
        }
      }

      setItems(breadcrumbs);
      setIsLoading(false);
    };

    if (
      (!shouldFetchEvent && !shouldFetchJob) ||
      (shouldFetchEvent && !isEventLoading) ||
      (shouldFetchJob && !isJobLoading)
    ) {
      generateBreadcrumbs();
    }
  }, [
    params,
    pathname,
    event,
    isEventLoading,
    shouldFetchEvent,
    job,
    isJobLoading,
    shouldFetchJob,
    id,
  ]);

  return (
    <BreadcrumbContext.Provider
      value={{
        items,
        isLoading:
          isLoading ||
          (shouldFetchEvent && isEventLoading) ||
          (shouldFetchJob && isJobLoading),
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}
