import Link from "next/link";
import Image from "next/image";

type AppointmentPageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AppointmentPageShell({
  title,
  subtitle,
  children,
}: AppointmentPageShellProps) {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center bg-[#FAF9F5] px-4 py-10 sm:py-16"
    >
      <div className="w-full max-w-[640px]">
        <Link href="/" className="mb-8 flex justify-center">
          <Image
            src="/logo/north-logo.svg"
            alt="NORTH POINT SALES GROUP"
            width={230}
            height={48}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_8px_28px_rgba(0,21,40,0.08)]">
          <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />
          <div className="p-6 sm:p-9">
            <h1 className="font-body text-[22px] font-extrabold tracking-wide text-[#001528] uppercase sm:text-[26px]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
                {subtitle}
              </p>
            ) : null}
            <div className="mt-6">{children}</div>
          </div>
        </div>

        <p className="mt-6 text-center font-body text-[12px] text-[#8A8F98]">
          North Point Sales Group ·{" "}
          <a
            href="mailto:contact@northpointsalesgroup.com"
            className="text-[#b17411] hover:underline"
          >
            contact@northpointsalesgroup.com
          </a>
        </p>
      </div>
    </main>
  );
}

type DetailRowProps = { label: string; value: React.ReactNode };

export function AppointmentDetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#EFEBE3] px-4 py-3 last:border-b-0 odd:bg-[#F7F5F0]">
      <span className="font-body text-[11px] font-bold tracking-[0.06em] text-[#5C5F66] uppercase">
        {label}
      </span>
      <span className="text-right font-body text-[14px] font-semibold text-[#001528]">
        {value}
      </span>
    </div>
  );
}

export function AppointmentStateMessage({
  tone = "error",
  children,
}: {
  tone?: "error" | "info";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "error"
      ? "border-[#f3c9c9] bg-[#fdf3f3] text-[#8f2d2d]"
      : "border-[#E8E4DC] bg-[#F7F5F0] text-[#5C5F66]";
  return (
    <div
      className={`rounded-lg border px-4 py-3 font-body text-[14px] ${toneClass}`}
    >
      {children}
    </div>
  );
}

export const appointmentInputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-gray-400 focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20";

export const appointmentLabelClass =
  "mb-1.5 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase";

export const appointmentButtonClass =
  "inline-flex h-[46px] items-center justify-center rounded-full bg-[#b17411] px-6 font-secondary text-[13px] font-bold tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#8f5d0e] disabled:cursor-not-allowed disabled:opacity-60";

export const appointmentSecondaryButtonClass =
  "inline-flex h-[46px] items-center justify-center rounded-full border border-[#E8E4DC] bg-white px-6 font-secondary text-[13px] font-bold tracking-[0.1em] text-[#001528] uppercase transition-colors hover:border-[#b17411] hover:text-[#b17411]";
