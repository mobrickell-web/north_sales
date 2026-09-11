"use client";

import Image from "next/image";
import {
  X,
  CalendarDays,
  UserRound,
  Globe,
  ShieldLock,
  Target,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Lucide Icons Map
const iconMap: Record<string, React.ReactNode> = {
  "/icons/user.svg": (
    <UserRound className="size-12 stroke-[1.8] text-primary" />
  ),
  "/icons/calendar.svg": (
    <CalendarDays className="size-12 stroke-[1.8] text-primary" />
  ),
  "/icons/globe.svg": <Globe className="size-12 stroke-[1.8] text-primary" />,
  "/icons/shield-lock.svg": (
    <ShieldLock className="size-12 stroke-[1.8] text-primary" />
  ),
  "/icons/target.svg": <Target className="size-12 stroke-[1.8] text-primary" />,
};

export function WhyPartnerSection() {
  const { whyChooseUs } = siteConfig;

  return (
    <section
      id="why-partner"
      aria-labelledby="why-partner-heading"
      className="relative w-full overflow-hidden bg-[#F2F2F3] py-10 lg:py-14"
    >
      {/* Top Left Indicator ("1") */}
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        1
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
            {whyChooseUs.badge}
          </span>
          <h2
            id="why-partner-heading"
            className="max-w-[720px] font-body text-[18px] font-bold tracking-[0.04em] text-primary uppercase sm:text-[22px]"
          >
            {whyChooseUs.title}
          </h2>
        </div>

        {/* Main 5 Pillars Row */}
        <ul className="mt-8 grid w-full max-w-[1280px] grid-cols-1 list-none p-0 md:grid-cols-3 lg:mt-10 lg:grid-cols-5">
          {whyChooseUs.pillars.map((pillar, index) => (
            <li
              key={pillar.id}
              className={cn(
                "flex flex-col items-center px-4 py-6 text-center lg:py-0",
                index > 0 &&
                  "border-t border-black/10 md:border-t-0 md:border-l",
              )}
            >
              <div className="flex h-14 items-center justify-center">
                {iconMap[pillar.icon] || (
                  <Image
                    src={pillar.icon}
                    alt={pillar.title}
                    width={48}
                    height={48}
                    className="size-12 object-contain"
                    unoptimized
                  />
                )}
              </div>
              <h3 className="mt-2 font-body text-[13px] font-bold tracking-[0.04em] text-primary uppercase">
                {pillar.title}
              </h3>
              <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5C5F66]">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="mt-8 flex w-full max-w-[1280px] justify-center sm:justify-end sm:pr-4">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-[43px] w-full sm:w-[213px] cursor-pointer items-center justify-center bg-bronze px-[24px] font-secondary text-[10px] font-bold leading-none tracking-[0.5em] text-white uppercase shadow-md transition-all hover:bg-[#8f5d0e] focus:outline-none focus:ring-2 focus:ring-ring"
              >
                MORE
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-full max-w-[1100px] max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-12">
                <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
                  {/* Top row: Close */}
                  <div className="flex justify-end">
                    <Dialog.Close className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none">
                      <X className="size-6" />
                      <span className="sr-only">Close</span>
                    </Dialog.Close>
                  </div>

                  {/* Title row — centered on its own line */}
                  <Dialog.Title className="w-full text-center font-body text-[11px] font-bold tracking-wide text-primary uppercase sm:text-[16px] lg:text-[22px]">
                    {whyChooseUs.modal.title}
                  </Dialog.Title>
                </div>

                {/* Modal Content */}
                <ul className="mt-10 grid grid-cols-1 divide-y divide-black/10 md:grid-cols-5 md:divide-x md:divide-y-0">
                  {whyChooseUs.modal.pillars.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col items-center px-4 py-6 text-center first:pt-0 last:pb-0 md:py-0"
                    >
                      <div className="flex h-14 items-center justify-center">
                        {iconMap[item.icon] || (
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="size-12 object-contain"
                            unoptimized
                          />
                        )}
                      </div>
                      <h3 className="mt-3 font-body text-[13px] font-bold tracking-[0.04em] text-primary uppercase">
                        {item.title}
                      </h3>
                      <p className="mt-2 font-body text-[12px] leading-relaxed text-[#5C5F66]">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </section>
  );
}

export default WhyPartnerSection;
