"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { BreadcrumbContextType, BreadcrumbItem } from "../type";
import { useEvent } from "../hooks/use-events";

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

  const eventId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  const shouldFetchEvent =
    !!eventId &&
    (pathname.includes("/events/") || pathname.includes("/menu/events/"));

  const { event, isLoading: isEventLoading } = useEvent(
    shouldFetchEvent ? eventId : ""
  );

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      setIsLoading(true);
      const breadcrumbs: BreadcrumbItem[] = [
        {
          label: "Home",
          href: "/menu",
        },
      ];

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
            label: "Job Details",
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
          pathname !== "/menu/jobs/create"
        ) {
          breadcrumbs.push({
            label: "Job Details",
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

    if (!shouldFetchEvent || (shouldFetchEvent && !isEventLoading)) {
      generateBreadcrumbs();
    }
  }, [params, pathname, event, isEventLoading, shouldFetchEvent]);

  return (
    <BreadcrumbContext.Provider
      value={{
        items,
        isLoading: isLoading || (shouldFetchEvent && isEventLoading),
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}
