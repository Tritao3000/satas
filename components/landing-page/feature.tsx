interface Feature {
  title: string;
  description: string;
  image: string;
}

interface FeatureProps {
  heading: string;
  description?: string;
  feature1: Feature;
  feature2: Feature;
  feature3: Feature;
  feature4: Feature;
}

const Feature = ({
  heading = "Discover What SATAS Offers",
  description = "From finding the perfect candidate to landing your dream internship, SATAS provides the tools and connections you need.",
  feature1 = {
    title: "Targeted Job Board",
    description:
      "Startups post opportunities, students find relevant roles. Filter by skill, location, and industry.",
    image: "https://shadcnblocks.com/images/block/placeholder-1.svg",
  },
  feature2 = {
    title: "Engaging Events",
    description:
      "Connect through virtual and in-person career fairs, workshops, and networking sessions.",
    image: "https://shadcnblocks.com/images/block/placeholder-2.svg",
  },
  feature3 = {
    title: "Startup Discovery",
    description:
      "Students explore innovative companies, learn about their missions, and find the right fit.",
    image: "https://shadcnblocks.com/images/block/placeholder-1.svg",
  },
  feature4 = {
    title: "Simplified Recruitment",
    description:
      "Startups streamline hiring with easy application management and direct student outreach.",
    image: "https://shadcnblocks.com/images/block/placeholder-2.svg",
  },
}: FeatureProps) => {
  return (
    <section className="py-20">
      <div className="mb-12 flex flex-col  gap-6">
        <h1 className=" text-2xl font-semibold lg:max-w-3xl md:text-4xl">
          {heading}
        </h1>
        <p className=" text-lg font-medium text-muted-foreground md:max-w-4xl ">
          {description}
        </p>
      </div>
      <div className="relative flex justify-center rounded-lg">
        <div className="border-muted2 relative flex w-full flex-col rounded-lg border md:w-1/2 lg:w-full">
          <div className="relative flex flex-col rounded-lg lg:flex-row">
            <div className="border-muted2 flex flex-col justify-between border-b border-solid p-10 lg:w-3/5 lg:border-r lg:border-b-0">
              <h2 className="text-xl font-semibold">{feature1.title}</h2>
              <p className="text-muted-foreground">{feature1.description}</p>
              <img
                src={feature1.image}
                alt={feature1.title}
                className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4] rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-between p-10 lg:w-2/5">
              <h2 className="text-xl font-semibold">{feature2.title}</h2>
              <p className="text-muted-foreground">{feature2.description}</p>
              <img
                src={feature2.image}
                alt={feature2.title}
                className="mt-8 aspect-[1.45] h-full w-full object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="border-muted2 relative flex flex-col border-t border-solid lg:flex-row">
            <div className="border-muted2 flex flex-col justify-between border-b border-solid p-10 lg:w-2/5 lg:border-r lg:border-b-0">
              <h2 className="text-xl font-semibold">{feature3.title}</h2>
              <p className="text-muted-foreground">{feature3.description}</p>
              <img
                src={feature3.image}
                alt={feature3.title}
                className="mt-8 aspect-[1.45] h-full w-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col justify-between p-10 lg:w-3/5">
              <h2 className="text-xl font-semibold">{feature4.title}</h2>
              <p className="text-muted-foreground">{feature4.description}</p>
              <img
                src={feature4.image}
                alt={feature4.title}
                className="mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4] rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature };
