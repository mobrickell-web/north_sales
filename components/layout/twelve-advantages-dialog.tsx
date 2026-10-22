"use client";

import { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";

type TwelveAdvantagesDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the footer-style trigger (use when opening from another control). */
  hideTrigger?: boolean;
};

export function TwelveAdvantagesDialog({
  open: openProp,
  onOpenChange,
  hideTrigger = false,
}: TwelveAdvantagesDialogProps = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const twelveAdvantages = siteConfig.whyChooseUs.modal.twelveAdvantages;
  const { linkLabel, title, intro, pillars, bottomLine, cta } =
    twelveAdvantages;

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
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[720px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:flex sm:flex-col sm:overflow-hidden">
          <Dialog.Close className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="border-b border-black/8 px-6 pt-6 pb-4 sm:shrink-0 sm:px-8">
            <Dialog.Title className="pr-8 font-body text-[16px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[18px]">
              {title}
            </Dialog.Title>
            <Dialog.Description asChild>
              <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Dialog.Description>
          </div>

          <div className="px-6 py-5 sm:flex-1 sm:overflow-y-auto sm:px-8">
            {pillars.map((pillar) => (
              <section key={pillar.title} className="mb-8 last:mb-0">
                <h3 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                  {pillar.title}
                </h3>

                <div className="mt-4 flex flex-col gap-6">
                  {pillar.advantages.map((item) => (
                    <article key={item.number}>
                      <h4 className="font-body text-[13px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[14px]">
                        {item.number}. {item.title}
                      </h4>
                      <div className="mt-2 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                        {item.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      <ul className="mt-3 flex flex-col gap-2">
                        {item.bullets.map((bullet) => {
                          const colonIndex = bullet.indexOf(": ");
                          const hasLabel =
                            colonIndex > 0 &&
                            colonIndex < 40 &&
                            !bullet.slice(0, colonIndex).includes(".");
                          return (
                            <li key={bullet} className="flex gap-3">
                              <span
                                aria-hidden
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b17411]"
                              />
                              <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                                {hasLabel ? (
                                  <>
                                    <span className="font-extrabold text-[#001528]">
                                      {bullet.slice(0, colonIndex)}:
                                    </span>{" "}
                                    {bullet.slice(colonIndex + 2)}
                                  </>
                                ) : (
                                  bullet
                                )}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                      {"closing" in item && item.closing ? (
                        <p className="mt-3 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                          {item.closing}
                        </p>
                      ) : null}
                      <p className="mt-3 font-body text-[14px] font-extrabold leading-relaxed text-[#001528]">
                        {item.advantage}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <section className="mt-2 border-t border-[#E8E4DC] pt-6">
              <h3 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                {bottomLine.title}
              </h3>
              <p className="mt-3 font-body text-[14px] font-extrabold leading-relaxed text-[#001528] uppercase">
                {bottomLine.headline}
              </p>
              <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {bottomLine.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="mt-6 border-t border-[#E8E4DC] pt-6">
              <h3 className="font-body text-[14px] font-extrabold tracking-wide text-[#001528] uppercase">
                {cta.title}
              </h3>
              <div className="mt-3 flex flex-col gap-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {cta.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
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
