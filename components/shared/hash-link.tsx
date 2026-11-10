"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

type HashLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Anchor for in-page hash links. Next's <Link> updates the URL for a hash on
 * the current page without scrolling to the target, so scroll here instead.
 */
export function HashLink({ href, onClick, ...props }: HashLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !href?.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
