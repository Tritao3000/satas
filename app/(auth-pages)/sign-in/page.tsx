import { signInAction } from "@/app/actions";
import GoogleAuthWrapper from "@/app/auth/components/GoogleAuthWrapper";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  // If there's an error message and no form content, display it full width
  if (searchParams && "message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center justify-center">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Sign in</h2>
      <form className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Don't have an account?{" "}
          <Link
            className="text-primary font-medium underline hover:text-primary/90"
            href="/sign-up"
          >
            Sign up
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-muted-foreground hover:text-primary"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            className="w-full"
            required
          />
        </div>

        <SubmitButton className="w-full" formAction={signInAction}>
          Sign in
        </SubmitButton>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleAuthWrapper />

        <div className="mt-4">
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
