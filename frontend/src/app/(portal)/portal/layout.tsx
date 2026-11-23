import type { ReactNode } from "react";
import { DemoProvider } from "@/features/portal/demo-session";
import "@/features/portal/portal-theme.css";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <div data-interface="portal"><DemoProvider>{children}</DemoProvider></div>;
}
