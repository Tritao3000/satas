import { MoveRight } from "lucide-react";

const Casestudy = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="border border-border">
          <a
            href="#"
            className="group grid gap-4 overflow-hidden px-6 transition-colors duration-500 ease-out hover:bg-muted/40 lg:grid-cols-2 xl:px-28"
          >
            <div className="flex flex-col justify-between gap-4 pt-8 md:pt-16 lg:pb-16">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <img
                  src="https://shadcnblocks.com/images/block/block-1.svg"
                  alt="logo"
                  className="h-9"
                />
                Acme
              </div>
              <div>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  ARTIFICIAL INTELLIGENCE / ENTERPRISE SOLUTIONS
                </span>
                <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                  Workflow Automation for the Digital Age.
                  <span className="font-medium text-primary/50 transition-colors duration-500 ease-out group-hover:text-primary/70">
                    {" "}
                    How to automate your workflow with AI.
                  </span>
                </h2>
                <div className="flex items-center gap-2 font-medium">
                  Read case study
                  <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                </div>
              </div>
            </div>
            <div className="relative isolate py-16">
              <div className="relative isolate h-full border border-border bg-background p-2">
                <div className="h-full overflow-hidden">
                  <img
                    src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                    alt="placeholder"
                    className="aspect-[14/9] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </a>
          <div className="flex border-t border-border">
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
            <div className="grid lg:grid-cols-2">
              <a
                href="#"
                className="group flex flex-col justify-between gap-12 border-border bg-background px-6 py-8 transition-colors duration-500 ease-out hover:bg-muted/40 md:py-16 lg:pb-16 xl:gap-16 xl:border-l xl:pl-8"
              >
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <img
                    src="https://shadcnblocks.com/images/block/block-2.svg"
                    alt="logo"
                    className="h-9"
                  />
                  Super
                </div>
                <div>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    DATA MIGRATION / SOFTWARE SOLUTIONS
                  </span>
                  <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                    Enhance data migration with AI.
                    <span className="font-medium text-primary/50 transition-colors duration-500 ease-out group-hover:text-primary/70">
                      {" "}
                      A data migration platform toward a data-driven future.
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 font-medium">
                    Read case study
                    <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                  </div>
                </div>
              </a>

              <a
                href="#"
                className="group flex flex-col justify-between gap-12 border-t border-border bg-background px-6 py-8 transition-colors duration-500 ease-out hover:bg-muted/40 md:py-16 lg:border-t-0 lg:border-l lg:pb-16 xl:gap-16 xl:border-r xl:pl-8"
              >
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <img
                    src="https://shadcnblocks.com/images/block/block-3.svg"
                    alt="logo"
                    className="h-9"
                  />
                  Advent
                </div>
                <div>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    ARTIFICIAL INTELLIGENCE / DATA SOLUTIONS
                  </span>
                  <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                    Strategic AI for a future-proof business.
                    <span className="font-medium text-primary/50 transition-colors duration-500 ease-out group-hover:text-primary/70">
                      {" "}
                      Mastering AI for more efficient operations.
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 font-medium">
                    Read case study
                    <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            </div>
            <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Casestudy };
