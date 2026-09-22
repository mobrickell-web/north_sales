"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  UserRound,
  Globe,
  ShieldLock,
  Target,
  X,
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
  const [expanded, setExpanded] = useState(false);
  const [popup, setPopup] = useState<{
    title: string;
    paragraphs: readonly string[];
    list?: readonly string[];
    nextStep?: string;
    /** Card heading from OUR APPROACH panel (shown above popout title) */
    cardHeading?: string;
  } | null>(null);

  const approachListIntroPhrases = [
    "That can include reviewing areas such as:",
    "That may mean prioritizing:",
    "Depending on the engagement, that may include:",
    "We can evaluate areas such as:",
    "That may include:",
  ] as const;

  const renderPopupBody = () => {
    if (!popup) return null;
    return (
      <div className="flex flex-col gap-3">
        {popup.cardHeading && (
          <p className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
            {popup.cardHeading}
          </p>
        )}
        <Dialog.Title
          className={cn(
            "font-body font-extrabold tracking-wide text-[#061525] uppercase",
            popup.cardHeading
              ? "text-[16px] sm:text-[18px]"
              : "text-[18px] sm:text-[20px]",
          )}
        >
          {popup.title}
        </Dialog.Title>
        <Dialog.Description asChild>
          <div className="flex flex-col gap-3 font-body text-[15px] leading-relaxed text-[#5C5F66] sm:text-[16px]">
            {popup.paragraphs.map((paragraph, index) => {
              const showListAfter =
                popup.list &&
                popup.list.length > 0 &&
                approachListIntroPhrases.includes(
                  paragraph as (typeof approachListIntroPhrases)[number],
                );
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
            {popup.nextStep && (
              <div className="mt-2 border-t border-gray-100 pt-4">
                <p className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[15px]">
                  A Clear Next Step
                </p>
                <p className="mt-2">{popup.nextStep}</p>
              </div>
            )}
          </div>
        </Dialog.Description>
      </div>
    );
  };
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes the popup first, then the expanded panel
  useEffect(() => {
    if (!expanded && !popup) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (popup) {
        setPopup(null);
        return;
      }
      setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded, popup]);

  const toggle = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    if (!willExpand) {
      // Collapse: keep the button in view instead of jumping
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-partner-heading"
      className="relative w-full overflow-hidden bg-[#F2F2F3] py-10 lg:py-14"
    >
      {/* Top Left Indicator ("1") */}
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        1
      </div>

      <Dialog.Root
        open={!!popup}
        onOpenChange={(open) => !open && setPopup(null)}
      >
        <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
              {whyChooseUs.badge}
            </span>
            <h2
              id="why-partner-heading"
              className="max-w-[820px] font-body text-[18px] font-bold tracking-[0.04em] text-primary uppercase sm:text-[22px]"
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
                <button
                  type="button"
                  onClick={() =>
                    setPopup({
                      title: pillar.title,
                      paragraphs: pillar.popout.paragraphs,
                    })
                  }
                  className="group flex cursor-pointer flex-col items-center text-center transition-opacity hover:opacity-90 focus:outline-none"
                >
                  <div className="flex h-14 items-center justify-center">
                    {iconMap[pillar.icon] || (
                      <Image
                        src={pillar.icon}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 object-contain"
                        unoptimized
                      />
                    )}
                  </div>
                  <h3 className="mt-2 font-body text-[13px] font-bold tracking-[0.04em] text-primary uppercase group-hover:text-[#b17411] group-hover:underline">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 font-body text-[13px] leading-relaxed text-[#5C5F66]">
                    {pillar.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {/* CTA Button — toggles the details panel inline (no popup) */}
          <div className="mt-8 flex w-full max-w-[1280px] justify-center sm:justify-end sm:pr-4">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              aria-controls="why-partner-details"
              className="inline-flex h-[43px] w-full sm:w-[213px] cursor-pointer items-center justify-center bg-bronze px-[24px] font-secondary text-[10px] font-bold leading-none tracking-[0.5em] text-white uppercase shadow-md transition-all hover:bg-[#8f5d0e] focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {expanded ? "LESS" : "MORE"}
            </button>
          </div>

          {/* Expandable details panel — animates open and pushes the next section down */}
          <div
            id="why-partner-details"
            ref={panelRef}
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
                  "relative mt-8 rounded-2xl bg-white p-6 pt-12 shadow-lg transition-opacity duration-300 ease-in-out sm:p-10 sm:pt-12",
                  expanded ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                {/* Panel Title */}
                <h3 className="w-full text-center font-body text-[11px] font-bold tracking-wide text-primary uppercase sm:text-[16px] lg:text-[22px]">
                  {whyChooseUs.modal.title}
                </h3>

                {/* Panel Content */}
                <ul className="mt-10 grid grid-cols-1 divide-y divide-black/10 md:grid-cols-5 md:divide-x md:divide-y-0">
                  {whyChooseUs.modal.pillars.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col items-center px-4 py-6 text-center first:pt-0 last:pb-0 md:py-0"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setPopup({
                            cardHeading: item.title,
                            title: item.popout.title,
                            paragraphs: item.popout.paragraphs,
                            list: item.popout.list,
                            nextStep: item.popout.nextStep,
                          })
                        }
                        className="group flex cursor-pointer flex-col items-center text-center focus:outline-none"
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
                        <h4 className="mt-3 font-body text-[13px] font-bold tracking-[0.04em] text-primary uppercase group-hover:text-[#b17411] group-hover:underline">
                          {item.title}
                        </h4>
                        <p className="mt-2 font-body text-[12px] leading-relaxed text-[#5C5F66]">
                          {item.description}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
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
            {renderPopupBody()}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

export default WhyPartnerSection;
