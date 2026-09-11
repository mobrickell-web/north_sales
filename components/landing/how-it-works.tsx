"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X, ChevronLeft, Target } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";

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

  // Track current step (1, 2, or 3) and selected component index
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [selectedCompIndex, setSelectedCompIndex] = useState<number | null>(
    null,
  );

  const handleOpenComponentDetail = (index: number) => {
    setSelectedCompIndex(index);
    setModalStep(3);
  };

  const handleBack = () => {
    if (modalStep === 3) {
      setModalStep(2);
      setSelectedCompIndex(null);
    } else if (modalStep === 2) {
      setModalStep(1);
    }
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

        {/* Bottom CTA & Dialog */}
        <div className="mt-8 flex w-full max-w-[1280px] justify-center sm:justify-end">
          <Dialog.Root
            onOpenChange={() => {
              setModalStep(1);
              setSelectedCompIndex(null);
            }}
          >
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-[43px] w-full sm:w-[213px] cursor-pointer items-center justify-center bg-[#b17411] px-[24px] font-secondary text-[14px] font-bold leading-none tracking-[0.5em] text-white uppercase shadow-md transition-all hover:bg-[#8f5d0e] focus:outline-none focus:ring-2 focus:ring-ring"
              >
                MORE
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] sm:w-full max-w-[1150px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-10">
                {/* Header Controls */}
                <div className="flex flex-col gap-2 border-b border-gray-200 pb-4">
                  {/* Top row: Back + Close */}
                  <div className="flex items-center justify-between">
                    {modalStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex cursor-pointer items-center gap-1 font-body text-[13px] font-bold text-primary hover:text-[#b17411]"
                      >
                        <ChevronLeft className="size-4" />
                        {modalStep === 3 ? "Back to Components" : "Back"}
                      </button>
                    ) : (
                      <div />
                    )}

                    <Dialog.Close className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none">
                      <X className="size-6" />
                      <span className="sr-only">Close</span>
                    </Dialog.Close>
                  </div>

                  {/* Title row — on its own line so it never wraps against buttons */}
                  {modalStep >= 2 && (
                    <span className="w-full text-center font-body text-[11px] font-bold tracking-wider text-primary uppercase sm:text-[13px] lg:text-[14px]">
                      THE 12 SALES PERFORMANCE COMPONENTS™
                    </span>
                  )}
                </div>

                {/* MODAL STEP 1: 3 Dark Pillars */}
                {modalStep === 1 && (
                  <div className="mt-6 flex flex-col items-center">
                    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
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
                              <li
                                key={idx}
                                className="flex items-start gap-2.5"
                              >
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
                        onClick={() => setModalStep(2)}
                        className="inline-flex h-[43px] w-full sm:w-[213px] cursor-pointer items-center justify-center bg-[#b17411] px-[24px] font-secondary text-[14px] font-bold leading-none tracking-[0.5em] text-white uppercase shadow-md transition-all hover:bg-[#8f5d0e] focus:outline-none focus:ring-2"
                      >
                        MORE
                      </button>
                    </div>
                  </div>
                )}

                {/* MODAL STEP 2: 12 Sales Components Grid */}
                {modalStep === 2 && (
                  <div className="mt-8 flex flex-col gap-8">
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
                          analyze and determine where the greatest performance
                          opportunities exist.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODAL STEP 3: Deep-Dive Component Detail View */}
                {modalStep === 3 && activeComponent && (
                  <div className="mt-6 flex flex-col gap-6 text-left">
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
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </section>
  );
}
