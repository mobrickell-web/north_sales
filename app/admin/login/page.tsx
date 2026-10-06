import Image from "next/image";

import { AdminLoginForm } from "@/components/admin/admin-login";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#FAF9F5] px-4 py-10 sm:py-16">
      <div className="w-full max-w-[460px]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/north-logo.svg"
            alt="NORTH POINT SALES GROUP"
            width={230}
            height={48}
            className="h-11 w-auto"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-[0_8px_28px_rgba(0,21,40,0.08)]">
          <div className="h-1 w-full bg-gradient-to-r from-[#b17411] via-[#C99B31] to-[#b17411]" />
          <div className="p-6 sm:p-9">
            <h1 className="font-body text-[22px] font-extrabold tracking-[0.04em] text-[#001528] uppercase sm:text-[24px]">
              Admin Login
            </h1>
            <p className="mt-2 font-body text-[14px] leading-relaxed text-[#5C5F66]">
              Sign in with your super admin account to continue.
            </p>
            <div className="mt-6">
              <AdminLoginForm />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-body text-[12px] text-[#8A8F98]">
          North Point Sales Group · authorised access only
        </p>
      </div>
    </main>
  );
}
