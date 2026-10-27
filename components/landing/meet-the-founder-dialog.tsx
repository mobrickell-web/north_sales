"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type FounderParagraph =
  string | { readonly text: string; readonly bold?: boolean };

function founderParagraphText(paragraph: FounderParagraph) {
  return typeof paragraph === "string" ? paragraph : paragraph.text;
}

function founderParagraphBold(paragraph: FounderParagraph) {
  return typeof paragraph === "object" && Boolean(paragraph.bold);
}

// Renders **double-asterisk** segments as <strong>.
function renderRichText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i} className="font-bold text-[#001528]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function MeetTheFounderDialog() {
  const [open, setOpen] = useState(false);
  const { buttonLabel, name, role, paragraphs } = siteConfig.aboutUs.founder;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex h-[40px] cursor-pointer items-center justify-center bg-[#b17411] px-5 font-body text-[12px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e] sm:h-[44px] sm:text-[13px]"
        >
          {buttonLabel}
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
              {name}
            </Dialog.Title>
            <Dialog.Description className="mt-1 font-body text-[13px] font-semibold tracking-[0.04em] text-[#b17411] uppercase">
              {role}
            </Dialog.Description>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-3 font-body text-[14px] leading-relaxed text-[#5C5F66]">
              {paragraphs.map((paragraph, index) => {
                const text = founderParagraphText(
                  paragraph as FounderParagraph,
                );
                return (
                  <p
                    key={`${text}-${index}`}
                    className={cn(
                      founderParagraphBold(paragraph as FounderParagraph) &&
                        "font-bold text-[#001528]",
                    )}
                  >
                    {renderRichText(text)}
                  </p>
                );
              })}
            </div>

            <div className="mt-7 border-t border-black/8 pt-5">
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
