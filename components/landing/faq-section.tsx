// components/FaqSection.tsx

import { siteConfig } from "@/config/site";

interface FaqSectionProps {
  sectionNumber?: number | string;
}

export function FaqSection({ sectionNumber = 7 }: FaqSectionProps) {
  const { faq } = siteConfig;
  const columns = [faq.questions.slice(0, 6), faq.questions.slice(6)];

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

        <div className="mt-5 flex w-full max-w-[1280px] flex-col gap-0 lg:flex-row lg:gap-6">
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={
                columnIndex === 0
                  ? "w-full overflow-hidden rounded-t-[4px] border border-[#D8DCE3] lg:w-[628px] lg:rounded-[4px]"
                  : "-mt-px w-full overflow-hidden rounded-b-[4px] border border-[#D8DCE3] lg:mt-0 lg:w-[628px] lg:rounded-[4px]"
              }
            >
              {column.map((faqItem) => (
                <details
                  key={faqItem.question}
                  className="group border-b border-[#D8DCE3] last:border-b-0"
                >
                  <summary className="flex min-h-[50px] cursor-pointer list-none items-center justify-between gap-4 px-7 font-body text-[16px] leading-[1.4] font-medium text-[#1B2A4A] marker:hidden">
                    <span>{faqItem.question}</span>
                    <span
                      aria-hidden
                      className="text-[22px] leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="flex flex-col gap-2 px-7 pb-4">
                    {faqItem.answer.map((block, index) =>
                      typeof block === "string" ? (
                        <p
                          key={index}
                          className="font-body text-[14px] leading-[1.4] text-[#5C5F66]"
                        >
                          {block}
                        </p>
                      ) : (
                        <ul key={index} className="flex flex-col gap-1.5 pl-1">
                          {block.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="flex gap-2 font-body text-[14px] leading-[1.4] text-[#5C5F66]"
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
          ))}
        </div>
      </div>
    </section>
  );
}
