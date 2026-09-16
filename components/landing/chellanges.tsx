"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone, Check, Compass } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ChallengesProps {
  sectionNumber?: number | string;
}

export function Challenges({ sectionNumber = 5 }: ChallengesProps) {
  const { challenges } = siteConfig;

  // Two independent inline panels driven by the two CTAs
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const revenuePanelRef = useRef<HTMLDivElement>(null);
  const detailsPanelRef = useRef<HTMLDivElement>(null);

  // Escape closes the open panels (deepest/last first)
  useEffect(() => {
    if (!revenueOpen && !detailsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (detailsOpen) setDetailsOpen(false);
      else if (revenueOpen) setRevenueOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revenueOpen, detailsOpen]);

  const toggleRevenue = () => {
    const willExpand = !revenueOpen;
    setRevenueOpen(willExpand);
    if (!willExpand) {
      revenuePanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const toggleDetails = () => {
    const willExpand = !detailsOpen;
    setDetailsOpen(willExpand);
    if (!willExpand) {
      detailsPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

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

        {/* Primary MORE CTA — toggles the revenue panel inline (no popup) */}
        <div className="mt-4 flex w-full max-w-[1280px] justify-center sm:justify-end">
          <button
            type="button"
            onClick={toggleRevenue}
            aria-expanded={revenueOpen}
            aria-controls="challenges-revenue"
            className="inline-flex h-[40px] w-full sm:w-[200px] cursor-pointer items-center justify-center bg-[#b17411] px-6 font-secondary text-[13px] font-bold leading-none tracking-[0.4em] text-white uppercase shadow-sm hover:bg-[#8f5d0e]"
          >
            {revenueOpen ? "LESS" : "MORE"}
          </button>
        </div>

        {/* Expandable revenue panel — animates open and pushes the next content down */}
        <div
          id="challenges-revenue"
          ref={revenuePanelRef}
          className={cn(
            "grid w-full max-w-[1280px] transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none",
            revenueOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div
              aria-hidden={!revenueOpen}
              inert={!revenueOpen}
              className={cn(
                "mt-6 rounded-2xl bg-white p-6 shadow-lg transition-opacity duration-300 ease-in-out sm:p-10",
                revenueOpen ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <span className="block w-full text-center font-body text-[11px] font-bold tracking-wider text-[#001528] uppercase sm:text-[13px] lg:text-[15px]">
                {challenges.modal.title}
              </span>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            </div>
          </div>
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

        {/* Investment Area incorporating Typical Engagement & Industry Neutral */}
        <div className="mt-8 w-full max-w-[1280px]">
          {/* Section Heading: Investment */}
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

          <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5C5F66] max-w-[1100px]">
            {challenges.investment.description}
          </p>

          {/* Cards Row: Typical Engagement & Industry Neutral + CTA Button */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 items-stretch">
            {/* Left Card: Typical Engagement */}
            <div className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs md:col-span-7">
              <div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/p13.svg"
                    alt="Typical Engagement Icon"
                    width={22}
                    height={22}
                    className="size-5.5 object-contain"
                    unoptimized
                  />
                  <h5 className="font-body text-[15px] font-extrabold tracking-wide text-[#001528] uppercase">
                    {challenges.typicalEngagement.title}
                  </h5>
                </div>
                <ul className="mt-3.5 flex flex-col gap-2.5 font-body text-[13px] text-[#5C5F66]">
                  {challenges.typicalEngagement.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#b17411]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 border-t border-gray-100 pt-3 font-body text-[12px] font-bold italic text-[#b17411]">
                {challenges.typicalEngagement.footer}
              </p>
            </div>

            {/* Right Card / Block: Blue Industry Neutral Notice & CTA Button */}
            <div className="flex flex-col justify-between gap-5 md:col-span-5">
              {/* Blue Industry Neutral Box */}
              <div className="flex flex-col justify-center rounded-2xl bg-[#001528] p-6 text-white shadow-sm h-full">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Compass className="size-5 shrink-0 text-[#b17411]" />
                  <span className="font-body text-[12px] font-extrabold tracking-wider text-white uppercase">
                    Industry Neutral
                  </span>
                </div>
                <p className="font-body text-[13px] leading-relaxed text-gray-300">
                  {challenges.modal.industryNeutralNotice}
                </p>
              </div>

              {/* HOW IS OUR FEE DETERMINED CTA Button */}
              <button
                type="button"
                onClick={toggleDetails}
                aria-expanded={detailsOpen}
                aria-controls="challenges-details"
                className="mt-2 inline-flex h-[38px] w-full sm:w-fit cursor-pointer items-center justify-center bg-[#b17411] px-5 font-body text-[11px] font-bold tracking-wider text-white uppercase shadow-xs hover:bg-[#8f5d0e]"
              >
                {detailsOpen
                  ? "HOW IS OUR FEE DETERMINED? — LESS ›"
                  : challenges.investment.buttonText}
              </button>
            </div>
          </div>

          {/* Expandable Fee Determined Dropdown Panel */}
          <div
            id="challenges-details"
            ref={detailsPanelRef}
            className={cn(
              "grid w-full transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none",
              detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <div
                aria-hidden={!detailsOpen}
                inert={!detailsOpen}
                className={cn(
                  "mt-6 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-md transition-opacity duration-300 ease-in-out",
                  detailsOpen ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <h4 className="font-body text-[16px] font-extrabold tracking-wide text-[#001528] uppercase">
                  {challenges.investment.feeDetermined.title}
                </h4>
                <p className="mt-2 font-body text-[14px] font-semibold text-[#001528]">
                  {challenges.investment.feeDetermined.intro}
                </p>

                <ul className="mt-3.5 flex flex-col gap-2.5 font-body text-[13px] text-[#5C5F66]">
                  {challenges.investment.feeDetermined.bullets.map(
                    (bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-[#b17411]" />
                        <span>{bullet}</span>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-5 rounded-xl border border-gray-200/70 bg-[#FAF9F5] p-4.5 text-[#001528]">
                  <p className="font-body text-[13px] font-semibold leading-relaxed">
                    {challenges.investment.feeDetermined.footer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const ChallengesSection = Challenges;
export default Challenges;
