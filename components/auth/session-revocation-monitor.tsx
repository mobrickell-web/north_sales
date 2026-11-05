"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  clearSession,
  hasSession,
  isUnauthorized,
  validateStoredSession,
} from "@/lib/auth-api";

const SESSION_CHECK_INTERVAL_MS = 10_000;

export function SessionRevocationMonitor() {
  const router = useRouter();
  const pathname = usePathname();
  const checking = useRef(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      if (!active || checking.current || !hasSession()) return;

      checking.current = true;
      try {
        await validateStoredSession();
      } catch (error) {
        if (isUnauthorized(error)) {
          clearSession();
          if (pathname !== "/login") router.replace("/login");
        } else {
          console.error("Could not verify the current session.", error);
        }
      } finally {
        checking.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkSession();
      }
    };

    void checkSession();
    const intervalId = window.setInterval(
      () => void checkSession(),
      SESSION_CHECK_INTERVAL_MS,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, router]);

  return null;
}
