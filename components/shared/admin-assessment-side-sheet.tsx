"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function AdminAssessmentSideSheet({
  title,
  description,
  labelledBy,
  closeLabel,
  onClose,
  children,
  footer,
}: {
  title: string;
  description: string;
  labelledBy: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[60] flex justify-end bg-black/50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="my-[3px] flex h-[calc(100dvh-6px)] max-h-[1022px] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-admin-surface shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-4 border-b border-admin-border bg-admin-surface px-5 py-4 sm:px-7">
          <div>
            <h2
              id={labelledBy}
              className="text-[18px] font-semibold text-admin-text-strong"
            >
              {title}
            </h2>
            <p className="mt-1 text-[12px] leading-relaxed text-admin-muted">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-admin-muted hover:bg-admin-soft hover:text-admin-text-strong"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
          {children}
        </div>

        <footer className="sticky bottom-0 z-10 flex shrink-0 items-center justify-end gap-1 border-t border-admin-border bg-admin-surface px-3 py-3 sm:gap-2 sm:px-5">
          {footer}
        </footer>
      </section>
    </div>
  );
}
