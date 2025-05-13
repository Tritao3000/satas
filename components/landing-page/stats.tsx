import { ArrowRight } from "lucide-react";

interface StatsProps {
  heading?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

const Stats = ({
  heading = "Impact by the Numbers",
  description = "See how SATAS is fostering growth and opportunity.",
  link = {
    text: "Learn more about our mission",
    url: "#",
  },
  stats = [
    {
      id: "stat-1",
      value: "1000+",
      label: "startups actively hiring",
    },
    {
      id: "stat-2",
      value: "5000+",
      label: "students finding opportunities",
    },
    {
      id: "stat-3",
      value: "50+",
      label: "events hosted connecting talent",
    },
    {
      id: "stat-4",
      value: "95%",
      label: "satisfaction rate from users",
    },
  ],
}: StatsProps) => {
  return (
    <section className="py-20">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold md:text-4xl">{heading}</h2>
        <p className="text-lg font-medium text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-12 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-5">
            <div className="text-6xl font-bold">{stat.value}</div>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Stats };
