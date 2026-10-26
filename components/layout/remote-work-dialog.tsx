"use client";

import { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";

const dialogTitleClass =
  "pr-8 font-body text-[16px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[18px]";
const dialogSubtitleClass =
  "mt-2 font-body text-[12px] font-semibold tracking-[0.04em] text-[#b17411] uppercase sm:text-[13px]";
const sectionHeadingClass =
  "font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase";
const itemHeadingClass =
  "font-body text-[13px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[14px]";
const sectionEmphasisClass =
  "font-body text-[14px] font-extrabold leading-relaxed text-[#001528] uppercase";

export function RemoteWorkDialog() {
  const [open, setOpen] = useState(false);
  const {
    linkLabel,
    title,
    subtitle,
    intro,
    examplesHeading,
    items,
    outsideSales,
    bottomLine,
  } = siteConfig.footer.remoteWork;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-left font-body text-[13px] text-white/70 transition-colors hover:text-[#d48c27]"
        >
          <span
            aria-hidden
            className="size-1 shrink-0 rounded-full bg-[#d48c27]/70"
          />
          {linkLabel}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90dvh] w-[95vw] max-w-[680px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 [-webkit-overflow-scrolling:touch] sm:flex sm:max-h-[90vh] sm:flex-col sm:overflow-hidden">
          <Dialog.Close className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="border-b border-black/8 px-6 pt-6 pb-4 sm:shrink-0 sm:px-8">
            <Dialog.Title className={dialogTitleClass}>{title}</Dialog.Title>
            <p className={dialogSubtitleClass}>{subtitle}</p>
            <Dialog.Description asChild>
              <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Dialog.Description>
          </div>

          <div className="px-6 py-5 pb-8 sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:px-8 sm:pb-5">
            <section>
              <h3 className={sectionHeadingClass}>{examplesHeading}</h3>

              <ol className="mt-4 flex list-none flex-col gap-6">
                {items.map((item, index) => (
                  <li key={item.title}>
                    <h4 className={itemHeadingClass}>
                      {index + 1}. {item.title}
                    </h4>
                    <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-6 border-t border-[#E8E4DC] pt-5">
              <h3 className={sectionHeadingClass}>{outsideSales.heading}</h3>
              <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {outsideSales.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="mt-6 border-t border-[#E8E4DC] pt-5">
              <h3 className={sectionHeadingClass}>{bottomLine.heading}</h3>
              <p className={`mt-3 ${sectionEmphasisClass}`}>
                {bottomLine.emphasis}
              </p>
              <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {bottomLine.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className={`mt-4 ${sectionEmphasisClass}`}>
                {bottomLine.tagline}
              </p>
            </section>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-[44px] min-w-[160px] cursor-pointer items-center justify-center bg-[#b17411] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
