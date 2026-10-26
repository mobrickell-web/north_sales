"use client";

import { useState } from "react";
import { ChevronDown, Compass, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface InvestmentSectionProps {
  sectionNumber?: number | string;
}

type InvestmentSubsection = {
  title: string;
  intro?: string;
  items?: readonly string[];
  outro?: string;
};

type InvestmentGroup = {
  title: string;
  intro?: string;
  items?: readonly string[];
  subsections?: readonly InvestmentSubsection[];
  outro?: string;
  numbered?: boolean;
};

function renderInvestmentSubsections(
  subsections: readonly InvestmentSubsection[],
) {
  return (
    <div className="mt-3 flex flex-col gap-3 border-t border-[#E8E4DC] pt-3">
      {subsections.map((subsection) => (
        <div key={subsection.title} className="flex flex-col gap-2">
          <h6 className="font-body text-[13px] font-extrabold text-[#001528] sm:text-[14px]">
            {subsection.title}
          </h6>
          {subsection.intro ? (
            <p className="whitespace-pre-wrap">{subsection.intro}</p>
          ) : null}
          {subsection.items && subsection.items.length > 0 ? (
            <ul className="list-disc space-y-1.5 pl-5">
              {subsection.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {subsection.outro ? (
            <p className="whitespace-pre-wrap">{subsection.outro}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

type InvestmentComparison = {
  intro: string;
  columns: readonly string[];
  rows: readonly { label: string; values: readonly string[] }[];
  closing: readonly (readonly { text: string; bold?: boolean }[])[];
};

type InvestmentPopup = {
  title: string;
  fee: string;
  intro: string;
  includedHeading: string;
  groups: readonly InvestmentGroup[];
  expandableIncluded?: boolean;
  deliverableHeading?: string;
  deliverableIntro?: string;
  deliverableItems?: readonly string[];
  deliverableParagraphs?: readonly string[];
  parametersHeading?: string;
  parametersParagraphs?: readonly string[];
  implementationPeriodHeading?: string;
  implementationPeriodParagraphs?: readonly string[];
  differencesHeading?: string;
  differencesParagraphs?: readonly string[];
  thirdPartyHeading?: string;
  thirdPartyParagraphs?: readonly string[];
  comparison?: InvestmentComparison;
  upgradeHeading?: string;
  upgradeParagraphs?: readonly string[];
  sequenceHeading?: string;
  sequenceIntro?: string;
  sequenceGroups?: readonly InvestmentGroup[];
  sequenceInNestedPopup?: boolean;
  sequenceLinkHint?: string;
  outcomeHeading?: string;
  outcomeParagraphs?: readonly string[];
};

function IncludedServiceGroup({
  group,
  isOpen,
  onToggle,
}: {
  group: InvestmentGroup;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="border-b border-[#E8E4DC] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FAF9F5]"
      >
        <span className="font-body text-[14px] font-semibold text-[#001528]">
          {group.title}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-[#b17411] transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen ? (
        <div className="flex flex-col gap-3 bg-[#FAF9F5] px-4 pt-1 pb-4 font-body text-[14px] leading-relaxed text-[#5C5F66]">
          {group.intro && <p className="whitespace-pre-wrap">{group.intro}</p>}
          {group.items && group.items.length > 0 && (
            <ul className="list-disc space-y-1.5 pl-5">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {group.subsections && group.subsections.length > 0
            ? renderInvestmentSubsections(group.subsections)
            : null}
          {group.outro && <p className="whitespace-pre-wrap">{group.outro}</p>}
        </div>
      ) : null}
    </li>
  );
}

function ExpandableIncludedGroups({
  groups,
}: {
  groups: readonly InvestmentGroup[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <ul className="flex flex-col overflow-hidden rounded-xl border border-[#E8E4DC]">
      {groups.map((group) => {
        const key = group.title;
        return (
          <IncludedServiceGroup
            key={key}
            group={group}
            isOpen={expanded === key}
            onToggle={() => setExpanded((prev) => (prev === key ? null : key))}
          />
        );
      })}
    </ul>
  );
}

function renderGroups(groups: readonly InvestmentGroup[]) {
  return groups.map((group) => (
    <div key={group.title} className="flex flex-col gap-2">
      {group.title ? (
        <h5 className="font-body text-[14px] font-extrabold text-[#001528] sm:text-[15px]">
          {group.title}
        </h5>
      ) : null}
      {group.intro && (
        <div className="flex flex-col gap-3">
          {group.intro.split("\n\n").map((p, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {p}
            </p>
          ))}
        </div>
      )}
      {group.items && group.items.length > 0 ? (
        group.numbered ? (
          <ol className="list-decimal space-y-1.5 pl-5">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        ) : (
          <ul className="list-disc space-y-1.5 pl-5">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )
      ) : null}
      {group.subsections && group.subsections.length > 0
        ? renderInvestmentSubsections(group.subsections)
        : null}
      {group.outro && (
        <div className="flex flex-col gap-3 mt-1">
          {group.outro.split("\n\n").map((p, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  ));
}

function renderDeliverables(popup: InvestmentPopup) {
  if (!popup.deliverableHeading) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
      <h4 className="font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]">
        {popup.deliverableHeading}
      </h4>
      {popup.deliverableIntro && <p>{popup.deliverableIntro}</p>}
      {popup.deliverableItems && popup.deliverableItems.length > 0 && (
        <ul className="list-disc space-y-1.5 pl-5">
          {popup.deliverableItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {popup.deliverableParagraphs?.map((paragraph, index) => (
        <p key={`${paragraph}-${index}`} className="whitespace-pre-wrap">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function renderComparison(comparison: InvestmentComparison) {
  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
      <p>{comparison.intro}</p>
      <div className="-mx-1 sm:mx-0">
        <table className="w-full table-fixed border-collapse text-left text-[11px] leading-snug text-[#5C5F66] min-[420px]:text-[12px] sm:text-[14px] sm:leading-relaxed">
          <thead>
            <tr className="bg-[#6D9EEB] text-[#001528]">
              <th className="w-[24%] border-r border-white/80 px-1.5 py-2.5 sm:w-[20%] sm:px-3 sm:py-3.5" />
              {comparison.columns.map((column, index) => (
                <th
                  key={column}
                  className={cn(
                    "px-1.5 py-2.5 text-center text-[11px] font-extrabold leading-tight break-words min-[420px]:text-[12px] sm:px-3 sm:py-3.5 sm:text-[15px] sm:leading-snug",
                    index < comparison.columns.length - 1 &&
                      "border-r border-white/80",
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="align-top">
                <th className="px-1.5 py-3 font-extrabold break-words text-[#001528] sm:px-3 sm:py-5">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className="px-1.5 py-3 break-words sm:px-3 sm:py-5"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {comparison.closing.map((paragraph, index) => (
        <p key={index}>
          {paragraph.map((part, partIndex) => (
            <span
              key={partIndex}
              className={
                part.bold ? "font-extrabold text-[#001528]" : undefined
              }
            >
              {part.text}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

function renderLeadParagraph(text: string, leadPattern: RegExp) {
  const [lead, ...description] = text.split("\n");
  if (!leadPattern.test(lead)) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="font-extrabold text-[#001528]">{lead}</p>
      {description.length > 0 ? (
        <p className="whitespace-pre-wrap">{description.join("\n")}</p>
      ) : null}
    </div>
  );
}

function renderSectionParagraph(paragraph: string, key: string) {
  const investmentHeading = "SCOPE-BASED INVESTMENT EXAMPLES";
  const optionHeading = "HOW OPTION 3 DIFFERS FROM OPTIONS 1 AND 2";
  const sectionHeadingClass =
    "font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]";

  if (
    paragraph.startsWith("Approximately $") ||
    paragraph.startsWith("Approximately 30 Days") ||
    paragraph.startsWith("Approximately 60")
  ) {
    return (
      <div key={key}>{renderLeadParagraph(paragraph, /^Approximately /)}</div>
    );
  }

  if (paragraph.startsWith(investmentHeading)) {
    const rest = paragraph.slice(investmentHeading.length).replace(/^\n+/, "");
    return (
      <div key={key} className="mt-5 flex flex-col gap-3">
        <p className={sectionHeadingClass}>{investmentHeading}</p>
        {rest ? renderLeadParagraph(rest, /^Approximately \$/) : null}
      </div>
    );
  }

  if (paragraph.startsWith(optionHeading)) {
    const rest = paragraph.slice(optionHeading.length).replace(/^\n+/, "");
    return (
      <div key={key} className="mt-5 flex flex-col gap-3">
        <p className={sectionHeadingClass}>{optionHeading}</p>
        {rest.split("\n\n").map((block, index) => (
          <div key={`${key}-option-${index}`}>
            {renderLeadParagraph(block, /^Option [123] — \$/)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <p key={key} className="whitespace-pre-wrap">
      {paragraph}
    </p>
  );
}

function renderSectionBlock(
  heading: string,
  paragraphs?: readonly string[],
  groups?: readonly InvestmentGroup[],
) {
  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
      <h4 className="font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]">
        {heading}
      </h4>
      {paragraphs?.map((paragraph, index) =>
        renderSectionParagraph(paragraph, `${heading}-${index}`),
      )}
      {groups && groups.length > 0 && (
        <div className="flex flex-col gap-4">{renderGroups(groups)}</div>
      )}
    </div>
  );
}

export function InvestmentSection({
  sectionNumber = 7,
}: InvestmentSectionProps) {
  const { challenges } = siteConfig;
  const { investment } = challenges;
  const [popup, setPopup] = useState<InvestmentPopup | null>(null);
  const [sequencePopupOpen, setSequencePopupOpen] = useState(false);

  const closePopup = () => {
    setSequencePopupOpen(false);
    setPopup(null);
  };

  const openPopup = (next: InvestmentPopup) => {
    setSequencePopupOpen(false);
    setPopup(next);
  };

  const showSequenceInline =
    popup?.sequenceHeading &&
    popup.sequenceGroups &&
    popup.sequenceGroups.length > 0 &&
    !popup.sequenceInNestedPopup;

  const showSequenceLink =
    popup?.sequenceInNestedPopup &&
    popup.sequenceHeading &&
    popup.sequenceGroups &&
    popup.sequenceGroups.length > 0;

  return (
    <section
      id="investment"
      aria-labelledby="investment-heading"
      className="relative w-full overflow-hidden bg-[#FAF9F5] py-12 lg:py-16"
    >
      <div className="absolute left-4 top-4 select-none font-secondary text-[48px] font-bold leading-none text-[#b17411] opacity-60 sm:left-8 sm:top-6 sm:text-[64px]">
        {sectionNumber}
      </div>

      <Dialog.Root
        open={!!popup}
        onOpenChange={(open) => {
          if (!open) closePopup();
        }}
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 sm:px-10 lg:px-16">
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-3 text-center">
            <span className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-1 font-body text-[11px] font-semibold tracking-[0.08em] text-bronze uppercase shadow-xs">
              {investment.badge}
            </span>
            <h2
              id="investment-heading"
              className="font-body text-[20px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[24px]"
            >
              {investment.subtitle}
            </h2>
          </div>

          <ol className="mt-8 flex w-full max-w-[1100px] list-none flex-col gap-4 p-0">
            {investment.tiers.map((tier, index) => (
              <li
                key={tier.title}
                id={`investment-option-${index + 1}`}
                className="scroll-mt-28"
              >
                <button
                  type="button"
                  onClick={() => openPopup({ ...tier.popout })}
                  className="group flex w-full items-start gap-3 rounded-xl border border-transparent p-2 text-left transition-colors hover:border-[#b17411]/25 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#b17411]/40"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#001528] font-body text-[12px] font-bold text-white transition-colors group-hover:bg-[#b17411]">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-body text-[14px] font-extrabold leading-snug text-[#001528] sm:text-[15px]">
                      {tier.title}
                    </p>
                    <p className="font-body text-[13px] leading-relaxed whitespace-pre-wrap text-[#5C5F66]">
                      {tier.description}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-8 w-full max-w-[1100px] rounded-2xl bg-[#001528] p-6 text-white shadow-sm">
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

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
          <Dialog.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95",
              popup?.comparison
                ? "max-w-[860px] p-4 sm:p-8"
                : "max-w-[620px] p-6 sm:p-8",
            )}
          >
            <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Dialog.Close>

            {popup && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 pr-8">
                  <Dialog.Title className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
                    {popup.title}
                  </Dialog.Title>
                  <p className="font-body text-[16px] font-extrabold tracking-wide whitespace-pre-wrap text-[#061525] sm:text-[18px]">
                    {popup.fee}
                  </p>
                </div>
                <Dialog.Description asChild>
                  <div className="flex flex-col gap-5 font-body text-[14px] leading-relaxed text-[#5C5F66] sm:text-[15px]">
                    <div className="flex flex-col gap-3">
                      {popup.intro.split("\n\n").map((p, i) => (
                        <p key={i} className="whitespace-pre-wrap">
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      <h4 className="font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]">
                        {popup.includedHeading}
                      </h4>
                      {popup.expandableIncluded !== false ? (
                        <>
                          <p className="font-body text-[13px] font-bold leading-relaxed text-[#5C5F66]">
                            Select a heading below to view details. Services are
                            tailored to the agreed engagement scope.
                          </p>
                          <ExpandableIncludedGroups groups={popup.groups} />
                        </>
                      ) : (
                        renderGroups(popup.groups)
                      )}
                    </div>

                    {renderDeliverables(popup)}

                    {popup.parametersHeading &&
                      renderSectionBlock(
                        popup.parametersHeading,
                        popup.parametersParagraphs,
                      )}

                    {popup.implementationPeriodHeading &&
                      renderSectionBlock(
                        popup.implementationPeriodHeading,
                        popup.implementationPeriodParagraphs,
                      )}

                    {popup.differencesHeading &&
                      renderSectionBlock(
                        popup.differencesHeading,
                        popup.differencesParagraphs,
                      )}

                    {popup.comparison && renderComparison(popup.comparison)}

                    {popup.upgradeHeading &&
                      renderSectionBlock(
                        popup.upgradeHeading,
                        popup.upgradeParagraphs,
                      )}

                    {popup.thirdPartyHeading &&
                      renderSectionBlock(
                        popup.thirdPartyHeading,
                        popup.thirdPartyParagraphs,
                      )}

                    {showSequenceInline &&
                      renderSectionBlock(
                        popup.sequenceHeading!,
                        popup.sequenceIntro ? [popup.sequenceIntro] : undefined,
                        popup.sequenceGroups,
                      )}

                    {popup.outcomeHeading &&
                      popup.outcomeParagraphs &&
                      popup.outcomeParagraphs.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="font-body text-[13px] font-extrabold tracking-[0.06em] text-[#001528] uppercase sm:text-[14px]">
                            {popup.outcomeHeading}
                          </h4>
                          <div className="mt-3 flex flex-col gap-3">
                            {popup.outcomeParagraphs.map((paragraph, index) => (
                              <p
                                key={`${paragraph}-${index}`}
                                className="whitespace-pre-wrap"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                    {showSequenceLink && (
                      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                        <button
                          type="button"
                          onClick={() => setSequencePopupOpen(true)}
                          className="w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-body text-[13px] font-extrabold tracking-[0.06em] text-[#b17411] uppercase underline decoration-[#b17411]/50 underline-offset-4 transition-colors hover:text-[#8f5d0e] hover:decoration-[#8f5d0e] sm:text-[14px]"
                        >
                          {popup.sequenceHeading}
                        </button>
                        <p className="font-body text-[13px] text-[#5C5F66]">
                          {popup.sequenceLinkHint ??
                            "Click to view the full day-by-day work sequence."}
                        </p>
                      </div>
                    )}
                  </div>
                </Dialog.Description>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>

        <Dialog.Root
          open={sequencePopupOpen}
          onOpenChange={setSequencePopupOpen}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-[60] max-h-[90vh] w-[95vw] max-w-[620px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
              <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Dialog.Close>

              {popup?.sequenceInNestedPopup && (
                <div className="flex flex-col gap-4 pr-6">
                  <Dialog.Title className="font-body text-[15px] font-extrabold tracking-[0.04em] text-primary uppercase sm:text-[17px]">
                    {popup.sequenceHeading}
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <div className="flex flex-col gap-5 font-body text-[14px] leading-relaxed text-[#5C5F66] sm:text-[15px]">
                      {popup.sequenceIntro && <p>{popup.sequenceIntro}</p>}
                      {popup.sequenceGroups && (
                        <div className="flex flex-col gap-4">
                          {renderGroups(popup.sequenceGroups)}
                        </div>
                      )}
                    </div>
                  </Dialog.Description>
                  <button
                    type="button"
                    onClick={() => setSequencePopupOpen(false)}
                    className="mt-2 inline-flex h-[40px] w-full cursor-pointer items-center justify-center border border-[#001528]/15 bg-[#FAF9F5] px-4 font-secondary text-[12px] font-bold tracking-[0.1em] text-[#001528] uppercase transition-colors hover:bg-white"
                  >
                    Back to engagement details
                  </button>
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Dialog.Root>
    </section>
  );
}

export default InvestmentSection;
