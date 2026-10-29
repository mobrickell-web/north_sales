"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";
import { MeetTheFounderDialog } from "@/components/landing/meet-the-founder-dialog";

type AboutParagraph =
  | string
  | {
      linkLine: {
        before: string;
        href: string;
        label: string;
        after: string;
      };
    };

type AboutUsOption = {
  title: string;
  description: string;
  href?: string;
};

function handleInvestmentPopupLink(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  const popupIdByHref: Record<string, string> = {
    "#investment-option-1": "salesTeamPerformance",
    "#investment-option-2": "focusedSalesPerformance",
    "#investment-option-3": "fullSalesPerformance",
  };
  const popupId = popupIdByHref[href];
  if (!popupId) return;

  event.preventDefault();
  window.dispatchEvent(
    new CustomEvent("north-point:open-investment-popup", {
      detail: { popupId },
    }),
  );
}

type AboutExpandableSection = {
  heading: string;
  paragraphs?: readonly AboutParagraph[];
  options?: readonly AboutUsOption[];
  closingParagraphs?: readonly AboutParagraph[];
  challenges?: readonly {
    label: string;
    title: string;
    intro: string;
    commonProblems: readonly string[];
    howWeAddress: string;
  }[];
};

function AboutParagraphText({ paragraph }: { paragraph: AboutParagraph }) {
  if (typeof paragraph === "string") {
    return (
      <>
        {paragraph.split("\n").map((line, index) => (
          <span key={`${line}-${index}`} className="block">
            {line}
          </span>
        ))}
      </>
    );
  }

  const { before, href, label, after } = paragraph.linkLine;
  return (
    <>
      {before}
      <Link
        href={href}
        onClick={(event) => handleInvestmentPopupLink(event, href)}
        className="font-semibold text-[#b17411] underline-offset-2 hover:underline"
      >
        {label}
      </Link>
      {after}
    </>
  );
}

function paragraphKey(paragraph: AboutParagraph) {
  return typeof paragraph === "string"
    ? paragraph
    : `${paragraph.linkLine.before}${paragraph.linkLine.label}`;
}

