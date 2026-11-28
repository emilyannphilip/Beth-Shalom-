import type { ReactNode } from "react";
import { PortalProvider } from "@/features/portal/portal-session";
import "@/features/portal/portal-theme.css";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <div data-interface="portal"><PortalProvider>{children}</PortalProvider></div>;
}
