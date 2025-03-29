import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if (searchParams && "message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center justify-center">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">
        Reset Password
      </h2>
      <form className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Remember your password?{" "}
          <Link
            className="text-primary font-medium underline hover:text-primary/90"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full"
            required
          />
        </div>

        <SubmitButton
          className="w-full"
          pendingText="Requesting reset..."
          formAction={forgotPasswordAction}
        >
          Reset Password
        </SubmitButton>

        <div className="mt-4">
          <FormMessage message={searchParams} />
        </div>
      </form>

      <div className="mt-6">
        <SmtpMessage />
      </div>
    </div>
  );
}
