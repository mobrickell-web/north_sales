"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone, Compass, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ChallengesProps {
  sectionNumber?: number | string;
}

type ChallengePopup = {
  kind: "challenge";
  title: string;
  paragraphs: readonly string[];
  list?: readonly string[];
  nextStep?: string;
  cardHeading?: string;
};

type InvestmentPopup = {
  kind: "investment";
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

type PopupState = ChallengePopup | InvestmentPopup;

export function Challenges({ sectionNumber = 5 }: ChallengesProps) {
  const { challenges } = siteConfig;

  const [revenueOpen, setRevenueOpen] = useState(false);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const challengeListIntroPhrases = [
    "Inconsistent revenue can result from several different issues, including:",
    "We evaluate areas such as:",
    "That can include clearly defined expectations around:",
    "Problems can occur when there is:",
    "Common symptoms include:",
    "That can include evaluating:",
  ] as const;

  const renderChallengePopupBody = (active: ChallengePopup) => (
    <div className="flex flex-col gap-3">
      {active.cardHeading && (
        <p className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
          {active.cardHeading}
        </p>
      )}
      <Dialog.Title
        className={cn(
          "font-body font-extrabold tracking-wide text-[#061525] uppercase",
          active.cardHeading
            ? "text-[16px] sm:text-[18px]"
            : "text-[18px] sm:text-[20px]",
        )}
      >
        {active.title}
      </Dialog.Title>
      <Dialog.Description asChild>
        <div className="flex flex-col gap-3 font-body text-[15px] leading-relaxed text-[#5C5F66] sm:text-[16px]">
          {active.paragraphs.map((paragraph, index) => {
            const showListAfter =
              active.list &&
              active.list.length > 0 &&
              challengeListIntroPhrases.includes(
                paragraph as (typeof challengeListIntroPhrases)[number],
              );
            return (
              <div key={`${paragraph}-${index}`}>
                <p>{paragraph}</p>
                {showListAfter && active.list && (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    {active.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {active.nextStep && (
            <div className="mt-2 border-t border-gray-100 pt-4">
              <p className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[15px]">
                A Clear Next Step
              </p>
              <p className="mt-2">{active.nextStep}</p>
            </div>
          )}
        </div>
      </Dialog.Description>
    </div>
  );

  const renderInvestmentPopupBody = (active: InvestmentPopup) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 pr-8">
        <Dialog.Title className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
          {active.title}
        </Dialog.Title>
        <p className="font-body text-[16px] font-extrabold tracking-wide text-[#061525] sm:text-[18px]">
          {active.fee}
        </p>
      </div>
      <Dialog.Description asChild>
        <div className="flex flex-col gap-5 font-body text-[14px] leading-relaxed text-[#5C5F66] sm:text-[15px]">
          <p>{active.intro}</p>

          <div className="flex flex-col gap-4">
            <h4 className="font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]">
              {active.includedHeading}
            </h4>
            {active.groups.map((group) => (
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
              {active.outcomeHeading}
            </h4>
            <div className="mt-3 flex flex-col gap-3">
              {active.outcomeParagraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </Dialog.Description>
    </div>
  );

  const revenuePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revenueOpen && !popup) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (popup) {
        setPopup(null);
        return;
      }
      if (revenueOpen) setRevenueOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revenueOpen, popup]);

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

      <Dialog.Root
        open={!!popup}
        onOpenChange={(open) => !open && setPopup(null)}
      >
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
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setPopup({
                      kind: "challenge",
                      cardHeading: item.title,
                      title: item.popout.title,
                      paragraphs: item.popout.paragraphs,
                      list: item.popout.list,
                      nextStep: item.popout.nextStep,
                    })
                  }
                  className="group flex cursor-pointer flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-xs transition-shadow hover:border-[#b17411]/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#b17411]/40"
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
                  <p className="mt-2 font-body text-[11px] leading-snug text-[#5C5F66] transition-colors group-hover:text-[#001528]">
                    {item.desc}
                  </p>
                </button>
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

          {/* Investment + Industry Neutral */}
          <div className="mt-8 w-full max-w-[1280px]">
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

            <ol className="mt-4 flex max-w-[1100px] list-none flex-col gap-4 p-0">
              {challenges.investment.tiers.map((tier, index) => (
                <li key={tier.title}>
                  <button
                    type="button"
                    onClick={() =>
                      setPopup({
                        kind: "investment",
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

            <div className="mt-6 flex flex-col justify-center rounded-2xl bg-[#001528] p-6 text-white shadow-sm">
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
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-full max-w-[620px] max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
            {popup?.kind === "challenge" && renderChallengePopupBody(popup)}
            {popup?.kind === "investment" && renderInvestmentPopupBody(popup)}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

export const ChallengesSection = Challenges;
export default Challenges;
