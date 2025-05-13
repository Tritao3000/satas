import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TeamProps {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const Team = ({
  heading = "Meet the Team Behind SATAS",
  subheading = "We are hiring!",
  description = "We are a dedicated group of students and alumni focused on empowering students and startups to achieve their goals. Get to know the people making SATAS happen.",
  members = [
    {
      id: "person-1",
      name: "Lourenço  Mourão",
      role: "Role goes here",
      avatar: "https://shadcnblocks.com/images/block/avatar-1.webp",
    },
    {
      id: "person-2",
      name: "Tiago Pereira",
      role: "Role goes here",
      avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
    },
    {
      id: "person-3",
      name: "Carolina Lee",
      role: "Role goes here",
      avatar: "https://shadcnblocks.com/images/block/avatar-3.webp",
    },
    {
      id: "person-4",
      name: "João Sousa",
      role: "Role goes here",
      avatar: "https://shadcnblocks.com/images/block/avatar-4.webp",
    },
  ],
}: TeamProps) => {
  return (
    <section className="py-20">
      <div className=" flex flex-col ">
        <Badge className="semibold w-fit">{subheading}</Badge>
        <h2 className="my-6 text-2xl font-bold text-pretty md:text-4xl">
          {heading}
        </h2>
        <p className="mb-8 max-w-3xl text-muted-foreground text-lg font-medium">
          {description}
        </p>
      </div>
      <div className=" mt-12 grid gap-x-8 gap-y-16 grid-cols-2 lg:grid-cols-4">
        {members.map((person) => (
          <div key={person.id} className="flex flex-col items-center">
            <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
              <AvatarImage src={person.avatar} />
              <AvatarFallback>{person.name}</AvatarFallback>
            </Avatar>
            <p className="text-center font-medium">{person.name}</p>
            <p className="text-center text-muted-foreground">{person.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Team };
