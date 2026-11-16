"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";

import { AuthRedirectOverlay } from "@/components/shared/app-toast";
import { authConfig } from "@/config/auth";
import {
  adminLogin,
  getRoleHomePath,
  getSafeNextPath,
  storeSession,
  type LoginCategory,
} from "@/lib/auth-api";
import { toast, toastAuthFailure } from "@/lib/toast";

export function LoginForm({
  category = "MASTER_ADMIN",
  forgotPasswordControl,
}: {
  category?: LoginCategory;
  forgotPasswordControl?: ReactNode;
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = authConfig;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (category === "OTHER") {
      router.replace("/");
      return;
    }
    if (!email || !password) {
      toast.error(login.emptyFieldsMessage);
      return;
    }

    setSubmitting(true);

    try {
      const session = await adminLogin(email, password, category);
      storeSession(session);
      setRedirecting(true);
      toast.afterRedirect("Signed in successfully.");
      const nextPath = getSafeNextPath(searchParams.get("next"));
      router.replace(
        nextPath ?? getRoleHomePath(session.admin.role, session.admin.position),
      );
    } catch (err) {
      toastAuthFailure(err);
      setSubmitting(false);
      setRedirecting(false);
    }
  };

  return (
    <>
      <AuthRedirectOverlay open={submitting || redirecting} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="sr-only" htmlFor="admin-login-email">
          {login.email.label}
        </label>
        <input
          id="admin-login-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={login.email.placeholder}
          disabled={submitting || redirecting}
          className="h-12 w-full rounded-xl border border-input px-3 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15 disabled:opacity-60"
          required
        />

        <div className="relative">
          <label className="sr-only" htmlFor="admin-login-password">
            {login.password.label}
          </label>
          <input
            id="admin-login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={login.password.placeholder}
            disabled={submitting || redirecting}
            className="h-12 w-full rounded-xl border border-input px-3 pr-12 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15 disabled:opacity-60"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={submitting || redirecting}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:cursor-not-allowed"
          >
            {showPassword ? (
              <EyeOff className="size-[18px]" />
            ) : (
              <Eye className="size-[18px]" />
            )}
          </button>
        </div>

        {forgotPasswordControl}

        <button
          type="submit"
          disabled={submitting || redirecting}
          className="mt-1 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:cursor-not-allowed disabled:opacity-60"
        >
          {redirecting
            ? "Redirecting…"
            : submitting
              ? login.submittingLabel
              : login.continueButtonLabel}
        </button>
      </form>
    </>
  );
}
