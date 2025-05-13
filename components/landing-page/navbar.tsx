import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import logoBlack from "@/public/images/logo-black.png";
import Image from "next/image";

interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  logo?: {
    url: string;
    src: any;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: logoBlack,
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Features", url: "#features" },
    { title: "Stats", url: "#stats" },
    { title: "Use Cases", url: "#for-who" },
    { title: "Roadmap", url: "#roadmap" },
    { title: "Team", url: "#team" },
    { title: "FAQ", url: "#faq" },
  ],
  auth = {
    login: { title: "Login", url: "/sign-in" },
    signup: { title: "Sign up", url: "/sign-up" },
  },
}: NavbarProps) => {
  return (
    <section className="py-4">
      {/* Desktop Menu */}
      <nav className="hidden justify-between lg:flex">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a href={logo.url} className="flex items-center ">
            <Image src={logoBlack} width={200} height={100} alt={logo.alt} />
          </a>
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={auth.login.url}>{auth.login.title}</a>
          </Button>
          <Button asChild size="sm">
            <a href={auth.signup.url}>{auth.signup.title}</a>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="block lg:hidden">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href={logo.url} className="flex items-center ">
            <Image src={logoBlack} width={200} height={100} alt={logo.alt} />
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href={logo.url} className="flex items-center ">
                    <Image
                      src={logoBlack}
                      width={200}
                      height={100}
                      alt={logo.alt}
                    />
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-3">
                  {menu.map((item) => renderMobileMenuItem(item))}
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline">
                    <a href={auth.login.url}>{auth.login.title}</a>
                  </Button>
                  <Button asChild>
                    <a href={auth.signup.url}>{auth.signup.title}</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <a
      key={item.title}
      href={item.url}
      className="text-md font-semibold block py-2"
    >
      {item.title}
    </a>
  );
};

export { Navbar };
