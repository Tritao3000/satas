import Image from "next/image";
import logoBlack from "@/public/images/logo-black.png";
interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: any;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: logoBlack,
    alt: "Satas Logo",
    title: "Satas",
    url: "https://www.satas.app",
  },
  tagline = "Connect startups with students.",
  menuItems = [
    {
      title: "Sections",
      links: [
        { text: "Features", url: "#features" },
        { text: "Stats", url: "#stats" },
        { text: "Use Cases", url: "#for-who" },
        { text: "Roadmap", url: "#roadmap" },
        { text: "Team", url: "#team" },
        { text: "FAQ", url: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#team" },
        { text: "Blog", url: "/blog" },
        { text: "Contact", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Terms", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
        { text: "Facebook", url: "#" },
      ],
    },
  ],
  copyright = "© 2025 Satas. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: FooterProps) => {
  return (
    <section className="py-20">
      <footer>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-8 lg:mb-0">
            <div className="flex items-center gap-2 lg:justify-start">
              <a href="https://www.satas.app">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  width={250}
                />
              </a>
            </div>
          </div>
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-4 font-bold">{section.title}</h3>
              <ul className="space-y-4 text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="font-medium hover:text-primary">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
          <p>{copyright}</p>
          <ul className="flex gap-4">
            {bottomLinks.map((link, linkIdx) => (
              <li key={linkIdx} className="underline hover:text-primary">
                <a href={link.url}>{link.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </section>
  );
};

export { Footer };