function AboutOptionsList({ options }: { options: readonly AboutUsOption[] }) {
  return (
    <ul className="flex flex-col gap-4 pl-0">
      {options.map((option) => (
        <li
          key={option.title}
          className="flex gap-3 font-body text-[15px] leading-[1.4] text-[#5C5F66]"
        >
          <span
            aria-hidden
            className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b17411]"
          />
          <p>
            {option.href ? (
              <Link
                href={option.href}
                onClick={(event) =>
                  handleInvestmentPopupLink(event, option.href ?? "")
                }
                className="font-bold text-[#b17411] underline-offset-2 hover:underline"
              >
                {option.title}
              </Link>
            ) : (
              <span className="font-bold text-[#001528]">{option.title}</span>
            )}{" "}
            {option.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

function AboutExpandable({ section }: { section: AboutExpandableSection }) {
  type Challenge = NonNullable<AboutExpandableSection["challenges"]>[number];
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null,
  );

  return (
    <Dialog.Root
      open={activeChallenge !== null}
      onOpenChange={(open) => !open && setActiveChallenge(null)}
    >
      <details className="group w-full max-w-[1320px] overflow-hidden rounded-xl border border-[#E8E4DC] bg-[#FAF9F5]">
        <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-body text-[14px] font-extrabold tracking-[0.04em] text-primary uppercase marker:hidden focus-visible:ring-2 focus-visible:ring-[#b17411]/40 focus-visible:ring-inset focus-visible:outline-none sm:px-6 sm:text-[15px]">
          <span>{section.heading}</span>
          <span
            aria-hidden
            className="flex size-6 shrink-0 items-center justify-center text-[#b17411]"
          >
            <span className="text-[24px] leading-none font-normal group-open:hidden">
              +
            </span>
            <span className="hidden text-[24px] leading-none font-normal group-open:inline">
              −
            </span>
          </span>
        </summary>
        <div className="flex flex-col gap-4 border-t border-[#E8E4DC] bg-white px-5 py-5 font-body text-[15px] leading-[1.4] text-[#5C5F66] sm:px-6">
          {section.paragraphs?.map((paragraph, index) => (
            <Fragment key={paragraphKey(paragraph)}>
              <p>
                <AboutParagraphText paragraph={paragraph} />
              </p>
              {section.challenges && index === 1 ? (
                <ul className="mt-[-8px] flex flex-col gap-0 pl-0">
                  {section.challenges.map((challenge) => (
                    <li key={challenge.title} className="list-none">
                      <button
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => setActiveChallenge(challenge)}
                        className="group/challenge flex min-h-9 cursor-pointer items-start gap-3 text-left font-body text-[15px] leading-[1.4] text-[#5C5F66] hover:text-[#b17411] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17411]"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b17411]"
                        />
                        <span className="group-hover/challenge:underline">
                          {challenge.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Fragment>
          ))}
          {section.options && section.options.length > 0 ? (
            <AboutOptionsList options={section.options} />
          ) : null}
          {section.closingParagraphs?.map((paragraph, index, paragraphs) => (
            <p key={paragraphKey(paragraph)}>
              <AboutParagraphText paragraph={paragraph} />
              {section.heading === "A PRACTICAL STARTING POINT" &&
              index === paragraphs.length - 1 ? (
                <>
                  {" "}
                  <Link
                    href="#investment"
                    className="inline-flex min-h-8 items-center justify-center bg-[#b17411] px-3 font-body text-[12px] font-bold tracking-[0.04em] text-white transition-colors hover:bg-[#8f5d0e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17411]"
                  >
                    (See Investments)
                  </Link>
                </>
              ) : null}
            </p>
          ))}
        </div>
      </details>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
          <Dialog.Close className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17411]">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
          {activeChallenge ? (
            <div className="flex flex-col gap-4 pr-8 font-body text-[14px] leading-relaxed text-[#5C5F66] sm:text-[15px]">
              <Dialog.Title className="font-body text-[16px] font-extrabold tracking-wide text-[#061525] uppercase sm:text-[18px]">
                {activeChallenge.title}
              </Dialog.Title>
              <Dialog.Description className="text-[#5C5F66]">
                {activeChallenge.intro}
              </Dialog.Description>
              <div>
                <h3 className="font-semibold text-[#001528]">
                  Common Problems Include:
                </h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {activeChallenge.commonProblems.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-extrabold tracking-wide text-[#061525] uppercase">
                  HOW WE ADDRESS IT
                </h3>
                <p className="mt-2">{activeChallenge.howWeAddress}</p>
              </div>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface AboutUsSectionProps {
  sectionNumber?: number | string;
}

export function AboutUsSection({ sectionNumber = 2 }: AboutUsSectionProps) {
  const { aboutUs } = siteConfig;

  return (
    <section
      id="about-us"
      aria-labelledby="about-us-heading"
      className="relative w-full overflow-hidden bg-white"
    >
      {/* Top Left Corner Indicator Number ("2") */}
      <div className="absolute left-4 top-3 select-none font-secondary text-[36px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 pt-20 pb-14 sm:px-10 sm:pt-14 lg:px-[82px] lg:py-12">
        <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
          {aboutUs.title}
        </span>

        <h2
          id="about-us-heading"
          className="max-w-[900px] font-body text-[20px] font-bold tracking-[0.04em] text-primary uppercase sm:text-[22px]"
        >
          {aboutUs.heading}
        </h2>

        <div className="flex w-full max-w-[1320px] flex-col gap-5">
          <ul className="flex list-none flex-col gap-2 p-0">
            {aboutUs.openingPoints.map((point) => (
              <li
                key={point}
                className="flex gap-2 font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]"
              >
                <span aria-hidden="true" className="font-bold text-[#b17411]">
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div>
            <p className="font-body text-[15px] leading-[1.4] font-semibold text-[#5C5F66]">
              Practical Improvements In:
            </p>
            <ol className="mt-1 list-decimal pl-6 font-body text-[15px] leading-[1.6] font-normal text-[#5C5F66]">
              {aboutUs.practicalImprovements.map((improvement) => (
                <li key={improvement}>{improvement}</li>
              ))}
            </ol>
          </div>

          <p className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]">
            {aboutUs.openingClosingParagraph}
          </p>
        </div>

        <p className="max-w-[900px] font-body text-[14px] font-extrabold tracking-[0.06em] text-[#061525] uppercase sm:text-[15px]">
          {aboutUs.tagline}
        </p>

        <div className="flex w-full max-w-[1320px] flex-col gap-5">
          {aboutUs.experienceParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid w-full max-w-[1320px] grid-cols-1 gap-3 sm:grid-cols-3">
          {aboutUs.experienceHighlights.map((highlight) => (
            <div
              key={highlight.value}
              className="flex flex-col gap-2 rounded-xl border border-[#E8E4DC] bg-[#FAF9F5] px-5 py-5"
            >
              <p className="font-heading text-[28px] leading-none font-bold tracking-tight text-[#b17411] sm:text-[32px]">
                {highlight.value}
              </p>
              <p className="font-body text-[13px] leading-[1.45] text-[#5C5F66] sm:text-[14px]">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>

        <AboutExpandable section={aboutUs.experienceExpandable} />

        {aboutUs.sections.map((section) => (
          <div
            key={section.heading}
            className="flex w-full max-w-[1320px] flex-col gap-5 border-t border-black/8 pt-8"
          >
            <h3 className="max-w-[900px] font-body text-[18px] font-bold tracking-[0.04em] text-primary uppercase sm:text-[20px]">
              {section.heading}
            </h3>

            {"tagline" in section && section.tagline ? (
              <p className="max-w-[900px] font-body text-[14px] font-extrabold tracking-[0.06em] text-[#061525] uppercase sm:text-[15px]">
                {section.tagline}
              </p>
            ) : null}

            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraphKey(paragraph)}
                className="font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]"
              >
                <AboutParagraphText paragraph={paragraph} />
              </p>
            ))}

            {"expandableSections" in section && section.expandableSections ? (
              <div className="flex flex-col gap-3">
                {section.expandableSections.map((expandable) => (
                  <AboutExpandable
                    key={expandable.heading}
                    section={expandable}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ))}

        <div className="flex w-full max-w-[1320px] flex-col gap-5 border-t border-black/8 pt-8">
          <p className="max-w-[900px] font-body text-[15px] leading-[1.4] font-normal text-[#5C5F66]">
            {aboutUs.closingStatement}
          </p>
          <div>
            <MeetTheFounderDialog />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
