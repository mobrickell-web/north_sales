"use client";

import { useState } from "react";
import { Compass, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";

interface InvestmentSectionProps {
  sectionNumber?: number | string;
}

type InvestmentPopup = {
  title: string;
  fee: string;
  intro: string;
  includedHeading: string;
  groups: readonly {
    title: string;
    intro?: string;
    items?: readonly string[];
    outro?: string;
  }[];
  outcomeHeading: string;
  outcomeParagraphs: readonly string[];
};

export function InvestmentSection({
  sectionNumber = 6,
}: InvestmentSectionProps) {
  const { challenges } = siteConfig;
  const { investment } = challenges;
  const [popup, setPopup] = useState<InvestmentPopup | null>(null);

  return (
    <section
      id="investment"
      aria-labelledby="investment-heading"
      className="relative w-full overflow-hidden bg-[#FAF9F5] py-12 lg:py-16"
    >
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <Dialog.Root
        open={!!popup}
        onOpenChange={(open) => !open && setPopup(null)}
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-2 text-center">
            <h2
              id="investment-heading"
              className="font-body text-[20px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[24px]"
            >
              <span className="block">{investment.title}</span>
              <span className="mt-1 block">{investment.subtitle}</span>
            </h2>
          </div>

          <ol className="mt-8 flex w-full max-w-[1100px] list-none flex-col gap-4 p-0">
            {investment.tiers.map((tier, index) => (
              <li key={tier.title}>
                <button
                  type="button"
                  onClick={() =>
                    setPopup({
                      title: tier.popout.title,
                      fee: tier.popout.fee,
                      intro: tier.popout.intro,
                      includedHeading: tier.popout.includedHeading,
                      groups: tier.popout.groups,
                      outcomeHeading: tier.popout.outcomeHeading,
                      outcomeParagraphs: tier.popout.outcomeParagraphs,
                    })
                  }
                  className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-2 text-left transition-colors hover:border-[#b17411]/25 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#b17411]/40"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#001528] font-body text-[12px] font-bold text-white transition-colors group-hover:bg-[#b17411]">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-body text-[14px] font-extrabold leading-snug text-[#001528] sm:text-[15px]">
                      {tier.title}
                    </p>
                    <p className="font-body text-[13px] leading-relaxed text-[#5C5F66]">
                      {tier.description}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-8 w-full max-w-[1100px] rounded-2xl bg-[#001528] p-6 text-white shadow-sm">
            <div className="mb-2.5 flex items-center gap-2.5">
              <Compass className="size-5 shrink-0 text-[#b17411]" />
              <span className="font-body text-[12px] font-extrabold tracking-wider text-white uppercase">
                Industry Neutral
              </span>
            </div>
            <p className="font-body text-[13px] leading-relaxed text-gray-300">
              {challenges.modal.industryNeutralNotice}
            </p>
          </div>
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[620px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            {popup && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 pr-8">
                  <Dialog.Title className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
                    {popup.title}
                  </Dialog.Title>
                  <p className="font-body text-[16px] font-extrabold tracking-wide text-[#061525] sm:text-[18px]">
                    {popup.fee}
                  </p>
                </div>
                <Dialog.Description asChild>
                  <div className="flex flex-col gap-5 font-body text-[14px] leading-relaxed text-[#5C5F66] sm:text-[15px]">
                    <p>{popup.intro}</p>

                    <div className="flex flex-col gap-4">
                      <h4 className="font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]">
                        {popup.includedHeading}
                      </h4>
                      {popup.groups.map((group) => (
                        <div key={group.title} className="flex flex-col gap-2">
                          <h5 className="font-body text-[14px] font-extrabold text-[#001528] sm:text-[15px]">
                            {group.title}
                          </h5>
                          {group.intro && <p>{group.intro}</p>}
                          {group.items && group.items.length > 0 && (
                            <ul className="list-disc space-y-1.5 pl-5">
                              {group.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}
                          {group.outro && <p>{group.outro}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]">
                        {popup.outcomeHeading}
                      </h4>
                      <div className="mt-3 flex flex-col gap-3">
                        {popup.outcomeParagraphs.map((paragraph, index) => (
                          <p key={`${paragraph}-${index}`}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Description>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

export default InvestmentSection;
