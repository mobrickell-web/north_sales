"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronLeft, Target } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface HowItWorksProps {
  sectionNumber?: number | string;
}

// Type guard for the component schema inside modalComponents
interface ModalComponent {
  num: number;
  title: string;
  desc: string;
  overview?: string;
  areas?: readonly string[]; // Updated to accept readonly arrays
  note?: string;
  objective?: string;
}

export function HowItWorks({ sectionNumber = 4 }: HowItWorksProps) {
  const { howItWorks } = siteConfig;

  // Outer panel (3 pillars) and inner panel (12 components) expand inline
  const [expanded, setExpanded] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  // Selected component index swaps the inner panel content to its detail view
  const [selectedCompIndex, setSelectedCompIndex] = useState<number | null>(
    null,
  );

  const outerPanelRef = useRef<HTMLDivElement>(null);
  const innerPanelRef = useRef<HTMLDivElement>(null);

  // Escape closes the deepest open level first
  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selectedCompIndex !== null) setSelectedCompIndex(null);
      else if (componentsOpen) setComponentsOpen(false);
      else setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, componentsOpen, selectedCompIndex]);

  const toggleOuter = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    if (!willExpand) {
      // Collapse everything and keep the button in view
      setComponentsOpen(false);
      setSelectedCompIndex(null);
      outerPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const toggleInner = () => {
    const willExpand = !componentsOpen;
    setComponentsOpen(willExpand);
    if (!willExpand) {
      setSelectedCompIndex(null);
      innerPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleOpenComponentDetail = (index: number) => {
    setSelectedCompIndex(index);
  };

  const handleBack = () => {
    setSelectedCompIndex(null);
  };

  const activeComponent =
    selectedCompIndex !== null
      ? (howItWorks.modalComponents[selectedCompIndex] as ModalComponent)
      : null;

  // Render icons for the 3 main process cards
  const renderCardIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Image
            src="/icons/p1.svg"
            alt="Discover & Assess"
            width={64}
            height={64}
            className="size-16 object-contain"
            unoptimized
          />
        );
      case 1:
        return (
          <Image
            src="/icons/p2.svg"
            alt="Design & Align"
            width={64}
            height={64}
            className="size-16 object-contain"
            unoptimized
          />
        );
      case 2:
        return (
          <svg
            width="64"
            height="64"
            viewBox="0 0 48 48"
            fill="none"
            className="size-16 text-[#b17411]"
          >
            <path
              d="M12 36V28M20 36V22M28 36V18M36 36V12M12 22L20 16L28 20L36 10M36 10H30M36 10V16"
              stroke="#b17411"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Render icons for Modal Step 1 Pillars using p3.svg, p4.svg, and p5.svg
  const renderModalPillarIcon = (index: number) => {
    const iconPaths = ["/icons/p3.svg", "/icons/p4.svg", "/icons/p5.svg"];
    const iconPath = iconPaths[index] || "/icons/p3.svg";

    return (
      <Image
        src={iconPath}
        alt="Modal Pillar Icon"
        width={64}
        height={64}
        className="size-16 object-contain"
        unoptimized
      />
    );
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative w-full overflow-hidden bg-white pt-20 pb-12 sm:pt-12 lg:py-16"
    >
      {/* Section Indicator Number */}
      <div className="absolute left-4 top-3 select-none font-secondary text-[36px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
            {howItWorks.badge}
          </span>
          <h2
            id="how-it-works-heading"
            className="max-w-[720px] font-body text-[20px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[24px]"
          >
            {howItWorks.title}
          </h2>
        </div>

        {/* 3 Main Cards */}
        <div className="mt-10 grid w-full max-w-[1280px] grid-cols-1 gap-6 md:grid-cols-3">
          {howItWorks.steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center rounded-xs bg-[#001528] px-8 py-12 text-center text-white shadow-lg"
            >
              <div className="flex h-16 items-center justify-center">
                {renderCardIcon(index)}
              </div>
              <h3 className="mt-4 font-body text-[16px] font-bold tracking-[0.04em] text-white uppercase sm:text-[18px]">
                {step.stepNumber} {step.title}
              </h3>
              <ul className="mt-6 flex flex-col gap-4 text-left font-body text-[14px] font-normal leading-relaxed text-gray-200">
                {step.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-white" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Button — toggles the details panel inline (no popup) */}
        <div className="mt-8 flex w-full max-w-[1280px] justify-center sm:justify-end">
          <button
            type="button"
            onClick={toggleOuter}
            aria-expanded={expanded}
            aria-controls="how-it-works-details"
            className="inline-flex h-[43px] w-full sm:w-[213px] cursor-pointer items-center justify-center bg-[#b17411] px-[24px] font-secondary text-[14px] font-bold leading-none tracking-[0.5em] text-white uppercase shadow-md transition-all hover:bg-[#8f5d0e] focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {expanded ? "LESS" : "MORE"}
          </button>
        </div>

        {/* Expandable details panel — animates open and pushes the next section down */}
        <div
          id="how-it-works-details"
          ref={outerPanelRef}
          className={cn(
            "grid w-full max-w-[1280px] transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div
              aria-hidden={!expanded}
              inert={!expanded}
              className={cn(
                "mt-8 rounded-2xl bg-[#F2F2F3] p-6 shadow-lg transition-opacity duration-300 ease-in-out sm:p-10",
                expanded ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {/* 3 Dark Pillars */}
              <div className="flex flex-col items-center">
                <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
                  {howItWorks.modalPillars.map((pillar, index) => (
                    <div
                      key={pillar.id}
                      className="flex flex-col items-start rounded-xl bg-[#001528] p-8 text-left text-white shadow-md"
                    >
                      <div className="mx-auto mb-6 flex h-16 items-center justify-center">
                        {renderModalPillarIcon(index)}
                      </div>
                      <h3 className="w-full text-center font-body text-[18px] font-bold tracking-wide text-white uppercase">
                        {pillar.title}
                      </h3>
                      <ul className="mt-6 flex flex-col gap-3 font-body text-[14px] text-gray-200">
                        {pillar.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex w-full justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={toggleInner}
                    aria-expanded={componentsOpen}
                    aria-controls="how-it-works-components"
                    className="inline-flex h-[43px] w-full sm:w-[213px] cursor-pointer items-center justify-center bg-[#b17411] px-[24px] font-secondary text-[14px] font-bold leading-none tracking-[0.5em] text-white uppercase shadow-md transition-all hover:bg-[#8f5d0e] focus:outline-none focus:ring-2"
                  >
                    {componentsOpen ? "LESS" : "MORE"}
                  </button>
                </div>
              </div>

              {/* Inner expandable panel: 12 Sales Components grid */}
              <div
                id="how-it-works-components"
                ref={innerPanelRef}
                className={cn(
                  "grid w-full transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none",
                  componentsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div
                    aria-hidden={!componentsOpen}
                    inert={!componentsOpen}
                    className={cn(
                      "flex flex-col gap-8 transition-opacity duration-300 ease-in-out",
                      componentsOpen
                        ? "opacity-100"
                        : "pointer-events-none opacity-0",
                    )}
                  >
                    {/* Title + Back (detail view only) */}
                    <div className="mt-8 flex flex-col gap-2 border-b border-gray-300/60 pb-4">
                      <div className="flex items-center justify-between">
                        {selectedCompIndex !== null ? (
                          <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex cursor-pointer items-center gap-1 font-body text-[13px] font-bold text-primary hover:text-[#b17411]"
                          >
                            <ChevronLeft className="size-4" />
                            Back to Components
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                      <span className="w-full text-center font-body text-[11px] font-bold tracking-wider text-primary uppercase sm:text-[13px] lg:text-[14px]">
                        THE 12 SALES PERFORMANCE COMPONENTS™
                      </span>
                    </div>

                    {/* Components grid — swaps to detail view when a component is selected */}
                    {selectedCompIndex === null ? (
                      <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                          {howItWorks.modalComponents.map((comp, idx) => (
                            <div
                              key={comp.num}
                              className="flex flex-col items-start text-left"
                            >
                              <div className="flex items-center gap-2">
                                <span className="flex size-7 items-center justify-center rounded-full bg-[#001528] text-[12px] font-bold text-white">
                                  {comp.num}
                                </span>
                              </div>
                              <h4 className="mt-2 font-body text-[11px] font-bold tracking-tight text-primary uppercase sm:mt-3 sm:text-[13px]">
                                {comp.title}
                              </h4>
                              <p className="mt-1.5 font-body text-[10px] leading-relaxed text-[#5C5F66] sm:mt-2 sm:text-[11px]">
                                {comp.desc}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleOpenComponentDetail(idx)}
                                className="mt-2 cursor-pointer font-body text-[11px] font-bold text-[#b17411] hover:underline"
                              >
                                More ›
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Target Banner */}
                        <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <Target className="size-8 shrink-0 text-[#b17411]" />
                          <div className="flex flex-col">
                            <h5 className="font-body text-[13px] font-extrabold text-primary uppercase">
                              WE DONT ASSUME THE SOLUTION—WE IDENTIFY THE
                              OPPORTUNITY.
                            </h5>
                            <p className="font-body text-[11px] text-[#5C5F66]">
                              We dont walk in with a preset answer. We examine,
                              analyze and determine where the greatest
                              performance opportunities exist.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      activeComponent && (
                        <div className="flex flex-col gap-6 text-left">
                          {/* Component detail view */}
                          <div className="flex items-center gap-3">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#001528] text-[12px] font-bold text-white sm:size-9 sm:text-[14px]">
                              {activeComponent.num}
                            </span>
                            <h3 className="font-body text-[15px] font-extrabold text-primary uppercase sm:text-[20px]">
                              {activeComponent.title}
                            </h3>
                          </div>

                          {activeComponent.overview && (
                            <p className="font-body text-[14px] leading-relaxed text-gray-700">
                              {activeComponent.overview}
                            </p>
                          )}

                          {activeComponent.areas &&
                            activeComponent.areas.length > 0 && (
                              <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                                <h4 className="font-body text-[13px] font-bold text-primary uppercase">
                                  Areas We May Examine Include:
                                </h4>
                                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                  {activeComponent.areas.map(
                                    (area: string, i: number) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2.5 font-body text-[13px] text-gray-600"
                                      >
                                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#b17411]" />
                                        <span>{area}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                          {activeComponent.note && (
                            <p className="font-body text-[12px] italic text-gray-500">
                              {activeComponent.note}
                            </p>
                          )}

                          {activeComponent.objective && (
                            <p className="font-body text-[14px] font-semibold text-primary">
                              {activeComponent.objective}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
