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

export function CancellationRefundDialog() {
  const [open, setOpen] = useState(false);
  const { linkLabel, title, subtitle, intro, sections } =
    siteConfig.footer.cancellationRefund;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-start gap-2 text-left font-body text-[13px] leading-snug text-white/70 transition-colors hover:text-[#d48c27]"
        >
          <span
            aria-hidden
            className="mt-1.5 size-1 shrink-0 rounded-full bg-[#d48c27]/70"
          />
          {linkLabel}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90dvh] w-[95vw] max-w-[720px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 [-webkit-overflow-scrolling:touch] sm:flex sm:max-h-[90vh] sm:flex-col sm:overflow-hidden">
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
            {sections.map((section) => (
              <section
                key={section.heading}
                className="mt-6 border-t border-[#E8E4DC] pt-5 first:mt-0 first:border-t-0 first:pt-0"
              >
                <h3 className={sectionHeadingClass}>{section.heading}</h3>

                {section.paragraphs.length ? (
                  <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}

                {"bullets" in section && section.bullets ? (
                  <ul className="mt-2 flex flex-col gap-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b17411]"
                        />
                        <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {"closing" in section && section.closing ? (
                  <div className="mt-2 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {section.closing.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}

                {"contact" in section && section.contact ? (
                  <p className="mt-3 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    {section.contact.lead}
                    <a
                      href={section.contact.phoneHref}
                      className="font-bold text-[#b17411] underline-offset-2 hover:underline"
                    >
                      {section.contact.phoneLabel}
                    </a>
                    {section.contact.middle}
                    <a
                      href={section.contact.emailHref}
                      className="font-bold text-[#b17411] underline-offset-2 hover:underline"
                    >
                      {section.contact.emailLabel}
                    </a>
                  </p>
                ) : null}
              </section>
            ))}

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
