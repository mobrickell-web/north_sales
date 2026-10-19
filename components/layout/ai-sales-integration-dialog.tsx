"use client";

import { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";

type AiSalesIntegrationDialogProps = {
  /** When provided, the dialog is controlled by the parent. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the footer-style trigger (use when opening from another control). */
  hideTrigger?: boolean;
};

export function AiSalesIntegrationDialog({
  open: openProp,
  onOpenChange,
  hideTrigger = false,
}: AiSalesIntegrationDialogProps = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const {
    linkLabel,
    title,
    headline,
    intro,
    applications,
    approach,
    cost,
    partOfApproach,
  } = siteConfig.footer.aiSalesIntegration;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {hideTrigger ? null : (
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
      )}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex max-h-[90vh] w-[95vw] max-w-[720px] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95">
          <Dialog.Close className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="shrink-0 border-b border-black/8 px-6 pt-6 pb-4 sm:px-8">
            <Dialog.Title className="pr-8 font-body text-[18px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[20px]">
              {title}
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                <p className="font-extrabold text-[#001528]">{headline}</p>
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Dialog.Description>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <ul className="flex flex-col gap-4">
              {applications.map((item) => (
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

            {[approach, cost, partOfApproach].map((section) => (
              <section
                key={section.title}
                className="mt-6 border-t border-[#E8E4DC] pt-5"
              >
                <h3 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                  {section.title}
                </h3>
                <div className="mt-2 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
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
