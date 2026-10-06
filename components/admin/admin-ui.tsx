import { cn } from "@/lib/utils";

export const adminInputClass =
  "w-full rounded-lg border border-[#E8E4DC] bg-white px-3.5 py-2.5 font-body text-[14px] text-[#001528] outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#b17411] focus:ring-2 focus:ring-[#b17411]/20";

export const adminLabelClass =
  "mb-1.5 block font-body text-[12px] font-bold tracking-[0.04em] text-[#001528] uppercase";

export const adminPrimaryButtonClass =
  "inline-flex h-[46px] items-center justify-center rounded-full bg-[#b17411] px-6 font-secondary text-[13px] font-bold tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#8f5d0e] disabled:cursor-not-allowed disabled:opacity-60";

export function AdminAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "info";
  children: React.ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-4 py-3 font-body text-[14px]",
        tone === "error"
          ? "border-[#f3c9c9] bg-[#fdf3f3] text-[#8f2d2d]"
          : "border-[#E8E4DC] bg-[#F7F5F0] text-[#5C5F66]",
      )}
    >
      {children}
    </div>
  );
}

export function AdminCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_8px_28px_rgba(0,21,40,0.08)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />
      <div className="p-6 sm:p-8">
        <h2 className="font-body text-[18px] font-extrabold tracking-[0.03em] text-[#001528] uppercase">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
