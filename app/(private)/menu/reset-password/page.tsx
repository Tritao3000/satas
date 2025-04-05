"use client";

import { resetPasswordAction } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <p className="text-muted-foreground mb-10">
        Enter your new password below to reset your account password.
      </p>

      {message && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-md">
          {message}
        </div>
      )}

      <form className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            type="password"
            name="password"
            placeholder="New password"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
          />
        </div>

        <Button formAction={resetPasswordAction}>Reset password</Button>
      </form>
    </div>
  );
}

function ResetPasswordSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <p className="text-muted-foreground mb-10">
        Enter your new password below to reset your account password.
      </p>

      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label>New password</Label>
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        </div>

        <div className="space-y-2">
          <Label>Confirm password</Label>
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        </div>

        <div className="h-10 w-32 bg-primary/60 animate-pulse rounded-md" />
      </div>
    </div>
  );
}
