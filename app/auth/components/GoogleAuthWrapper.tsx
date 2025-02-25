"use client";

import dynamic from "next/dynamic";

// Dynamically import the GoogleAuth component to avoid server-side rendering issues
const GoogleAuth = dynamic(() => import("./GoogleAuth"), {
  ssr: false,
});

export default function GoogleAuthWrapper() {
  return <GoogleAuth />;
}
