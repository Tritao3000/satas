import { Button } from "@/components/ui/button"; // Assuming button path
import { Zap, BarChart, CheckCircle } from "lucide-react"; // Example icons
import { Hero } from "@/components/landing-page/hero";
import { Logos3 as Logos } from "@/components/landing-page/logos";
import { Feature } from "@/components/landing-page/feature";
import { Stats } from "@/components/landing-page/stats";
import { Casestudy as CaseStudy } from "@/components/landing-page/case-study";
import { ForWho } from "@/components/landing-page/for-who";
import { Roadmap } from "@/components/landing-page/roadmap";
import { Faq as FAQ } from "@/components/landing-page/faq";
import { Team } from "@/components/landing-page/team";
import { Cta as CTA } from "@/components/landing-page/cta";
import { Footer } from "@/components/landing-page/footer";
import { Navbar } from "@/components/landing-page/navbar";

export default async function Home() {
  return (
    <>
      <div className="max-w-7xl container ">
        <Navbar />
        <Hero
          images={{
            first: "https://shadcnblocks.com/images/block/avatar-1.webp",
            second: "https://shadcnblocks.com/images/block/avatar-2.webp",
            third: "https://shadcnblocks.com/images/block/avatar-3.webp",
            fourth: "https://shadcnblocks.com/images/block/avatar-4.webp",
          }}
        />
        <Logos />
        <Feature {...({} as any)} />
        <Stats />
        {/* <CaseStudy /> */}
        <ForWho />
        <Roadmap {...({} as any)} />

        <Team />
        <CTA {...({} as any)} />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
