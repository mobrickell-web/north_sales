"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminLogout, clearSession } from "@/lib/auth-api";

export function ClientDashboard({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setSubmitting(true);
    setError("");

    try {
      await adminLogout();
      clearSession();
      router.replace("/login");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not sign out. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020B1E] px-5 py-12 text-white">
      <section className="w-full max-w-2xl rounded-xl border border-white/15 bg-white/[0.04] p-6 text-center shadow-xl sm:p-10">
        <p className="font-secondary text-xs font-bold tracking-[0.16em] text-gold uppercase">
          NORTH POINT SALES GROUP
        </p>
        <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
          Client Dashboard
        </h1>
        <p className="mt-4 text-white/80">Welcome, {name}.</p>
        <p className="mt-1 text-sm text-white/60">{email}</p>
        <p className="mt-7 text-sm leading-6 text-white/70">
          Your client account is signed in. Contact your NORTH POINT SALES GROUP
          representative for assistance with your account.
        </p>
        {error ? (
          <p role="alert" className="mt-5 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={submitting}
          className="mt-7 min-h-11 border border-gold px-6 font-secondary text-xs font-bold tracking-[0.08em] text-gold uppercase transition-colors hover:bg-gold hover:text-[#001528] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing out…" : "Sign out"}
        </button>
      </section>
    </main>
  );
}
