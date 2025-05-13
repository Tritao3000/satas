import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  heading?: string;
  description?: string;
  items?: FaqItem[];
}

const Faq = ({
  heading = "Frequently Asked Questions",
  description = "Find answers to common questions about using SATAS.",
  items = [
    {
      question: "What is SATAS?",
      answer:
        "SATAS (Start At A Startup) is a platform designed to connect innovative startups with talented students for job opportunities, internships, and events.",
    },
    {
      question: "How does SATAS help startups?",
      answer:
        "We provide startups with access to a diverse pool of student talent, easy job posting tools, application management, and event hosting capabilities to find the right candidates.",
    },
    {
      question: "How does SATAS help students?",
      answer:
        "Students can discover exciting job and internship opportunities at startups, build their professional network through events, and find companies that align with their career goals.",
    },
    {
      question: "Is SATAS free to use?",
      answer:
        "Yes, both for students and startups. We are currently in beta and we are offering a free plan for both students and startups.",
    },
    {
      question: "How do I join an event?",
      answer:
        "Browse the events section on the platform. You can filter by type (career fair, workshop, etc.) and register directly for events that interest you.",
    },
  ],
}: FaqProps) => {
  return (
    <section className="py-20">
      <div className="flex flex-col gap-4 mb-12">
        <h2 className="text-2xl font-semibold  md:text-4xl">{heading}</h2>
        <p className="text-lg font-medium text-muted-foreground">
          {description}
        </p>
      </div>
      <Accordion type="single" collapsible>
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="font-semibold hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export { Faq };
