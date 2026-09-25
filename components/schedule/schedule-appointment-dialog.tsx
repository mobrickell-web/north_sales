"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type ScheduleAppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormState = {
  companyName: string;
  email: string;
  appointmentType: string;
  date: string;
  time: string;
  duration: string;
};

const emptyForm: FormState = {
  companyName: "",
  email: "",
  appointmentType: "",
  date: "",
  time: "",
  duration: "",
};

type FieldErrors = {
  email?: string;
  time?: string;
};

export function ScheduleAppointmentDialog({
  open,
  onOpenChange,
}: ScheduleAppointmentDialogProps) {
  const { appointmentForm } = siteConfig;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) {
      const timer = window.setTimeout(() => {
        setForm(emptyForm);
        setSubmitted(false);
        setSubmitting(false);
        setError(null);
        setFieldErrors({});
      }, 200);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const today = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    if (key === "email" || key === "time") {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateRequiredFields = () => {
    const nextErrors: FieldErrors = {};
    const emailValue = form.email.trim();

    if (!emailValue) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(emailValue)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.time) {
      nextErrors.time = "Please select an available time.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateRequiredFields()) {
      setError("Please fill in the required email and time fields.");
      return;
    }

    if (
      !form.companyName.trim() ||
      !form.appointmentType ||
      !form.date ||
      !form.duration
    ) {
      setError("Please complete all fields before scheduling.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/schedule-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          email: form.email.trim(),
          appointmentType: form.appointmentType,
          date: form.date,
          time: form.time,
          duration: form.duration,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setError(
          data?.error ||
            "Unable to send appointment request. Please try again.",
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Unable to send appointment request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-gray-400 focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20";

  const labelClass =
    "mb-1.5 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[95vw] max-w-[560px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 sm:p-8">
          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 className="size-12 text-[#b17411]" />
              <Dialog.Title className="font-body text-[18px] font-extrabold tracking-wide text-[#001528] uppercase">
                {appointmentForm.successTitle}
              </Dialog.Title>
              <Dialog.Description className="font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {appointmentForm.successMessage}
              </Dialog.Description>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-2 inline-flex h-[44px] min-w-[180px] cursor-pointer items-center justify-center bg-[#b17411] px-6 font-secondary text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#8f5d0e]"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 pr-8">
                <Dialog.Title className="font-body text-[18px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[20px]">
                  {appointmentForm.title}
                </Dialog.Title>
                <Dialog.Description className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                  {appointmentForm.subtitle}
                </Dialog.Description>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="companyName" className={labelClass}>
                    Prospect / Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    value={form.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className={fieldClass}
                    placeholder="Company or prospect name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Prospect Email{" "}
                    <span className="text-red-600" aria-hidden>
                      *
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={cn(
                      fieldClass,
                      fieldErrors.email &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                    )}
                    placeholder="name@company.com"
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                  />
                  {fieldErrors.email && (
                    <p
                      id="email-error"
                      className="mt-1.5 font-body text-[12px] font-semibold text-red-600"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="appointmentType" className={labelClass}>
                    Appointment Type
                  </label>
                  <select
                    id="appointmentType"
                    name="appointmentType"
                    value={form.appointmentType}
                    onChange={(e) =>
                      updateField("appointmentType", e.target.value)
                    }
                    className={cn(fieldClass, "cursor-pointer")}
                    required
                  >
                    <option value="" disabled>
                      Select appointment type
                    </option>
                    {appointmentForm.appointmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className={labelClass}>
                      Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      className={cn(fieldClass, "cursor-pointer")}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className={labelClass}>
                      Available Time{" "}
                      <span className="text-red-600" aria-hidden>
                        *
                      </span>
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={form.time}
                      onChange={(e) => updateField("time", e.target.value)}
                      className={cn(
                        fieldClass,
                        "cursor-pointer",
                        fieldErrors.time &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                      )}
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.time}
                      aria-describedby={
                        fieldErrors.time ? "time-error" : undefined
                      }
                    >
                      <option value="" disabled>
                        Select time
                      </option>
                      {appointmentForm.timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.time && (
                      <p
                        id="time-error"
                        className="mt-1.5 font-body text-[12px] font-semibold text-red-600"
                      >
                        {fieldErrors.time}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="duration" className={labelClass}>
                    Meeting Duration
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={form.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className={cn(fieldClass, "cursor-pointer")}
                    required
                  >
                    <option value="" disabled>
                      Select duration
                    </option>
                    {appointmentForm.durations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p className="font-body text-[13px] font-semibold text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex h-[48px] w-full cursor-pointer items-center justify-center bg-[#b17411] px-6 font-secondary text-[14px] font-bold tracking-[0.14em] text-white uppercase shadow-sm transition-colors hover:bg-[#8f5d0e] focus:outline-none focus:ring-2 focus:ring-[#b17411]/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Sending…" : appointmentForm.submitLabel}
                </button>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
