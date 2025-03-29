import { GalleryVerticalEnd } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <h1 className="font-bold tracking-tight">SATAS</h1>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary-foreground/5">
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 flex h-full flex-col justify-center p-12">
          <div className="w-full max-w-md">
            <Badge variant="outline" className="mb-4">
              Social Aid for Talent Acquisition Startups
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Connect with the best talent and startups
            </h2>
            <p className="text-lg text-muted-foreground">
              SATAS helps startups find the right talent and helps individuals
              discover exciting startup opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
