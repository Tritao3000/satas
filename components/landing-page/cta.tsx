import { Button } from "@/components/ui/button";

interface CtaProps {
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Cta = ({
  heading = "Ready to Start at a Startup?",
  description = "Join the SATAS community today. Whether you're looking for talent or opportunity, your journey starts here.",
  buttons = {
    primary: {
      text: "Sign Up Now",
      url: "/sign-up",
    },
    secondary: {
      text: "Post a Job / Event",
      url: "#",
    },
  },
}: CtaProps) => {
  return (
    <section className="py-20">
      <div className="flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
        <div className="flex-1">
          <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-4xl">
            {heading}
          </h3>
          <p className="max-w-xl text-muted-foreground text-lg font-medium">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          {buttons.secondary && (
            <Button variant="outline" asChild>
              <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
            </Button>
          )}
          {buttons.primary && (
            <Button asChild>
              <a href={buttons.primary.url}>{buttons.primary.text}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export { Cta };
