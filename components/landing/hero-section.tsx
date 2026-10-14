"use client";

import { useState } from "react";
import Image from "next/image";
import { CirclePlay, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";
import { useScheduleAppointment } from "@/components/schedule/schedule-provider";

export function HeroSection() {
  const { hero } = siteConfig;
  const { openSchedule } = useScheduleAppointment();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  return (
    <section
      id="top"
      aria-label="Hero"
      className="relative z-0 w-full overflow-hidden bg-[#020B1E]"
    >
      <div className="relative mx-auto flex min-h-[467px] w-full max-w-[1600px] flex-col lg:flex-row">
        {/* Left copy — same left inset as header logo (pl-6 / sm:pl-8) */}
        <div className="relative z-10 mt-0 flex w-full max-w-[601px] flex-col gap-4 px-5 py-8 sm:mt-5 sm:gap-5 sm:px-8 sm:py-12 lg:py-10 lg:pr-0">
          <h1 className="w-full font-heading text-[32px] leading-[1.08] font-bold tracking-[-0.011em] text-white sm:text-[40px] lg:text-[43px]">
            <span className="block whitespace-normal lg:whitespace-nowrap">
              {hero.titleLine1}
            </span>
            <span className="block text-secondary">{hero.titleLine2}</span>
          </h1>

          <p className="font-secondary text-[15px] leading-[1.35] font-normal tracking-[0.011em] text-white uppercase sm:text-[18px] lg:text-[21px]">
            {hero.eyebrow}
          </p>

          <p className="font-secondary text-[15px] leading-[1.45] font-normal text-white sm:text-[16px] lg:text-[17px]">
            {hero.body}
          </p>

          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-2.5">
            <button
              type="button"
              onClick={openSchedule}
              className="inline-flex min-h-[43px] w-full cursor-pointer items-center justify-center bg-bronze px-5 text-center font-secondary text-[12px] font-bold tracking-[0.06em] whitespace-normal text-white uppercase sm:w-auto sm:whitespace-nowrap"
            >
              {hero.primaryCta.label}
            </button>
            <button
              type="button"
              onClick={() => setComingSoonOpen(true)}
              className="inline-flex min-h-[43px] w-full cursor-pointer items-center justify-center gap-2 border-2 border-bronze px-5 text-center font-secondary text-[11px] font-bold tracking-[0.04em] whitespace-normal text-bronze uppercase sm:w-auto sm:whitespace-nowrap"
            >
              <CirclePlay className="size-4 shrink-0" aria-hidden />
              {hero.secondaryCta.label}
            </button>
          </div>
        </div>

        <Dialog.Root open={comingSoonOpen} onOpenChange={setComingSoonOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] max-w-[420px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
              <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
              <Dialog.Title className="pr-8 font-body text-[18px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[20px]">
                Video Coming Soon
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Video Coming Soon
              </Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Right image — in normal flow on mobile; absolute on lg so it can't spill into the footer */}
        <div className="relative isolate h-[260px] w-full shrink-0 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[55%]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            unoptimized
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-[#020B1E] via-[#020B1E]/70 to-transparent lg:w-[45%]"
          />
        </div>
      </div>
    </section>
  );
}
