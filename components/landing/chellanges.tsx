"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Check, X, Compass } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";

interface ChallengesProps {
  sectionNumber?: number | string;
}

export function Challenges({ sectionNumber = 5 }: ChallengesProps) {
  const { challenges } = siteConfig;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="challenges"
      aria-labelledby="challenges-heading"
      className="relative w-full overflow-hidden bg-[#FAF9F5] py-12 lg:py-16"
    >
      {/* Section Indicator Number */}
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
        {/* Header Block */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
            {challenges.badge}
          </span>
          <span className="mt-3 font-body text-[13px] font-bold tracking-[0.08em] text-[#b17411] uppercase">
            {challenges.subheading}
          </span>
          <h2
            id="challenges-heading"
            className="mt-1 font-heading text-[28px] font-bold text-[#001528] sm:text-[36px]"
          >
            {challenges.title}
          </h2>
          <p className="mt-3 max-w-[820px] font-body text-[14px] leading-relaxed text-[#5C5F66] sm:text-[15px]">
            {challenges.intro}
          </p>
          <p className="mt-2 font-body text-[15px] font-extrabold text-[#001528] sm:text-[16px]">
            {challenges.highlightText}
          </p>
        </div>

        {/* Challenge Cards Grid */}
        <div className="mt-8 w-full max-w-[1280px]">
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-[#FAF9F5] px-4 font-body text-[12px] font-extrabold tracking-[0.08em] text-[#001528] uppercase">
              {challenges.sectionTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {challenges.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="size-12 object-contain"
                    unoptimized
                  />
                </div>
                <h3 className="mt-4 font-body text-[12px] font-extrabold leading-tight text-[#001528] uppercase">
                  {item.title}
                </h3>
                <p className="mt-2 font-body text-[11px] leading-snug text-[#5C5F66]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Primary MORE CTA */}
        <div className="mt-4 flex w-full max-w-[1280px] justify-center sm:justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-[40px] w-full sm:w-[200px] cursor-pointer items-center justify-center bg-[#b17411] px-6 font-secondary text-[13px] font-bold leading-none tracking-[0.4em] text-white uppercase shadow-sm hover:bg-[#8f5d0e]"
          >
            MORE
          </button>
        </div>

        {/* Audio / Executive Overview Banner */}
        <div className="mt-8 w-full max-w-[1280px] rounded-2xl bg-[#112238] px-8 py-6 text-white shadow-md">
          <div className="flex flex-col items-center justify-start gap-8 md:flex-row md:gap-12">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5">
              <Phone className="size-9 shrink-0 text-white stroke-[2.2]" />
              <div className="flex flex-col">
                <h4 className="font-body text-[15px] font-extrabold tracking-wide text-[#B8860B] uppercase leading-snug">
                  {challenges.audioBanner.title}
                </h4>
                <p className="mt-1 font-body text-[12px] font-bold tracking-wide text-white uppercase">
                  {challenges.audioBanner.subtitle}
                </p>
              </div>
            </div>

            <div className="hidden h-14 w-px bg-gray-500/40 md:block" />

            <div className="flex flex-col gap-1 text-center md:text-left">
              <p className="font-body text-[14px] font-bold text-white">
                {challenges.audioBanner.preferText}
              </p>
              <p className="font-body text-[14px] font-bold text-white">
                {challenges.audioBanner.phoneNumber}
              </p>
              <p className="font-body text-[14px] font-bold text-white">
                {challenges.audioBanner.actionText}
              </p>
            </div>
          </div>
        </div>

        {/* Typical Engagement & Investment Split Row */}
        <div className="mt-8 grid w-full max-w-[1280px] grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Block: Typical Engagement */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/p13.svg"
                alt="Typical Engagement Icon"
                width={24}
                height={24}
                className="size-6 object-contain"
                unoptimized
              />
              <h4 className="font-body text-[16px] font-extrabold tracking-wide text-[#001528] uppercase">
                {challenges.typicalEngagement.title}
              </h4>
            </div>
            <ul className="flex flex-col gap-2.5 font-body text-[13px] text-[#5C5F66]">
              {challenges.typicalEngagement.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#b17411]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="mt-1 font-body text-[12px] font-bold italic text-[#b17411]">
              {challenges.typicalEngagement.footer}
            </p>
          </div>

          {/* Right Block: Investment */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/p13.svg"
                alt="Investment Icon"
                width={24}
                height={24}
                className="size-6 object-contain"
                unoptimized
              />
              <h4 className="font-body text-[16px] font-extrabold tracking-wide text-[#001528] uppercase">
                {challenges.investment.title}
              </h4>
            </div>
            <p className="font-body text-[13px] leading-relaxed text-[#5C5F66]">
              {challenges.investment.description}
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="mt-2 inline-flex h-[38px] w-full sm:w-fit cursor-pointer items-center justify-center bg-[#b17411] px-5 font-body text-[11px] font-bold tracking-wider text-white uppercase shadow-xs hover:bg-[#8f5d0e]"
            >
              {challenges.investment.buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] sm:w-full max-w-[1150px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 sm:p-10">
            {/* Modal Header — two rows so title never wraps against close button */}
            <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
              {/* Top row: Close */}
              <div className="flex justify-end">
                <Dialog.Close className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none">
                  <X className="size-6" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </div>

              {/* Title row — centered on its own line */}
              <span className="w-full text-center font-body text-[11px] font-bold tracking-wider text-[#001528] uppercase sm:text-[13px] lg:text-[15px]">
                {challenges.modal.title}
              </span>
            </div>

            <div className="flex flex-col gap-8 mt-6">
              {/* Revenue Tier Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
                  <Image
                    src="/icons/p15.svg"
                    alt="Improvement Icon"
                    width={80}
                    height={80}
                    className="size-20 object-contain"
                    unoptimized
                  />
                </div>

                {challenges.modal.revenueTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-5 text-center shadow-xs"
                  >
                    <span className="font-body text-[20px] font-extrabold text-[#001528]">
                      {tier.revenue}
                    </span>
                    <span className="font-body text-[10px] font-bold text-gray-500 uppercase">
                      {tier.label}
                    </span>
                    <span className="mt-2 font-body text-[10px] text-gray-500">
                      5-10% improvement =
                    </span>
                    <span className="font-body text-[22px] font-extrabold text-[#001528]">
                      {tier.gain}
                    </span>
                    <span className="font-body text-[10px] text-gray-500">
                      {tier.sub}
                    </span>
                  </div>
                ))}

                <div className="flex items-center rounded-xl border border-gray-200 bg-white p-5 text-left">
                  <p className="font-body text-[12px] font-bold leading-relaxed text-[#001528]">
                    {challenges.modal.impactNotice}
                  </p>
                </div>
              </div>

              {/* 3 Columns Details Section */}
              <div className="grid grid-cols-1 gap-8 border-t border-gray-200 pt-6 md:grid-cols-3">
                {/* Column 1: Who We Work With */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                    {challenges.modal.whoWeWorkWithTitle}
                  </h4>
                  <ul className="flex flex-col gap-2.5 font-body text-[12px] text-[#5C5F66]">
                    {challenges.modal.whoWeWorkWith.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-[#b17411]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2 flex items-start gap-3 rounded-lg bg-[#001528] p-3 text-white">
                    <Compass className="size-5 shrink-0 text-white" />
                    <p className="font-body text-[10px] leading-snug">
                      {challenges.modal.industryNeutralNotice}
                    </p>
                  </div>
                </div>

                {/* Column 2: Why Us */}
                <div className="flex flex-col gap-3 border-l-0 border-gray-100 pl-0 md:border-l md:pl-6">
                  <h4 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                    {challenges.modal.whyUsTitle}
                  </h4>
                  <ul className="flex flex-col gap-2.5 font-body text-[12px] text-[#5C5F66]">
                    {challenges.modal.whyUs.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-[#b17411]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Typical Engagement Details */}
                <div className="flex flex-col gap-4 border-l-0 border-gray-100 pl-0 md:border-l md:pl-6">
                  <h4 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                    {challenges.modal.typicalDetailsTitle}
                  </h4>
                  <div className="flex flex-col gap-4 font-body text-[12px]">
                    {challenges.modal.typicalDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Image
                          src={detail.icon}
                          alt={detail.title}
                          width={24}
                          height={24}
                          className="size-6 object-contain"
                          unoptimized
                        />
                        <div>
                          <p className="font-bold text-[#001528]">
                            {detail.title}
                          </p>
                          <p className="text-gray-500">{detail.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

export const ChallengesSection = Challenges;
export default Challenges;
