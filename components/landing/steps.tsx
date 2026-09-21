"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, Settings, Check, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";

interface StepsProps {
  sectionNumber?: number | string;
}

export function Steps({ sectionNumber = 4 }: StepsProps) {
  const { salesEngagement } = siteConfig;
  const [popup, setPopup] = useState<{
    title: string;
    paragraphs: readonly string[];
    list?: readonly string[];
    nextStep?: string;
  } | null>(null);

  const stepListIntroPhrases = [
    "This may include understanding:",
    "Depending on the engagement, this can include:",
    "Depending on what the assessment reveals, the plan may address:",
    "Implementation may involve:",
    "We can review:",
    "That can include:",
  ] as const;

  const openStepPopout = (
    popout: (typeof salesEngagement.steps)[number]["popout"],
  ) => {
    if (!popout) return;
    setPopup({
      title: popout.title,
      paragraphs: popout.paragraphs,
      list: "list" in popout ? popout.list : undefined,
      nextStep: "nextStep" in popout ? popout.nextStep : undefined,
    });
  };

  // Custom step renderer to mix Lucide React icons with local SVG assets
  const renderStepIcon = (index: number) => {
    switch (index) {
      case 0: // Step 1: Discover (Lucide React)
        return <Search className="size-10 text-[#001528]" strokeWidth={2.2} />;
      case 1: // Step 2: Assess (Local SVG)
        return (
          <Image
            src="/icons/access.svg"
            alt="Assess"
            width={48}
            height={48}
            className="size-12 object-contain"
            unoptimized
          />
        );
      case 2: // Step 3: Design (Local SVG)
        return (
          <Image
            src="/icons/design (2).svg"
            alt="Design"
            width={48}
            height={48}
            className="size-12 object-contain"
            unoptimized
          />
        );
      case 3: // Step 4: Implement (Lucide React)
        return (
          <Settings className="size-10 text-[#001528]" strokeWidth={2.2} />
        );
      case 4: // Step 5: Optimize (Local SVG)
        return (
          <Image
            src="/icons/optimize.svg"
            alt="Optimize"
            width={48}
            height={48}
            className="size-12 object-contain"
            unoptimized
          />
        );
      case 5: // Step 6: Sustain (Lucide React)
        return <Check className="size-10 text-[#001528]" strokeWidth={2.8} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="our-60-day-focus"
      aria-labelledby="sales-engagement-heading"
      className="relative w-full overflow-hidden bg-white py-12 lg:py-16"
    >
      {/* Top Left Corner Section Indicator Number */}
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <Dialog.Root
        open={!!popup}
        onOpenChange={(open) => !open && setPopup(null)}
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
          {/* Header Badge & Title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
              {salesEngagement.badge}
            </span>
            <h2
              id="sales-engagement-heading"
              className="max-w-[800px] font-body text-[20px] font-extrabold tracking-[0.02em] text-primary uppercase sm:text-[24px]"
            >
              {salesEngagement.title}
            </h2>
            {salesEngagement.subtitle && (
              <p className="mt-2 max-w-[900px] font-body text-[14px] leading-relaxed text-gray-600 sm:text-[16px]">
                {salesEngagement.subtitle}
              </p>
            )}
          </div>

          {/* 6 Steps Grid Flow */}
          <div className="mt-12 w-full max-w-[1280px]">
            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
              {salesEngagement.steps.map((step, index) => (
                <li
                  key={step.stepNumber}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Circle Icon Container */}
                  <button
                    type="button"
                    onClick={() => openStepPopout(step.popout)}
                    className="group flex cursor-pointer flex-col items-center text-center transition-opacity hover:opacity-90 focus:outline-none"
                  >
                    <div className="relative flex size-[110px] items-center justify-center rounded-full border border-[#001528] bg-[#F8F9FA] shadow-xs transition-shadow group-hover:shadow-md">
                      {renderStepIcon(index)}
                    </div>
                  </button>

                  {/* Connecting Gold Arrow */}
                  {index < salesEngagement.steps.length - 1 && (
                    <div className="hidden lg:absolute lg:left-[calc(50%+55px)] lg:top-[55px] lg:z-10 lg:flex lg:w-[calc(100%-110px)] lg:-translate-y-1/2 lg:items-center lg:justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12H19M19 12L13 6M19 12L13 18"
                          stroke="#b17411"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Step Number Badge */}
                  <div className="mt-4 flex size-6 items-center justify-center rounded-full bg-[#001528] text-[12px] font-bold text-white">
                    {step.stepNumber}
                  </div>

                  {/* Step Title */}
                  <button
                    type="button"
                    onClick={() => openStepPopout(step.popout)}
                    className="mt-3 cursor-pointer font-body text-[14px] font-extrabold tracking-[0.05em] text-primary uppercase transition-colors hover:text-[#b17411] focus:outline-none"
                  >
                    {step.title}
                  </button>

                  {/* Step Description */}
                  <p className="mt-2 font-body text-[12px] leading-snug font-normal text-[#5C5F66]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Bottom Banner */}
          <div className="mt-14 w-full max-w-[1280px] bg-[#001528] px-8 py-6 shadow-lg sm:px-12">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="flex shrink-0 items-center justify-center">
                <Image
                  src="/icons/users.svg"
                  alt="Users"
                  width={64}
                  height={64}
                  className="size-16 object-contain"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-body text-[18px] font-extrabold tracking-[0.04em] text-white uppercase sm:text-[20px]">
                  {salesEngagement.banner.title}
                </h4>
                <p className="font-body text-[14px] font-normal leading-relaxed text-gray-300">
                  {salesEngagement.banner.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Pop-out Box / Dialog — matches proven-results-section design */}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-full max-w-[620px] max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            {popup && (
              <div className="flex flex-col gap-3">
                <Dialog.Title className="font-body text-[16px] font-extrabold tracking-wide text-[#061525] uppercase sm:text-[18px]">
                  {popup.title}
                </Dialog.Title>
                <Dialog.Description asChild>
                  <div className="flex flex-col gap-3 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {popup.paragraphs.map((paragraph, index) => {
                      const showListAfter =
                        popup.list &&
                        popup.list.length > 0 &&
                        stepListIntroPhrases.includes(
                          paragraph as (typeof stepListIntroPhrases)[number],
                        );
                      return (
                        <div key={`${paragraph}-${index}`}>
                          <p>{paragraph}</p>
                          {showListAfter && popup.list && (
                            <ul className="mt-2 list-disc space-y-1.5 pl-5">
                              {popup.list.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                    {popup.nextStep && (
                      <div className="mt-2 border-t border-gray-100 pt-4">
                        <p className="font-body text-[13px] font-extrabold tracking-wide text-[#001528] uppercase">
                          A Clear Next Step
                        </p>
                        <p className="mt-2">{popup.nextStep}</p>
                      </div>
                    )}
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
