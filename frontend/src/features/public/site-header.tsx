"use client";
import { useEffect, useRef, useState } from "react";
import type { PublicView } from "./site-routes";
import Link from "next/link";
import { SiteImage } from "./site-image";
import { NavigationLink } from "./site-navigation";
export function SiteHeader({
  view,
  pathname,
}: {
  view: PublicView;
  pathname: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const header = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);
  const menuId = "mobile-nav-" + view.toLowerCase();
  function openMenu() {
    if (timer.current !== null) clearTimeout(timer.current);
    setMenuVisible(true);
    frame.current = requestAnimationFrame(() => setMenuOpen(true));
  }
  function closeMenu() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (timer.current !== null) clearTimeout(timer.current);
    setMenuOpen(false);
    timer.current = setTimeout(() => setMenuVisible(false), 270);
  }
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const styles = document.documentElement.style;
    const measureHeight = () => {
      styles.setProperty(
        "--public-header-height",
        Math.ceil(element.getBoundingClientRect().height) + "px",
      );
    };
    measureHeight();
    const observer = new ResizeObserver(measureHeight);
    observer.observe(element);

    let fragmentFrame = 0;
    const clearRestoredFragment = () => {
      cancelAnimationFrame(fragmentFrame);
      fragmentFrame = requestAnimationFrame(() => {
        const target = document.getElementById(window.location.hash.slice(1));
        if (!target?.closest("main")) return;
        const top = target.getBoundingClientRect().top;
        if (top >= 0 && top < element.getBoundingClientRect().bottom)
          target.scrollIntoView({ block: "start" });
      });
    };
    window.addEventListener("pageshow", clearRestoredFragment);
    if (document.readyState === "complete") clearRestoredFragment();

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", clearRestoredFragment);
      cancelAnimationFrame(fragmentFrame);
      styles.removeProperty("--public-header-height");
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    function onPointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        closeMenu();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key !== "Escape" ||
        !header.current?.querySelector(
          "[data-mobile-menu-toggle][aria-expanded=true]",
        )
      )
        return;
      closeMenu();
      header.current
        .querySelector<HTMLButtonElement>("[data-mobile-menu-toggle]")
        ?.focus();
    }
    function onResize() {
      if (media.matches) closeMenu();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onResize);
      if (timer.current !== null) clearTimeout(timer.current);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);
  return (
    <header
      className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md shadow-[0_2px_12px_rgba(7,36,26,0.06)]"
      ref={header}
    >
      <div className="bg-surface-container-low py-1.5 px-margin-mobile md:px-margin">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 text-on-surface-variant">
          <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
            <span className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[16px] text-secondary"
                aria-hidden="true"
              >
                call
              </span>
              <a
                className="hover:text-primary transition-colors"
                href="tel:+918289838745"
              >
                +91 8289838745
              </a>
            </span>
            <span className="opacity-40">|</span>
            <a
              className="hover:text-primary transition-colors"
              href="tel:+919947575762"
            >
              +91 9947575762
            </a>
          </div>
          <div className="flex items-center gap-space-md font-label-sm text-label-sm">
            <span className="hidden sm:inline-block text-on-surface-variant opacity-80">
              Under Kottayam Diocese Auspices
            </span>
          </div>
        </div>
      </div>
      <div className="h-20 max-w-7xl mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
        <Link
          className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim rounded-lg p-1 shrink-0"
          data-path="home"
          href="/"
          prefetch={false}
          onClick={closeMenu}
        >
          <SiteImage
            src="/beth-shalom/assets/beth-shalom-logo.jpeg"
            alt="Beth Shalom logo"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full bg-white p-0.5 shrink-0"
            width={64}
            height={64}
            loading="eager"
          />
          <span className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
              Beth Shalom
            </span>
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden xl:flex items-center gap-1 font-label-md text-label-md"
          data-active-classes="text-primary font-bold bg-surface-container rounded-lg"
        >
          <NavigationLink
            className="px-space-sm py-2 transition-colors rounded-lg"
            data-path="home"
            href="/"
            pathname={pathname}
            onClick={closeMenu}
          >
            Home
          </NavigationLink>
          <NavigationLink
            className="px-space-sm py-2 transition-colors rounded-lg"
            data-path="about-us"
            href="/about-us"
            pathname={pathname}
            onClick={closeMenu}
          >
            About Us
          </NavigationLink>
          <NavigationLink
            className="px-space-sm py-2 transition-colors rounded-lg"
            data-path="rooms"
            href="/rooms"
            pathname={pathname}
            onClick={closeMenu}
          >
            Rooms
          </NavigationLink>
          <NavigationLink
            className="px-space-sm py-2 transition-colors rounded-lg"
            data-path="facilities"
            href="/facilities"
            pathname={pathname}
            onClick={closeMenu}
          >
            Facilities
          </NavigationLink>
          <NavigationLink
            className="px-space-sm py-2 transition-colors rounded-lg"
            data-path="contact"
            href="/contact"
            pathname={pathname}
            onClick={closeMenu}
          >
            Contact
          </NavigationLink>
        </nav>
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            data-mobile-menu-toggle=""
            aria-controls={menuId}
            aria-expanded={menuOpen}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="xl:hidden inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low text-primary shadow-sm transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-secondary"
            onClick={menuOpen ? closeMenu : openMenu}
          >
            <span
              data-menu-icon=""
              className="material-symbols-outlined text-[24px]"
              aria-hidden="true"
            >
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
          <Link
            className="hidden xl:inline-flex items-center justify-center min-h-[48px] px-space-md py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim focus:ring-offset-2"
            data-path="admission-inquiry"
            href="/admission-enquiry"
            prefetch={false}
            onClick={closeMenu}
          >
            Admission Enquiry
          </Link>
        </div>
      </div>
      <div
        id={menuId}
        data-mobile-nav-panel=""
        className={
          "mobile-menu-panel absolute left-0 right-0 top-full z-[60] border-t border-outline-variant/30 bg-[#f8fbf8] shadow-xl backdrop-blur-xl xl:hidden" +
          (menuOpen ? " is-open" : "")
        }
        hidden={!menuVisible}
      >
        <div className="mobile-menu-scroll max-w-7xl mx-auto px-margin-mobile py-3 md:px-margin">
          <nav
            aria-label="Mobile primary navigation"
            className="flex flex-col gap-1"
          >
            <NavigationLink
              className="w-full min-h-[48px] px-3 py-3 transition-colors rounded-lg"
              data-path="home"
              href="/"
              pathname={pathname}
              onClick={closeMenu}
            >
              Home
            </NavigationLink>
            <NavigationLink
              className="w-full min-h-[48px] px-3 py-3 transition-colors rounded-lg"
              data-path="about-us"
              href="/about-us"
              pathname={pathname}
              onClick={closeMenu}
            >
              About Us
            </NavigationLink>
            <NavigationLink
              className="w-full min-h-[48px] px-3 py-3 transition-colors rounded-lg"
              data-path="rooms"
              href="/rooms"
              pathname={pathname}
              onClick={closeMenu}
            >
              Rooms
            </NavigationLink>
            <NavigationLink
              className="w-full min-h-[48px] px-3 py-3 transition-colors rounded-lg"
              data-path="facilities"
              href="/facilities"
              pathname={pathname}
              onClick={closeMenu}
            >
              Facilities
            </NavigationLink>
            <NavigationLink
              className="w-full min-h-[48px] px-3 py-3 transition-colors rounded-lg"
              data-path="contact"
              href="/contact"
              pathname={pathname}
              onClick={closeMenu}
            >
              Contact
            </NavigationLink>
          </nav>
          <div className="mt-3 grid grid-cols-1 gap-2 border-t border-outline-variant/30 pt-3 sm:grid-cols-2">
            <Link
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-primary-container px-4 py-3 text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary"
              data-path="admission-inquiry"
              href="/admission-enquiry"
              prefetch={false}
              onClick={closeMenu}
            >
              Admission Enquiry
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
