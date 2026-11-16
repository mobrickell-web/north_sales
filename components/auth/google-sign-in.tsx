"use client";

import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { MouseEvent } from "react";

import {
  googleLogin,
  getRoleHomePath,
  getSafeNextPath,
  storeSession,
  type LoginCategory,
} from "@/lib/auth-api";
import { toast, toastAuthFailure } from "@/lib/toast";

type GoogleCredentialResponse = {
  credential?: string;
};

type PromptMoment = {
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
};

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        auto_select: false;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      prompt: (callback?: (moment: PromptMoment) => void) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInScript({
  onReady,
  onError,
}: {
  onReady: () => void;
  onError: () => void;
}) {
  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onReady={onReady}
      onError={onError}
    />
  );
}

export function useGoogleSignIn(category: LoginCategory = "CLIENT") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const submitting = useRef(false);
  // Google keeps the callback registered at initialize time, so the selected
  // category has to be read through a ref instead of a captured value.
  const categoryRef = useRef(category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useLayoutEffect(() => {
    categoryRef.current = category;
  }, [category]);

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential || submitting.current) return;

      submitting.current = true;
      setIsSubmitting(true);
      try {
        const session = await googleLogin(
          response.credential,
          categoryRef.current,
        );
        storeSession(session);
        setIsRedirecting(true);
        toast.afterRedirect("Signed in successfully.");
        const nextPath = getSafeNextPath(searchParams.get("next"));
        router.replace(
          nextPath ??
            getRoleHomePath(session.admin.role, session.admin.position),
        );
      } catch (cause) {
        toastAuthFailure(
          cause instanceof Error
            ? cause
            : new Error("Google sign-in failed. Please try again."),
        );
        submitting.current = false;
        setIsSubmitting(false);
        setIsRedirecting(false);
      }
    },
    [router, searchParams],
  );

  const initialize = useCallback(() => {
    if (initialized.current || !GOOGLE_CLIENT_ID || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      auto_select: false,
      callback: (response) => void handleCredential(response),
    });
    initialized.current = true;
  }, [handleCredential]);

  const handleScriptError = useCallback(() => {
    toast.error("Google sign-in could not load. Please try again.");
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (category === "OTHER") {
        event.preventDefault();
        router.replace("/");
        return;
      }
      if (!GOOGLE_CLIENT_ID) {
        toast.error("Google sign-in is not configured.");
        return;
      }
      if (!initialized.current || !window.google) {
        toast.error("Google sign-in is still loading. Please try again.");
        return;
      }
      if (submitting.current) return;

      event.preventDefault();
      window.google.accounts.id.prompt((moment) => {
        if (moment.isNotDisplayed()) {
          toast.error(
            moment.getNotDisplayedReason() === "browser_not_supported"
              ? "Google sign-in is not supported in this browser."
              : "Google sign-in could not open. Check your browser's popup or privacy settings and try again.",
          );
        } else if (moment.isSkippedMoment()) {
          if (moment.getSkippedReason() === "user_cancel") return;
          toast.error("Google sign-in was skipped. Please try again.");
        } else if (
          moment.isDismissedMoment() &&
          moment.getDismissedReason() !== "credential_returned"
        ) {
          toast.error("Google sign-in was dismissed.");
        }
      });
    },
    [category, router],
  );

  return {
    handleClick,
    initialize,
    handleScriptError,
    isSubmitting,
    isRedirecting,
  };
}
