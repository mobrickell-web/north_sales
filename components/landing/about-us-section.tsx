import { siteConfig } from "@/config/site";
import { MeetTheFounderDialog } from "@/components/landing/meet-the-founder-dialog";

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
        <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
          {aboutUs.title}
        </span>

        <h2
          id="about-us-heading"
          className="max-w-[900px] font-body text-[20px] font-bold tracking-[0.04em] text-primary uppercase sm:text-[22px]"
        >
          {aboutUs.heading}
        </h2>

        <p className="max-w-[900px] font-body text-[14px] font-extrabold tracking-[0.06em] text-[#061525] uppercase sm:text-[15px]">
          {aboutUs.tagline}
        </p>

        <div className="flex w-full max-w-[1320px] flex-col gap-5">
          {aboutUs.experienceParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {aboutUs.sections.map((section) => (
          <div
            key={section.heading}
            className="flex w-full max-w-[1320px] flex-col gap-5 border-t border-black/8 pt-8"
          >
            <h3 className="max-w-[900px] font-body text-[18px] font-bold tracking-[0.04em] text-primary uppercase sm:text-[20px]">
              {section.heading}
            </h3>

            {"tagline" in section && section.tagline ? (
              <p className="max-w-[900px] font-body text-[14px] font-extrabold tracking-[0.06em] text-[#061525] uppercase sm:text-[15px]">
                {section.tagline}
              </p>
            ) : null}

            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]"
              >
                {paragraph}
              </p>
            ))}

            {"options" in section && section.options ? (
              <ul className="flex flex-col gap-4 pl-0">
                {section.options.map((option) => (
                  <li
                    key={option.title}
                    className="flex gap-3 font-body text-[15px] leading-[1.4] text-[#5C5F66]"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b17411]"
                    />
                    <p>
                      <span className="font-bold text-[#001528]">
                        {option.title}
                      </span>{" "}
                      {option.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            {"closingParagraphs" in section && section.closingParagraphs
              ? section.closingParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]"
                  >
                    {paragraph}
                  </p>
                ))
              : null}
          </div>
        ))}

        <div className="border-t border-black/8 pt-6">
          <MeetTheFounderDialog />
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
