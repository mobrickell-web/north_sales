"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  AdminAlert,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import {
  isRateLimited,
  isSuperAdmin,
  adminLogin,
  clearSession,
  storeSession,
} from "@/lib/admin-auth";

type FormError = { tone: "error" | "info"; message: string };

export function AdminLoginForm() {
  const router = useRouter();

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
        message: "Please enter your email and password.",
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
          message: "This account does not have dashboard access.",
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className={adminLabelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@northpointsales.com"
          className={adminInputClass}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className={adminLabelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${adminInputClass} pr-12`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8A8F98] transition-colors hover:text-[#001528]"
          >
            {showPassword ? (
              <EyeOff className="size-[18px]" />
            ) : (
              <Eye className="size-[18px]" />
            )}
          </button>
        </div>
      </div>

      {error ? (
        <AdminAlert tone={error.tone}>{error.message}</AdminAlert>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={adminPrimaryButtonClass}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
