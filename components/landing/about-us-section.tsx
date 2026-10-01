import { siteConfig } from "@/config/site";

interface AboutUsSectionProps {
  sectionNumber?: number | string;
}

export function AboutUsSection({ sectionNumber = 1 }: AboutUsSectionProps) {
  const { aboutUs } = siteConfig;

  return (
    <section
      id="about-us"
      aria-labelledby="about-us-heading"
      className="relative w-full overflow-hidden bg-white"
    >
      {/* Top Left Corner Indicator Number ("2") */}
      <div className="absolute left-4 top-3 select-none font-secondary text-[36px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 pt-20 pb-14 sm:px-10 sm:pt-14 lg:px-[82px] lg:py-12">
        {/* Pill title, same design as the RESULTS badge */}
        <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
          {aboutUs.title}
        </span>

        <h2
          id="about-us-heading"
          className="max-w-[720px] font-body text-[20px] font-bold tracking-[0.04em] text-primary uppercase sm:text-[22px]"
        >
          {aboutUs.heading}
        </h2>

        <div className="flex w-full max-w-[1320px] flex-col gap-5">
          {aboutUs.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
