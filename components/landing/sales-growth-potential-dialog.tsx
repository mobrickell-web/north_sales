"use client";

import { ArrowRight, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

const salesGrowthPotential = {
  linkLabel: "Learn more",
  title: "MORE SALES. MORE PROFIT POTENTIAL.",
  paragraphs: [
    "We help identify and implement improvements that may increase annual gross sales by 5%–25% or more using your existing sales force.",
    "But more sales are only valuable when they produce worthwhile additional profit.",
    "We evaluate how much remains after the expenses associated with the additional revenue, such as product costs and commissions. That is additional contribution profit. If fixed operating expenses remain unchanged, it also increases operating profit.",
    "We then compare that profit potential with your engagement investment.",
  ],
  disclaimer:
    "The 5%–25% refers to potential annual gross sales growth—not a promised increase in profit. No specific result is guaranteed.",
} as const;

/**
 * The "5%–25%+" About Us stat card. The whole card is the dialog trigger so it
 * can be opened by click, Enter or Space.
 */
export function SalesGrowthPotentialCard({
  value,
  description,
  className = "",
}: {
  value: string;
  description: string;
  className?: string;
}) {
  const { linkLabel, title, paragraphs, disclaimer } = salesGrowthPotential;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`group flex h-full w-full cursor-pointer flex-col gap-2 text-left transition-colors hover:border-[#b17411] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17411] ${className}`}
        >
          <span className="block font-heading text-[28px] leading-none font-bold tracking-tight text-[#b17411] sm:text-[32px]">
            {value}
          </span>
          <span className="block font-body text-[13px] leading-[1.45] text-[#5C5F66] sm:text-[14px]">
            {description}
          </span>
          <span className="mt-auto inline-flex items-center gap-1 pt-1 font-body text-[12px] font-bold tracking-[0.08em] text-[#b17411] uppercase group-hover:underline group-hover:underline-offset-2">
            {linkLabel}
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex max-h-[90vh] w-[95vw] max-w-[620px] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95">
          <Dialog.Close className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b17411]">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="shrink-0 border-b border-black/8 px-6 pt-6 pb-4 sm:px-8">
            <Dialog.Title className="pr-10 font-body text-[16px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[18px]">
              {title}
            </Dialog.Title>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <Dialog.Description asChild>
              <div className="flex flex-col gap-3 font-body text-[14px] leading-relaxed text-[#5C5F66] sm:text-[15px]">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Dialog.Description>

            <p className="mt-5 rounded-lg border border-[#E8E4DC] bg-[#FAF9F5] px-4 py-3 font-body text-[13px] leading-relaxed font-semibold text-[#001528] sm:text-[14px]">
              {disclaimer}
            </p>

            <div className="mt-7 border-t border-black/8 pt-5">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-[44px] min-w-[160px] cursor-pointer items-center justify-center bg-[#b17411] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
                >
                  Close
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
