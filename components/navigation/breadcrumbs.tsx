"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumb } from "@/lib/contexts/breadcrumb-context";
import React from "react";

export function BreadcrumbNavigation() {
  const params = useParams();
  const { items, isLoading } = useBreadcrumb();

  if (isLoading) {
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/menu">
                <Home className="w-4 h-4" />
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Skeleton className="h-4 w-32" />
            {params.id && (
              <>
                <BreadcrumbSeparator />
                <Skeleton className="h-4 w-24" />
              </>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.isCurrentPage ? (
              <BreadcrumbPage>
                {index === 0 ? <Home className="w-4 h-4" /> : item.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={item.href}>
                  {index === 0 ? <Home className="w-4 h-4" /> : item.label}
                </Link>
              </BreadcrumbLink>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
