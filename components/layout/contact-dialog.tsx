"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, Phone, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";
import { sendContactMessage } from "@/lib/contact-api";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#9AA0A6] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20";
const labelClass =
  "mb-1 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase";

const emptyForm = { name: "", email: "", phone: "", company: "", message: "" };

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const { phone, email } = siteConfig.footer.contact;
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const update =
    (field: keyof typeof emptyForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setError(null);
      if (sent) {
        setSent(false);
        setForm(emptyForm);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[520px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
          <Dialog.Title className="pr-8 font-body text-[18px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[20px]">
            Contact Us
          </Dialog.Title>
          <Dialog.Description className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
            Send us a message and we&apos;ll get back to you, or reach us
            directly.
          </Dialog.Description>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={`tel:+1${phone.replace(/\D/g, "")}`}
              className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 font-body text-[14px] font-bold text-[#001528] transition-colors hover:border-[#b17411] hover:text-[#b17411]"
            >
              <Phone className="size-4 shrink-0 text-[#b17411]" aria-hidden />
              <span>
                <span className="block text-[11px] font-semibold tracking-[0.08em] text-[#5C5F66] uppercase">
                  Phone
                </span>
                {phone}
              </span>
            </a>
            <div className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 font-body text-[14px] font-bold text-[#001528]">
              <Mail className="size-4 shrink-0 text-[#b17411]" aria-hidden />
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold tracking-[0.08em] text-[#5C5F66] uppercase">
                  Email
                </span>
                <span className="block break-all">{email}</span>
              </span>
            </div>
          </div>

          {sent ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-[#E8E4DC] bg-[#FAF9F5] px-5 py-8 text-center">
              <CheckCircle2 className="size-10 text-[#b17411]" aria-hidden />
              <p className="font-body text-[16px] font-extrabold text-[#001528]">
                Message sent
              </p>
              <p className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                Thank you, {form.name.trim() || "we received your message"}.
                We&apos;ll reply to {form.email.trim()} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    required
                    maxLength={150}
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={255}
                    autoComplete="email"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    maxLength={50}
                    autoComplete="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-company" className={labelClass}>
                    Company
                  </label>
                  <input
                    id="contact-company"
                    maxLength={150}
                    autoComplete="organization"
                    value={form.company}
                    onChange={update("company")}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  maxLength={5000}
                  value={form.message}
                  onChange={update("message")}
                  className={inputClass}
                />
              </div>

              {error ? (
                <p className="rounded-lg border border-[#f3c9c9] bg-[#fdf3f3] px-3 py-2 font-body text-[13px] text-[#8f2d2d]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-[46px] w-full cursor-pointer items-center justify-center bg-[#b17411] px-6 font-secondary text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
