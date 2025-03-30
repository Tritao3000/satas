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

        // Add "Create Job" if on the create page
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
          href: "/menu/events",
          isCurrentPage: pathname === "/menu/events",
        });

        if (pathname === "/menu/events/new") {
          breadcrumbs.push({
            label: "Create Event",
            href: "/menu/events/new",
            isCurrentPage: true,
          });
        }
      } else if (pathname.includes("/menu/my-events")) {
        breadcrumbs.push({
          label: "My Events",
          href: "/menu/my-events",
          isCurrentPage: pathname === "/menu/my-events",
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
            label: "Event Details",
            href: `/events/${id}`,
            isCurrentPage: true,
          });
        } else if (
          pathname.includes("/menu/events/") &&
          pathname !== "/menu/events/create"
        ) {
          breadcrumbs.push({
            label: "Event Details",
            href: `/menu/events/${id}`,
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
        }
      }

      setItems(breadcrumbs);
      setIsLoading(false);
    };

    generateBreadcrumbs();
  }, [params, pathname]);

  return (
    <BreadcrumbContext.Provider value={{ items, isLoading }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
