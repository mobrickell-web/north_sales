"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronLeft, Target, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  siteConfig,
  componentKpisIntro,
  getSalesComponentKpis,
  type SalesComponentKpi,
  getPillarThemeKpis,
  pillarKpisFootnote,
  pillarKpisIntro,
} from "@/config/site";
import { cn } from "@/lib/utils";
import { AiSalesIntegrationDialog } from "@/components/layout/ai-sales-integration-dialog";

interface HowItWorksProps {
  sectionNumber?: number | string;
}

// Type guard for the component schema inside modalComponents
interface ModalComponent {
  num: number;
  title: string;
  desc: string;
  overview?: string;
  areas?: readonly (string | { title: string; detail?: string })[]; // Updated to accept readonly arrays
  kpisIntro?: readonly string[];
  kpis?: readonly { title: string; detail: string }[];
  note?: string;
  objective?: string;
}

/** Keep "KPIs" casing when a parent uses CSS `uppercase` (otherwise it renders as KPIS). */
function withKpisCasing(text: string) {
  const parts = text.split(/(KPIs)/g);
  return parts.map((part, index) =>
    part === "KPIs" ? (
      <span key={index} className="normal-case">
        KPIs
      </span>
    ) : (
      part
    ),
  );
}

export function HowItWorks({ sectionNumber = 4 }: HowItWorksProps) {
  const { howItWorks } = siteConfig;
  const leadershipSupport = howItWorks.salesLeadershipImplementationSupport;

  // Outer panel (3 pillars) and inner panel (12 components) expand inline
  const [expanded, setExpanded] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  // Selected component index swaps the inner panel content to its detail view
  const [selectedCompIndex, setSelectedCompIndex] = useState<number | null>(
    null,
  );
  const [popup, setPopup] = useState<{
    bulletHeading?: string;
    title: string;
    subtitle?: string;
    paragraphs: readonly string[];
    list?: readonly string[];
    sections?: readonly {
      title: string;
      subtitle?: string;
      paragraphs: readonly string[];
      list?: readonly string[];
    }[];
    /** Theme KPIs available for this bullet — shown after expanding Example KPIs */
    themeKpis?: readonly { title: string; detail: string }[];
    themeKpisFootnote?: string;
    themeKpisExpanded?: boolean;
    kpis?: readonly { title: string; detail: string }[];
    footnote?: string;
    kpiDetail?: { title: string; detail: string };
  } | null>(null);

  const [aiSalesOpen, setAiSalesOpen] = useState(false);
  const [leadershipSupportOpen, setLeadershipSupportOpen] = useState(false);

  const outerPanelRef = useRef<HTMLDivElement>(null);
  const innerPanelRef = useRef<HTMLDivElement>(null);
  const outerCtaRef = useRef<HTMLDivElement>(null);
  const innerCtaRef = useRef<HTMLDivElement>(null);

  // Escape closes the deepest open level first
  useEffect(() => {
    if (!expanded && !popup && !aiSalesOpen && !leadershipSupportOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (aiSalesOpen) {
        setAiSalesOpen(false);
        return;
      }
      if (leadershipSupportOpen) {
        setLeadershipSupportOpen(false);
        return;
      }
      if (popup) {
        if (popup.kpiDetail) {
          setPopup({ ...popup, kpiDetail: undefined });
          return;
        }
        if (popup.themeKpisExpanded) {
          setPopup({ ...popup, themeKpisExpanded: false });
          return;
        }
        setPopup(null);
        return;
      }
      if (selectedCompIndex !== null) setSelectedCompIndex(null);
      else if (componentsOpen) setComponentsOpen(false);
      else setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    expanded,
    componentsOpen,
    selectedCompIndex,
    popup,
    aiSalesOpen,
    leadershipSupportOpen,
  ]);

  const toggleOuter = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    if (!willExpand) {
      // Collapse everything and scroll back up to the first MORE/LESS CTA.
      setComponentsOpen(false);
      setSelectedCompIndex(null);
      window.setTimeout(() => {
        outerCtaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
      return;
    }
    // Wait for the expand animation, then scroll to the three core areas panel.
    window.setTimeout(() => {
      outerPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const toggleInner = () => {
    const willExpand = !componentsOpen;
    setComponentsOpen(willExpand);
    if (!willExpand) {
      // Collapse and scroll back up to the pillars / second MORE/LESS CTA.
      setSelectedCompIndex(null);
      window.setTimeout(() => {
        innerCtaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);
      return;
    }
    // Wait for the expand animation so the 12-components panel is visible, then scroll to it.
    window.setTimeout(() => {
      innerPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const handleOpenComponentDetail = (index: number) => {
    setSelectedCompIndex(index);
  };

  const handleBack = () => {
    setSelectedCompIndex(null);
    // Detail view is taller than the grid; without this, collapsing leaves the
    // viewport scrolled into the next section (e.g. Challenges).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        innerPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const activeComponent =
    selectedCompIndex !== null
      ? (howItWorks.modalComponents[selectedCompIndex] as ModalComponent)
      : null;

  const activeComponentKpis: readonly SalesComponentKpi[] | false =
    activeComponent
      ? (activeComponent.kpis ??
        getSalesComponentKpis(activeComponent.num) ??
        [])
      : false;
  const activeComponentKpisIntro =
    activeComponent && (activeComponent.kpisIntro ?? componentKpisIntro);

  // Render icons for the 3 main process cards
  const renderCardIcon = (index: number) => {
    const iconPaths = [
      "/icons/P1.svg",
      "/icons/P2.svg",
      "/icons/process-3.svg",
    ];
    const iconPath = iconPaths[index];
    if (!iconPath) return null;

    return (
      <Image
        src={iconPath}
        alt={howItWorks.steps[index]?.title ?? "Process step icon"}
        width={64}
        height={64}
        className="size-16 object-contain"
        unoptimized
      />
    );
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
      id="how-we-work"
      aria-labelledby="how-we-work-heading"
      className="relative w-full overflow-hidden bg-white pt-20 pb-12 sm:pt-12 lg:py-16"
    >
      {/* Section Indicator Number */}
      <div className="absolute left-4 top-3 select-none font-secondary text-[36px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <Dialog.Root
        open={!!popup}
        onOpenChange={(open) => !open && setPopup(null)}
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
              {howItWorks.badge}
            </span>
            <h2
              id="how-we-work-heading"
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
                  {step.bullets.map((bullet, bulletIndex) => {
                    const bulletHeading = step.title
                      .split(" & ")
                      [bulletIndex]?.trim();
                    return (
                      <li key={bullet.label} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-white" />
                        <button
                          type="button"
                          onClick={() =>
                            setPopup({
                              bulletHeading,
                              title: bullet.popout.title,
                              paragraphs: bullet.popout.paragraphs,
                              list:
                                "list" in bullet.popout
                                  ? bullet.popout.list
                                  : undefined,
                            })
                          }
                          className="cursor-pointer text-left font-body text-[14px] font-normal leading-relaxed text-gray-200 transition-colors hover:text-[#b17411] hover:underline focus:outline-none"
                        >
                          {bullet.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA Button — toggles the details panel inline (no popup) */}
          <div
            ref={outerCtaRef}
            className="mt-8 flex w-full max-w-[1280px] scroll-mt-28 justify-center sm:justify-end"
          >
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
              "scroll-mt-28 grid w-full max-w-[1280px] transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none",
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
                  <h3 className="w-full text-center font-body text-[13px] font-bold tracking-wide text-primary uppercase sm:text-[16px] lg:text-[22px]">
                    THREE CORE AREAS WE HELP IMPROVE
                  </h3>
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
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white" />
                              <button
                                type="button"
                                onClick={() => {
                                  if ("sharedDialog" in bullet) {
                                    if (
                                      bullet.sharedDialog ===
                                      "aiSalesIntegration"
                                    ) {
                                      setAiSalesOpen(true);
                                      return;
                                    }
                                    if (
                                      bullet.sharedDialog ===
                                      "salesLeadershipImplementationSupport"
                                    ) {
                                      setLeadershipSupportOpen(true);
                                      return;
                                    }
                                  }
                                  if ("popout" in bullet && bullet.popout) {
                                    const themeKpis = getPillarThemeKpis(
                                      pillar.id,
                                      bullet.label,
                                    );

                                    setPopup({
                                      bulletHeading: pillar.title,
                                      title: bullet.popout.title,
                                      paragraphs: bullet.popout.paragraphs,
                                      themeKpis,
                                      themeKpisFootnote: themeKpis?.length
                                        ? pillarKpisFootnote
                                        : undefined,
                                      themeKpisExpanded: false,
                                    });
                                  }
                                }}
                                className="cursor-pointer text-left font-body text-[14px] text-gray-200 transition-colors hover:text-[#b17411] hover:underline focus:outline-none"
                              >
                                {bullet.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div
                    ref={innerCtaRef}
                    className="mt-8 flex w-full scroll-mt-28 justify-center sm:justify-end"
                  >
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
                    "scroll-mt-28 grid w-full transition-[grid-template-rows] duration-500 ease-in-out motion-reduce:transition-none",
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
                      {/* Title */}
                      <div className="mt-8 flex flex-col gap-2 border-b border-gray-300/60 pb-4">
                        <h3 className="w-full text-center font-body text-[13px] font-bold tracking-wide text-primary uppercase sm:text-[16px] lg:text-[22px]">
                          THE 12 SALES PERFORMANCE COMPONENTS™
                        </h3>
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
                                WE DON&apos;T ASSUME THE SOLUTION—WE IDENTIFY
                                THE OPPORTUNITY.
                              </h5>
                              <p className="font-body text-[11px] text-[#5C5F66]">
                                We don&apos;t walk in with a preset answer. We
                                examine, analyze and determine where the
                                greatest performance opportunities exist.
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
                                  <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {activeComponent.areas.map((area, i) => {
                                      const title =
                                        typeof area === "string"
                                          ? area
                                          : area.title;
                                      const detail =
                                        typeof area === "string"
                                          ? undefined
                                          : area.detail;

                                      return (
                                        <li
                                          key={i}
                                          className="flex items-start gap-2.5 font-body text-[13px] text-gray-600"
                                        >
                                          <span className="mt-0.5 shrink-0 font-body text-[13px] font-bold text-[#b17411]">
                                            {i + 1}.
                                          </span>
                                          <div className="flex flex-col gap-1">
                                            <span className="font-bold text-primary">
                                              {title}
                                            </span>
                                            {detail && (
                                              <span className="leading-relaxed text-[#5C5F66]">
                                                {detail}
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}

                            {activeComponentKpis &&
                              activeComponentKpis.length > 0 && (
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                                  <h4 className="font-body text-[13px] font-bold text-primary uppercase">
                                    {withKpisCasing(
                                      `Example ${activeComponent.title} KPIs`,
                                    )}
                                  </h4>
                                  {activeComponentKpisIntro &&
                                    activeComponentKpisIntro.length > 0 && (
                                      <div className="mt-3 flex flex-col gap-2 font-body text-[13px] leading-relaxed text-[#5C5F66]">
                                        {activeComponentKpisIntro.map(
                                          (paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                          ),
                                        )}
                                      </div>
                                    )}
                                  <ul className="mt-4 flex flex-col gap-2">
                                    {activeComponentKpis.map((kpi) => (
                                      <li key={kpi.title}>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setPopup({
                                              bulletHeading:
                                                activeComponent.title,
                                              title: kpi.title,
                                              paragraphs: [kpi.detail],
                                            })
                                          }
                                          className="cursor-pointer text-left font-body text-[13px] font-bold text-[#b17411] hover:underline focus:outline-none"
                                        >
                                          {kpi.title}
                                        </button>
                                      </li>
                                    ))}
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

                            <button
                              type="button"
                              onClick={handleBack}
                              className="inline-flex w-fit cursor-pointer items-center gap-1 font-body text-[13px] font-bold text-primary hover:text-[#b17411]"
                            >
                              <ChevronLeft className="size-4" />
                              Back to Components
                            </button>
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

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[95vw] sm:w-full max-w-[620px] max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            {popup && (
              <div className="flex flex-col gap-3">
                {popup.kpiDetail ? (
                  <>
                    {popup.bulletHeading && (
                      <Dialog.Title className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
                        {popup.bulletHeading}
                      </Dialog.Title>
                    )}
                    <p className="font-body text-[14px] font-extrabold tracking-wide text-[#061525] uppercase sm:text-[16px]">
                      {popup.kpiDetail.title}
                    </p>
                    <Dialog.Description asChild>
                      <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                        {popup.kpiDetail.detail}
                      </p>
                    </Dialog.Description>
                    <button
                      type="button"
                      onClick={() =>
                        setPopup((prev) =>
                          prev ? { ...prev, kpiDetail: undefined } : prev,
                        )
                      }
                      className="inline-flex w-fit cursor-pointer items-center gap-1 font-body text-[13px] font-bold text-primary hover:text-[#b17411]"
                    >
                      <ChevronLeft className="size-4" />
                      Back to example KPIs
                    </button>
                  </>
                ) : (
                  <>
                    {popup.bulletHeading && (
                      <Dialog.Title className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
                        {popup.bulletHeading}
                      </Dialog.Title>
                    )}
                    <p
                      className={cn(
                        "font-body font-extrabold tracking-wide text-[#061525] uppercase",
                        popup.bulletHeading
                          ? "text-[14px] sm:text-[16px]"
                          : "text-[16px] sm:text-[18px]",
                      )}
                    >
                      {withKpisCasing(popup.title)}
                    </p>
                    {popup.subtitle ? (
                      <p className="font-body text-[12px] font-bold tracking-[0.06em] text-[#b17411] uppercase sm:text-[13px]">
                        {popup.subtitle}
                      </p>
                    ) : null}
                    <Dialog.Description asChild>
                      <div className="flex flex-col gap-3 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                        {popup.paragraphs.map((paragraph, index) => {
                          const listIntroPhrases = [
                            "We look for opportunities such as:",
                            "Depending on the engagement, this may include changes to:",
                            "Depending on the engagement, implementation may include:",
                            "Depending on the engagement:",
                            "Areas of responsibility may include:",
                          ];
                          const showListAfter =
                            popup.list &&
                            popup.list.length > 0 &&
                            listIntroPhrases.includes(paragraph);

                          return (
                            <div key={`${paragraph}-${index}`}>
                              <p>{paragraph}</p>
                              {showListAfter && popup.list && (
                                <ul className="mt-2 list-disc space-y-1.5 pl-5">
                                  {popup.list.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}

                        {popup.sections?.map((section) => (
                          <div
                            key={section.title}
                            className="mt-2 flex flex-col gap-3 border-t border-gray-100 pt-4"
                          >
                            <p className="font-body text-[13px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[14px]">
                              {section.title}
                            </p>
                            {section.subtitle ? (
                              <p className="font-body text-[13px] font-semibold text-[#001528]">
                                {section.subtitle}
                              </p>
                            ) : null}
                            {section.paragraphs.map((paragraph, index) => {
                              const showListAfter =
                                section.list &&
                                section.list.length > 0 &&
                                paragraph ===
                                  "Areas of responsibility may include:";
                              return (
                                <div key={`${section.title}-${index}`}>
                                  <p>{paragraph}</p>
                                  {showListAfter && section.list ? (
                                    <ul className="mt-2 list-disc space-y-1.5 pl-5">
                                      {section.list.map((item) => (
                                        <li key={item}>{item}</li>
                                      ))}
                                    </ul>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        ))}

                        {popup.themeKpis &&
                        popup.themeKpis.length > 0 &&
                        !popup.themeKpisExpanded ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPopup((prev) =>
                                prev
                                  ? { ...prev, themeKpisExpanded: true }
                                  : prev,
                              )
                            }
                            className="w-fit cursor-pointer text-left font-body text-[13px] font-bold text-[#b17411] transition-colors hover:underline focus:outline-none"
                          >
                            Example KPIs
                          </button>
                        ) : null}

                        {popup.themeKpisExpanded &&
                          popup.themeKpis &&
                          popup.themeKpis.length > 0 && (
                            <div className="mt-1 flex flex-col gap-3 border-t border-gray-100 pt-4">
                              <p className="font-body text-[13px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[14px]">
                                Example KPIs
                              </p>
                              <p>{pillarKpisIntro}</p>
                              <ul className="flex flex-col gap-2">
                                {popup.themeKpis.map((kpi) => (
                                  <li key={kpi.title}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPopup((prev) =>
                                          prev
                                            ? { ...prev, kpiDetail: kpi }
                                            : prev,
                                        )
                                      }
                                      className="cursor-pointer text-left font-body text-[13px] font-bold text-[#b17411] hover:underline focus:outline-none"
                                    >
                                      {kpi.title}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                              {popup.themeKpisFootnote ? (
                                <p className="text-[13px] italic">
                                  {popup.themeKpisFootnote}
                                </p>
                              ) : null}
                            </div>
                          )}

                        {popup.kpis && popup.kpis.length > 0 && (
                          <ul className="mt-1 flex flex-col gap-2">
                            {popup.kpis.map((kpi) => (
                              <li key={kpi.title}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPopup((prev) =>
                                      prev ? { ...prev, kpiDetail: kpi } : prev,
                                    )
                                  }
                                  className="cursor-pointer text-left font-body text-[13px] font-bold text-[#b17411] hover:underline focus:outline-none"
                                >
                                  {kpi.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        {popup.footnote && (
                          <p className="mt-2 text-[13px] italic">
                            {popup.footnote}
                          </p>
                        )}
                      </div>
                    </Dialog.Description>
                  </>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AiSalesIntegrationDialog
        open={aiSalesOpen}
        onOpenChange={setAiSalesOpen}
        hideTrigger
      />

      <Dialog.Root
        open={leadershipSupportOpen}
        onOpenChange={setLeadershipSupportOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex max-h-[90vh] w-[95vw] max-w-[720px] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95">
            <Dialog.Close className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            <div className="shrink-0 border-b border-black/8 px-6 pt-6 pb-4 sm:px-8">
              <Dialog.Title className="pr-8 font-body text-[18px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[20px]">
                {leadershipSupport.title}
              </Dialog.Title>
              <Dialog.Description asChild>
                <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                  <p className="font-extrabold text-[#001528]">
                    {leadershipSupport.headline}
                  </p>
                  {leadershipSupport.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Dialog.Description>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <ul className="flex flex-col gap-4">
                {leadershipSupport.engagementOptions.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b17411]"
                    />
                    <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                      <span className="font-extrabold text-[#001528]">
                        {item.title}:
                      </span>{" "}
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {leadershipSupport.closing.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {leadershipSupport.roles.map((role) => (
                <section
                  key={role.title}
                  className="mt-6 border-t border-[#E8E4DC] pt-5"
                >
                  <h3 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                    {role.title}
                  </h3>
                  <p className="mt-2 font-body text-[14px] font-extrabold text-[#001528]">
                    {role.headline}
                  </p>
                  <div className="mt-2 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {role.intro.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <ul className="mt-4 flex flex-col gap-4">
                    {role.responsibilities.map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b17411]"
                        />
                        <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                          <span className="font-extrabold text-[#001528]">
                            {item.title}:
                          </span>{" "}
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {role.objective}
                  </p>
                </section>
              ))}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setLeadershipSupportOpen(false)}
                  className="inline-flex h-[44px] min-w-[160px] cursor-pointer items-center justify-center bg-[#b17411] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
                >
                  Close
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
