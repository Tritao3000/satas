interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface ForWhoProps {
  heading?: string;
  description?: string;
  features?: Feature[];
}

const ForWho = ({
  heading = "Built for Connection",
  description = "Whether you're a startup seeking fresh talent or a student ready to make an impact, SATAS is your platform.",
  features = [
    {
      id: "feature-1",
      title: "Find Your Next Innovator",
      subtitle: "FOR STARTUPS",
      description:
        "Access a pool of motivated students eager to contribute. Post jobs, browse profiles, and manage applications easily.",
      image: "https://shadcnblocks.com/images/block/placeholder-1.svg",
    },
    {
      id: "feature-2",
      title: "Launch Your Startup Career",
      subtitle: "FOR STUDENTS",
      description:
        "Discover exciting roles at dynamic startups. Attend events, build your network, and find your perfect match.",
      image: "https://shadcnblocks.com/images/block/placeholder-4.svg",
    },
  ],
}: ForWhoProps) => {
  return (
    <section className="py-20">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold md:text-4xl">{heading}</h2>
        <p className="text-lg font-medium text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-12 grid gap-9 lg:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col justify-between rounded-lg bg-accent"
          >
            <div className="flex justify-between gap-10 border-b">
              <div className="flex flex-col justify-between gap-14 py-6 pl-4 md:py-10 md:pl-8 lg:justify-normal">
                <p className="text-xs text-muted-foreground">
                  {feature.subtitle}
                </p>
                <h3 className="text-2xl md:text-4xl">{feature.title}</h3>
              </div>
              <div className="md:1/3 w-2/5 shrink-0 rounded-r-lg border-l">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-full w-full object-cover rounded-r-lg"
                />
              </div>
            </div>
            <div className="p-4 text-muted-foreground md:p-8">
              {feature.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export { ForWho };
