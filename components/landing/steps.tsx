"use client";

import Image from "next/image";
import { Search, Settings, Check } from "lucide-react";
import { siteConfig } from "@/config/site";

interface StepsProps {
  sectionNumber?: number | string;
}

export function Steps({ sectionNumber = 4 }: StepsProps) {
  const { salesEngagement } = siteConfig;

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
      id="steps"
      aria-labelledby="sales-engagement-heading"
      className="relative w-full overflow-hidden bg-white py-12 lg:py-16"
    >
      {/* Top Left Corner Section Indicator Number */}
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

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
                <div className="relative flex size-[110px] items-center justify-center rounded-full border border-[#001528] bg-[#F8F9FA] shadow-xs">
                  {renderStepIcon(index)}
                </div>

                {/* Connecting Gold Arrow */}
                {index < salesEngagement.steps.length - 1 && (
                  <div className="hidden lg:absolute lg:left-[calc(50%+55px)] lg:top-[55px] lg:z-10 lg:flex lg:w-[calc(100%-110px)] lg:-translate-y-1/2 lg:items-center lg:justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                <h3 className="mt-3 font-body text-[14px] font-extrabold tracking-[0.05em] text-primary uppercase">
                  {step.title}
                </h3>

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
    </section>
  );
}
