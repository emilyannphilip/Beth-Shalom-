"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SiteHeader } from "./site-header";
import {
  legacyPublicRoutes,
  publicRoutes,
  type PublicView,
} from "./site-routes";

export function PublicFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const view =
    (Object.keys(publicRoutes) as PublicView[]).find(
      (id) => publicRoutes[id] === pathname,
    ) ?? "P-01";

  useEffect(() => {
    function resolveLegacyHash() {
      const hash = window.location.hash.slice(1).toLowerCase();
      if (!Object.hasOwn(legacyPublicRoutes, hash)) return;
      const route = legacyPublicRoutes[hash];

      if (route === window.location.pathname) {
        window.history.replaceState(null, "", route + window.location.search);
        window.scrollTo(0, 0);
      } else {
        router.replace(route + window.location.search);
      }
    }

    resolveLegacyHash();
    window.addEventListener("hashchange", resolveLegacyHash);
    return () => window.removeEventListener("hashchange", resolveLegacyHash);
  }, [router]);

  return (
    <section
      id={`page-${view.toLowerCase()}`}
      data-page={view}
      className="bg-surface font-body-md text-body-md text-on-surface antialiased"
    >
      <SiteHeader key={view} view={view} pathname={pathname} />
      {children}
    </section>
  );
}
