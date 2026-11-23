import type { ReactNode } from "react";
import { DemoRoute } from "@/features/portal/demo-session";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DemoRoute role="admin">{children}</DemoRoute>;
}
