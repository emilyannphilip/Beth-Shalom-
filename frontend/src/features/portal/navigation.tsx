"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ComponentProps,
} from "react";
import { DetailDialog } from "./portal-dialog";
import { useDemo } from "./demo-session";

function subscribeToMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function useSidebar(): {
  collapsed: boolean;
  expanded: boolean;
  ariaExpanded: boolean;
  toggle: () => void;
  dismiss: () => void;
} {
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const mobile = useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    function handleResize() {
      if (!media.matches) setExpanded(false);
    }
    function outside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !document.getElementById("app-sidebar")?.contains(event.target)
      )
        setExpanded(false);
    }
    function escape(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        expanded &&
        !document.querySelector("[data-interface=portal] dialog[open]")
      ) {
        setExpanded(false);
        document
          .getElementById("app-sidebar")
          ?.querySelector<HTMLButtonElement>(
            "[aria-label='Toggle sidebar width']",
          )
          ?.focus();
      }
    }
    media.addEventListener("change", handleResize);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      media.removeEventListener("change", handleResize);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [expanded]);

  return {
    collapsed,
    expanded,
    ariaExpanded: mobile ? expanded : !collapsed,
    toggle: () => {
      if (window.matchMedia("(max-width: 767px)").matches)
        setExpanded((value) => !value);
      else setCollapsed((value) => !value);
    },
    dismiss: () => setExpanded(false),
  };
}

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

export function PortalLink({
  href,
  close,
  sidebar,
  children,
  ...props
}: ComponentProps<"a"> & {
  href: string;
  close?: () => void;
  sidebar?: boolean;
}) {
  const pathname = usePathname();
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const fragment = href.indexOf("#");
  const samePage = fragment >= 0 && href.slice(0, fragment) === pathname;
  const active = sidebar && href === pathname + hash;
  const activeProp = active ? "page" : undefined;
  if (samePage) {
    return (
      <a
        {...props}
        aria-current={activeProp}
        href={href.slice(fragment)}
        onClick={close}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      {...props}
      aria-current={activeProp}
      href={href}
      prefetch={false}
      onClick={close}
    >
      {children}
    </Link>
  );
}

export function LogoutButton(props: ComponentProps<"button">) {
  const router = useRouter();
  return (
    <button
      {...props}
      type="button"
      onClick={() => router.push("/portal/logout")}
    />
  );
}

export function ProfileButton(props: ComponentProps<"button">) {
  const [open, setOpen] = useState(false);
  const { session } = useDemo();
  const staff = session?.role === "staff";
  return (
    <>
      <button
        {...props}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      />
      <DetailDialog
        title={
          open ? (staff ? "My Profile & Rota" : "Profile & Security") : null
        }
        dismiss={() => setOpen(false)}
      >
        <p className="text-body-md">
          {session?.name} ·{" "}
          {staff
            ? "Staff Access (Restricted). Contact the Administration Desk at ext. 4010 for rota and account changes."
            : "Admin Privilege (RBAC). Sign out when you finish using this demo."}
        </p>
      </DetailDialog>
    </>
  );
}
