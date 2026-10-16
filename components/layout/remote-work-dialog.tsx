"use client";

import { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";

export function RemoteWorkDialog() {
  const [open, setOpen] = useState(false);
  const { linkLabel, title, intro, items, tagline, closing } =
    siteConfig.footer.remoteWork;

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
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex max-h-[90vh] w-[95vw] max-w-[680px] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95">
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
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Dialog.Description>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <ol className="flex flex-col gap-4">
              {items.map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <span className="font-body text-[14px] font-extrabold text-[#b17411]">
                    {index + 1}.
                  </span>
                  <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                    <span className="font-extrabold text-[#001528]">
                      {item.title}
                    </span>
                    {" – "}
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-6 border-t border-[#E8E4DC] pt-5">
              <p className="font-body text-[14px] font-extrabold tracking-wide text-[#001528]">
                {tagline}
              </p>
              <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {closing}
              </p>
            </div>

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
