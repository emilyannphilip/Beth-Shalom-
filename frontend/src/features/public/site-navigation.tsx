"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type NavigationLinkProps = ComponentProps<typeof Link> & {
  pathname: string;
};

export function NavigationLink({
  pathname,
  href,
  className = "",
  onPointerEnter,
  onFocus,
  ...props
}: NavigationLinkProps) {
  const router = useRouter();
  const active = href === pathname;
  function prefetchOnIntent() {
    if (
      process.env.NODE_ENV === "production" &&
      !active &&
      typeof href === "string"
    )
      router.prefetch(href);
  }
  const activeClasses = "text-primary font-bold bg-surface-container";
  const inactiveClasses =
    "text-on-surface-variant hover:text-on-surface hover:bg-surface-container";

  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onPointerEnter={(event) => {
        prefetchOnIntent();
        onPointerEnter?.(event);
      }}
      onFocus={(event) => {
        prefetchOnIntent();
        onFocus?.(event);
      }}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? activeClasses : inactiveClasses}`}
    />
  );
}
