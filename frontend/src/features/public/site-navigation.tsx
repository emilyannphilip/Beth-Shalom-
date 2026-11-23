"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type NavigationLinkProps = ComponentProps<typeof Link> & {
  pathname: string;
};

export function NavigationLink({
  pathname,
  href,
  className = "",
  ...props
}: NavigationLinkProps) {
  const active = href === pathname;
  const activeClasses = "text-primary font-bold bg-surface-container";
  const inactiveClasses =
    "text-on-surface-variant hover:text-on-surface hover:bg-surface-container";

  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? activeClasses : inactiveClasses}`}
    />
  );
}
