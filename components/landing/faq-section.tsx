// components/FaqSection.tsx

import { siteConfig } from "@/config/site";

interface FaqSectionProps {
  sectionNumber?: number | string;
}

export function FaqSection({ sectionNumber = 7 }: FaqSectionProps) {
  const { faq } = siteConfig;

  return (
    <section
      id="faqs"
      aria-labelledby="faq-heading"
      className="relative w-full bg-white overflow-hidden"
    >
      {/* Top Left Corner Indicator Number ("7") */}
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 py-8 sm:px-10 lg:px-[80px] lg:pt-4 lg:pb-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 font-body text-[10px] font-semibold tracking-[0.08em] text-bronze uppercase">
            {faq.badge}
          </span>
          <h2
            id="faq-heading"
            className="font-body text-[18px] leading-none font-extrabold tracking-[0.15em] text-[#061525] text-center uppercase"
          >
            {faq.title}
          </h2>
        </div>

        <div className="mt-8 grid w-full max-w-[1280px] grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-5">
          {faq.questions.map((faqItem, index) => (
            <details
              key={faqItem.question}
              className="group overflow-hidden rounded-[8px] bg-[#EBEBEB]"
            >
              <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-body text-[16px] leading-[1.4] font-bold text-[#111111] marker:hidden sm:px-7">
                <span>
                  <span className="font-bold">{index + 1}.</span>{" "}
                  {faqItem.question}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-[24px] font-normal leading-none text-[#111111] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="flex flex-col gap-2 px-6 pb-5 sm:px-7">
                {faqItem.answer.map((block, blockIndex) =>
                  typeof block === "string" ? (
                    <p
                      key={blockIndex}
                      className="font-body text-[14px] leading-[1.5] text-[#3A3A3A]"
                    >
                      {block}
                    </p>
                  ) : (
                    <ul key={blockIndex} className="flex flex-col gap-1.5 pl-1">
                      {block.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-2 font-body text-[14px] leading-[1.5] text-[#3A3A3A]"
                        >
                          <span
                            aria-hidden
                            className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-bronze"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
