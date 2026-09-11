// components/ProvenResultsSection.tsx

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ProvenResultsSectionProps {
  sectionNumber?: number | string;
}

export function ProvenResultsSection({
  sectionNumber = 2,
}: ProvenResultsSectionProps) {
  const { results } = siteConfig;

  return (
    <section
      id="results"
      aria-labelledby="results-heading"
      className="relative w-full overflow-hidden bg-white"
    >
      {/* Top Left Corner Indicator Number ("2") */}
      <div className="absolute left-4 top-3 select-none font-secondary text-[36px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 pt-20 pb-14 sm:px-10 sm:pt-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-[82px] lg:py-12">
        {/* Left — 484px */}
        <div className="flex w-full max-w-[484px] shrink-0 flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-[20px] border-[0.5px] border-black/15 bg-white px-4 py-1.5 font-body text-[12px] font-semibold tracking-[0.08em] text-bronze uppercase">
            {results.badge}
          </span>

          <h2
            id="results-heading"
            className="font-body text-[24px] leading-[1.15] font-extrabold tracking-[-0.005em] text-primary uppercase sm:text-[26px]"
          >
            {results.title}
          </h2>

          <p className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]">
            {results.intro}
          </p>

          <ul className="m-0 grid w-full list-none grid-cols-1 grid-rows-none gap-x-6 gap-y-3 p-0 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3">
            {results.bullets.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 font-body text-[14px] leading-snug font-semibold text-primary"
              >
                <Image
                  src={results.checkmark}
                  alt=""
                  width={16}
                  height={16}
                  className="mt-0.5 size-4 shrink-0"
                  unoptimized
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="font-body text-[16px] leading-none font-extrabold tracking-[0.05em] text-bronze uppercase sm:text-[20px]">
            {results.tagline}
          </p>
        </div>

        {/* Right — stats panel */}
        <div className="relative w-full overflow-hidden bg-[#001528] lg:min-h-[325px] lg:min-w-0 lg:flex-1">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 70% 40%, rgba(255,255,255,0.18), transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.06), transparent 40%)",
            }}
          />

          <div className="relative flex h-full min-h-[253px] w-full flex-col sm:flex-row sm:items-stretch lg:px-2 lg:py-9">
            {results.stats.map((stat, index) => (
              <div
                key={stat.value}
                className={cn(
                  "flex w-full flex-col gap-3 px-6 py-8 text-left sm:min-w-0 sm:flex-1 sm:px-6 sm:py-0",
                  index > 0 &&
                    "border-t border-[#E89B2D] sm:border-t-0 sm:border-l",
                )}
              >
                <p className="font-heading text-[44px] leading-none font-bold tracking-tight text-[#E89B2D] sm:text-[48px]">
                  {stat.value}
                </p>
                <p className="font-body text-[15px] leading-[1.4] font-normal text-white">
                  {stat.description}
                </p>
                <div className="mt-auto flex flex-col items-start gap-1 pt-6">
                  <p className="font-body text-[16px] leading-none font-semibold tracking-[0.05em] text-[#94A3B8] uppercase">
                    Source:
                  </p>
                  <p className="font-body text-[15px] leading-[1.4] font-normal text-white">
                    {stat.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
