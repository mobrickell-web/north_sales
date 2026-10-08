"use client";

import { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";

export function SocialMediaDialog() {
  const [open, setOpen] = useState(false);
  const { title, paragraphs } = siteConfig.footer.socialMediaNote;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="cursor-pointer text-left font-body text-[12px] text-white/50 transition-colors hover:text-white"
        >
          Social Media Policy
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[560px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <Dialog.Title className="pr-8 font-body text-[18px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[20px]">
            {title}
          </Dialog.Title>

          <Dialog.Description asChild>
            <div className="mt-4 flex flex-col gap-3 font-body text-[14px] leading-relaxed text-[#5C5F66]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Dialog.Description>

          <div className="mt-7 border-t border-black/8 pt-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-[44px] min-w-[160px] cursor-pointer items-center justify-center bg-[#b17411] px-6 font-body text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
            >
              Close
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SocialMediaDialog;
