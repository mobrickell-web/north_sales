"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { LoginForm } from "@/components/auth/login-form";
import {
  GoogleSignInScript,
  useGoogleSignIn,
} from "@/components/auth/google-sign-in";
import { AuthScreenLayout } from "@/components/shared/auth-screen-layout";
import { authConfig } from "@/config/auth";
import type { LoginCategory } from "@/lib/auth-api";

export function LoginScreen({
  initialCategory = "CLIENT",
}: {
  initialCategory?: LoginCategory;
}) {
  const [category, setCategory] = useState<LoginCategory>(initialCategory);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const google = useGoogleSignIn(category);
  const { login } = authConfig;
  // Sent with the login request; the API rejects it unless it matches the role
  // stored on the account.
  const loginCategories: { value: LoginCategory; label: string }[] = [
    { value: "CLIENT", label: "Clients" },
    { value: "SALES_REPRESENTATIVE", label: "Sales Representatives" },
    { value: "MASTER_ADMIN", label: "Master Admin" },
    { value: "OTHER", label: "Other (Guest)" },
  ];
  const selectedCategoryIndex = loginCategories.findIndex(
    (option) => option.value === category,
  );

  useEffect(() => {
    if (!categoryMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !categoryDropdownRef.current?.contains(event.target)
      ) {
        setCategoryMenuOpen(false);
      }
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setCategoryMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoryMenuOpen]);

  const selectCategory = (index: number) => {
    setCategory(loginCategories[index].value);
    setActiveCategoryIndex(index);
    setCategoryMenuOpen(false);
  };

  const handleCategoryKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!categoryMenuOpen) {
        setActiveCategoryIndex(selectedCategoryIndex);
        setCategoryMenuOpen(true);
        return;
      }
      setActiveCategoryIndex((current) =>
        event.key === "ArrowDown"
          ? (current + 1) % loginCategories.length
          : (current - 1 + loginCategories.length) % loginCategories.length,
      );
    } else if (event.key === "Home" && categoryMenuOpen) {
      event.preventDefault();
      setActiveCategoryIndex(0);
    } else if (event.key === "End" && categoryMenuOpen) {
      event.preventDefault();
      setActiveCategoryIndex(loginCategories.length - 1);
    } else if (
      (event.key === "Enter" || event.key === " ") &&
      categoryMenuOpen
    ) {
      event.preventDefault();
      selectCategory(activeCategoryIndex);
    }
  };

  return (
    <AuthScreenLayout>
      <GoogleSignInScript
        onReady={google.initialize}
        onError={google.handleScriptError}
      />
      <div className="mb-5 text-center">
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-[30px] leading-[1.15] font-bold tracking-[-0.04em] text-primary sm:text-[36px]">
          {login.title}
        </h1>
        <p className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-[14px] leading-[1.5] text-muted-foreground sm:text-[16px]">
          {login.description}
        </p>
      </div>

      <label
        htmlFor="login-category"
        className="mb-1 font-[family-name:var(--font-plus-jakarta)] text-[12px] font-semibold text-foreground"
      >
        Sign in as
      </label>
      <div ref={categoryDropdownRef} className="relative z-20 mb-3">
        <button
          id="login-category"
          type="button"
          role="combobox"
          aria-label="Sign in as"
          aria-haspopup="listbox"
          aria-expanded={categoryMenuOpen}
          aria-controls="login-category-options"
          onClick={() => {
            setActiveCategoryIndex(selectedCategoryIndex);
            setCategoryMenuOpen((open) => !open);
          }}
          onKeyDown={handleCategoryKeyDown}
          className="flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-input bg-white px-4 text-left font-[family-name:var(--font-plus-jakarta)] text-[13px] text-foreground shadow-sm transition-colors hover:border-bronze focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/15"
        >
          <span>{loginCategories[selectedCategoryIndex]?.label}</span>
          <ChevronDown
            aria-hidden="true"
            className={`size-4 text-muted-foreground transition-transform ${categoryMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
        {categoryMenuOpen ? (
          <div
            id="login-category-options"
            role="listbox"
            aria-label="Sign in as"
            className="absolute top-[calc(100%+8px)] left-0 z-30 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
          >
            {loginCategories.map((option, index) => {
              const selected = option.value === category;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveCategoryIndex(index)}
                  onClick={() => selectCategory(index)}
                  className={`flex min-h-10 w-full cursor-pointer items-center rounded-[10px] px-3.5 text-left font-[family-name:var(--font-plus-jakarta)] text-[13px] transition-colors ${
                    index === activeCategoryIndex
                      ? "bg-slate-800 font-semibold text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={google.handleClick}
        disabled={google.isSubmitting}
        aria-busy={google.isSubmitting}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-input px-4 font-[family-name:var(--font-plus-jakarta)] text-[13px] font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
      >
        <Image
          src="/images/auth/google-icon.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          unoptimized
          className="size-4"
        />
        {login.googleButtonLabel}
      </button>
      {google.error ? (
        <p role="alert" className="mt-2 text-center text-sm text-destructive">
          {google.error}
        </p>
      ) : null}

      <div className="my-4 border-t border-border" aria-hidden="true" />

      <LoginForm
        category={category}
        forgotPasswordControl={
          <div className="flex justify-end">
            <Link
              href={login.forgotPasswordHref}
              className="cursor-pointer font-[family-name:var(--font-plus-jakarta)] text-[12px] font-semibold text-bronze hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze"
            >
              {login.forgotPasswordLabel}
            </Link>
          </div>
        }
      />

      <p className="mt-6 text-center font-[family-name:var(--font-plus-jakarta)] text-[12px] text-muted-foreground">
        {login.signupPrompt}{" "}
        <Link
          href={login.signupHref}
          className="cursor-pointer font-semibold text-bronze underline underline-offset-2 hover:brightness-90"
        >
          {login.signupLinkLabel}
        </Link>
      </p>
    </AuthScreenLayout>
  );
}
