"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}`);
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed right-4 bottom-4 z-50 flex size-10 cursor-pointer items-center justify-center rounded-md bg-white text-[#001528] shadow-md transition-all duration-300 hover:bg-[#f5f5f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b17411] sm:right-6 sm:bottom-6 sm:size-11",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp className="size-5" strokeWidth={2.25} />
    </button>
  );
}
