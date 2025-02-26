import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Content Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">SATAS</h1>
            <Badge variant="outline" className="mt-2">
              Social Aid for Talent Acquisition Startups
            </Badge>
          </div>
          {children}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SATAS. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Image Side - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-foreground/5">
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm"></div>
        </div>
        <div className="relative w-full h-full flex flex-col justify-center items-center p-12 z-10">
          <div className="mb-12 w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4">
              Connect with the best talent and startups
            </h2>
            <p className="text-lg text-muted-foreground">
              SATAS helps startups find the right talent and helps individuals
              discover exciting startup opportunities.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-semibold mb-2">For Startups</h3>
              <p className="text-sm text-muted-foreground">
                Create your profile, post jobs, and connect with qualified
                candidates.
              </p>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-semibold mb-2">For Individuals</h3>
              <p className="text-sm text-muted-foreground">
                Showcase your skills, discover startups, and find your next
                opportunity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
