"use client";

// components/ProvenResultsSection.tsx

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ProvenResultsSectionProps {
  sectionNumber?: number | string;
}

export function ProvenResultsSection({
  sectionNumber = 2,
}: ProvenResultsSectionProps) {
  const { results } = siteConfig;
  const [popup, setPopup] = useState<{
    title: string;
    paragraphs: readonly string[];
  } | null>(null);

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
        <Dialog.Root
          open={!!popup}
          onOpenChange={(open) => !open && setPopup(null)}
        >
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
                    "flex w-full flex-col gap-2 px-6 py-6 text-left sm:min-w-0 sm:flex-1 sm:px-6 sm:py-0",
                    index > 0 &&
                      "border-t border-[#E89B2D] sm:border-t-0 sm:border-l",
                  )}
                >
                  <button
                    type="button"
                    onClick={() =>
                      stat.popout &&
                      setPopup({
                        title: stat.popout.title,
                        paragraphs: [stat.popout.description],
                      })
                    }
                    className="group flex cursor-pointer flex-col items-start gap-3 text-left transition-opacity hover:opacity-90 focus:outline-none"
                  >
                    <p className="font-heading text-[44px] leading-none font-bold tracking-tight text-[#E89B2D] sm:text-[48px]">
                      {stat.value}
                    </p>
                    <p className="font-body text-[15px] leading-[1.4] font-normal text-white">
                      {stat.description}
                    </p>
                  </button>
                  <div className="mt-auto flex flex-col items-start gap-1">
                    <p className="font-body text-[16px] leading-none font-semibold tracking-[0.05em] text-[#94A3B8] uppercase">
                      Source:
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setPopup({
                          title: stat.sourceInfo.title,
                          paragraphs: stat.sourceInfo.description,
                        })
                      }
                      className="cursor-pointer text-left font-body text-[15px] leading-[1.4] font-normal text-white underline decoration-[#E89B2D]/60 underline-offset-2 transition hover:text-[#E89B2D] focus:outline-none"
                    >
                      {stat.source}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Pop-out Box / Dialog */}
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
                      {popup.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </Dialog.Description>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </section>
  );
}

export default ProvenResultsSection;
