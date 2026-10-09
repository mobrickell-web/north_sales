"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";

function KpiSection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-[11px] font-extrabold tracking-[0.08em] text-[#b17411] uppercase">
        {label}
      </p>
      <p className="mt-0.5 font-body text-[13px] leading-relaxed text-[#5C5F66]">
        {value}
      </p>
    </div>
  );
}

export function SalesKpiGuideDialog() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { title, intro, categories } = siteConfig.footer.salesKpiGuide;

  const toggle = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

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
          {title}
        </button>
      </Dialog.Trigger>

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
              <div className="mt-3 flex flex-col gap-2 font-body text-[13px] leading-relaxed text-[#5C5F66]">
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Dialog.Description>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-7">
              {categories.map((category) => (
                <section key={category.title} className="flex flex-col gap-3">
                  <div>
                    <h3 className="font-body text-[15px] font-extrabold tracking-wide text-[#001528] uppercase">
                      {category.title}
                    </h3>
                    <p className="mt-1 font-body text-[13px] leading-relaxed text-[#5C5F66]">
                      {category.summary}
                    </p>
                  </div>

                  <ul className="flex flex-col overflow-hidden rounded-xl border border-[#E8E4DC]">
                    {category.kpis.map((kpi) => {
                      const key = `${category.title}-${kpi.title}`;
                      const isOpen = expanded === key;

                      return (
                        <li
                          key={key}
                          className="border-b border-[#E8E4DC] last:border-b-0"
                        >
                          <button
                            type="button"
                            onClick={() => toggle(key)}
                            aria-expanded={isOpen}
                            className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FAF9F5]"
                          >
                            <span className="font-body text-[14px] font-semibold text-[#001528]">
                              {kpi.title}
                            </span>
                            <ChevronDown
                              aria-hidden
                              className={`size-4 shrink-0 text-[#b17411] transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isOpen ? (
                            <div className="flex flex-col gap-3 bg-[#FAF9F5] px-4 pt-1 pb-4">
                              <KpiSection
                                label="What it measures"
                                value={kpi.measures}
                              />
                              <KpiSection
                                label="Why it matters"
                                value={kpi.matters}
                              />
                              <KpiSection
                                label="What we evaluate"
                                value={kpi.evaluate}
                              />
                              {"note" in kpi && kpi.note ? (
                                <KpiSection label="Note" value={kpi.note} />
                              ) : null}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-black/8 px-6 py-4 sm:px-8">
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

export default SalesKpiGuideDialog;
