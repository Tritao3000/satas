import { Button } from "@/components/ui/button";

interface Feature {
  image: string;
  title: string;
  description: string;
}

interface RoadmapProps {
  heading: string;
  description: string;
  buttons: {
    primary: {
      text: string;
      url: string;
    };
    secondary: {
      text: string;
      url: string;
    };
  };
  features?: Feature[];
}

const Roadmap = ({
  heading = "Shaping the Future of Startup-Student Collaboration",
  description = "SATAS is committed to evolving and expanding our platform to better serve both startups and students. Join us on our journey!",
  buttons = {
    primary: {
      text: "Join SATAS Now",
      url: "#",
    },
    secondary: {
      text: "View Upcoming Events",
      url: "#",
    },
  },
  features = [
    {
      image: "https://shadcnblocks.com/images/block/placeholder-4.svg",
      title: "Platform Launch & Growth",
      description:
        "Successfully launched SATAS, connecting hundreds of startups with talented students in our first year.",
    },
    {
      image: "https://shadcnblocks.com/images/block/placeholder-5.svg",
      title: "Enhanced Event Platform",
      description:
        "Introducing new features for virtual and in-person career fairs and networking events.",
    },
    {
      image: "https://shadcnblocks.com/images/block/placeholder-5.svg",
      title: "Expanded Startup Resources",
      description:
        "Adding tools and guides to help startups effectively recruit and mentor student talent.",
    },
    {
      image: "https://shadcnblocks.com/images/block/placeholder-5.svg",
      title: "Mobile App Development",
      description:
        "Planning for a dedicated mobile app for even easier access to opportunities and connections.",
    },
  ],
}: RoadmapProps) => {
  return (
    <section className="py-20">
      <div className="relative grid gap-16 md:grid-cols-2">
        <div className="top-40 h-fit md:sticky">
          <h2 className="mt-4 mb-4 text-2xl font-semibold md:text-4xl">
            {heading}
          </h2>
          <p className="font-medium text-muted-foreground text-lg">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row">
            <Button className="gap-2" size="lg" asChild>
              <a href={buttons.primary.url}>{buttons.primary.text}</a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-12 md:gap-20">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl border p-2">
              <img
                src={feature.image}
                alt={feature.title}
                className="aspect-video w-full rounded-xl border border-dashed object-cover"
              />
              <div className="p-6">
                <h3 className="mb-1 text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Roadmap };
