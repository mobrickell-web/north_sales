"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";

interface SolutionSectionProps {
  sectionNumber?: number | string;
}

export function SolutionSection({ sectionNumber = 6 }: SolutionSectionProps) {
  const { solution } = siteConfig;
  const [selectedBullet, setSelectedBullet] = useState<
    (typeof solution.bullets)[number] | null
  >(null);

  return (
    <section
      id="solutions"
      aria-labelledby="solution-heading"
      className="relative w-full overflow-hidden border-b border-[#D48C27] bg-white"
    >
      {/* Top Left Corner Indicator Number ("6") */}
      <div className="absolute left-4 top-3 select-none font-secondary text-[36px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-5 pt-20 pb-12 sm:px-10 sm:pt-12 lg:flex-row lg:items-stretch lg:px-16 lg:py-16">
        <Dialog.Root
          open={!!selectedBullet}
          onOpenChange={(open) => !open && setSelectedBullet(null)}
        >
          <div className="flex w-full flex-col items-start gap-3 text-left lg:w-[498px] lg:shrink-0 lg:pr-6">
            <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-3 py-1 font-body text-[10px] font-semibold tracking-[0.08em] text-bronze uppercase">
              {solution.badge}
            </span>
            <h2
              id="solution-heading"
              className="text-left font-body text-[20px] font-extrabold uppercase leading-none tracking-[0.08em] text-[#061525]"
            >
              {solution.title}
            </h2>

            <ul className="m-0 mt-2 flex w-full list-none flex-col gap-4 p-0 text-left">
              {solution.bullets.map((bullet) => (
                <li key={bullet.id}>
                  <Dialog.Trigger asChild>
                    <button
                      type="button"
                      onClick={() => setSelectedBullet(bullet)}
                      className="group flex cursor-pointer items-start gap-3 text-left font-body text-[16px] font-medium leading-[1.4] text-primary transition-colors hover:text-[#b17411] focus:outline-none"
                    >
                      <Image
                        src="/icons/checkmark.svg"
                        alt=""
                        width={12}
                        height={12}
                        className="mt-1 size-3 shrink-0"
                        unoptimized
                      />
                      <span className="group-hover:underline">
                        {bullet.label}
                      </span>
                    </button>
                  </Dialog.Trigger>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Pop-out Box / Dialog */}
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-full max-w-[620px] max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
              <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>

              {selectedBullet && (
                <div className="flex flex-col gap-3">
                  <Dialog.Title className="font-body text-[16px] font-extrabold tracking-wide text-[#061525] uppercase sm:text-[18px]">
                    {selectedBullet.title}
                  </Dialog.Title>
                  <Dialog.Description className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {selectedBullet.content}
                  </Dialog.Description>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Right Side Pillars */}
        <ul className="m-0 mt-8 grid w-full list-none grid-cols-2 p-0 lg:mt-0 lg:flex lg:flex-1">
          {solution.pillars.map((pillar, index) => (
            <li
              key={pillar.id}
              className={`flex min-h-[140px] flex-1 flex-col items-center justify-center gap-3 px-4 text-center ${
                index > 0 ? "lg:border-l lg:border-[#D8DCE3]" : ""
              }`}
            >
              <Image
                src={pillar.icon}
                alt=""
                width={64}
                height={64}
                className="size-16"
                unoptimized
              />
              <h3 className="font-body text-[13px] font-extrabold uppercase leading-[1.25] tracking-[0.05em] text-[#061525]">
                {pillar.title}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
