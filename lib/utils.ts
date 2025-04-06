import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ensureHttps(url: string | null | undefined): string {
  if (!url) return "";

  if (url.match(/^https?:\/\//i)) {
    return url;
  }

  return `https://${url}`;
}
