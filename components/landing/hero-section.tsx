"use client";

import Image from "next/image";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useScheduleAppointment } from "@/components/schedule/schedule-provider";

export function HeroSection({
  hideSecondaryCta = false,
}: {
  hideSecondaryCta?: boolean;
}) {
  const { hero } = siteConfig;
  const { openSchedule } = useScheduleAppointment();
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

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
            {!hideSecondaryCta && (
              <button
                type="button"
                onClick={() => setIsVideoDialogOpen(true)}
                className="inline-flex min-h-[43px] w-full cursor-pointer items-center justify-center border border-gold px-5 text-center font-secondary text-[12px] font-bold tracking-[0.06em] whitespace-normal text-gold uppercase transition-colors hover:bg-gold hover:text-[#001528] sm:w-auto sm:whitespace-nowrap"
              >
                {hero.secondaryCta.label}
              </button>
            )}
          </div>
        </div>

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

      <Dialog.Root open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-[#020B1E] p-6 text-white shadow-2xl sm:p-8">
            <Dialog.Close
              aria-label="Close dialog"
              className="absolute top-3 right-3 rounded-sm p-1 text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <X className="size-5" />
            </Dialog.Close>
            <Dialog.Title className="font-heading text-xl font-bold text-white sm:text-2xl">
              {hero.secondaryCta.label}
            </Dialog.Title>
            <Dialog.Description className="mt-3 font-secondary text-sm leading-6 text-white/80 sm:text-base">
              Video coming soon.
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
