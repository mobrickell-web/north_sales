"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { AdminAlert } from "@/components/admin/admin-ui";
import { authConfig } from "@/config/auth";
import {
  isRateLimited,
  isSuperAdmin,
  adminLogin,
  clearSession,
  storeSession,
} from "@/lib/admin-auth";

type FormError = { tone: "error" | "info"; message: string };

export function AdminLoginForm({
  forgotPasswordControl,
}: {
  forgotPasswordControl?: ReactNode;
} = {}) {
  const router = useRouter();
  const { login } = authConfig;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError({
        tone: "error",
        message: login.emptyFieldsMessage,
      });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const session = await adminLogin(email, password);

      if (!isSuperAdmin(session.admin)) {
        clearSession();
        setError({
          tone: "error",
          message: login.unauthorizedMessage,
        });
        return;
      }

      storeSession(session);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError({
        tone: isRateLimited(err) ? "info" : "error",
        message: (err as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
        className="h-12 w-full rounded-xl border border-input px-3 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
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
          className="h-12 w-full rounded-xl border border-input px-3 pr-12 font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground placeholder:text-muted-foreground focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
        >
          {showPassword ? (
            <EyeOff className="size-[18px]" />
          ) : (
            <Eye className="size-[18px]" />
          )}
        </button>
      </div>

      {forgotPasswordControl}

      {error ? (
        <AdminAlert tone={error.tone}>{error.message}</AdminAlert>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-bronze font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-white transition-colors hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            {login.submittingLabel}
          </>
        ) : (
          login.continueButtonLabel
        )}
      </button>
    </form>
  );
}
