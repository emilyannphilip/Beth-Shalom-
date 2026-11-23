import type { ReactNode } from "react";
import { DemoRoute } from "@/features/portal/demo-session";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <DemoRoute role="staff">{children}</DemoRoute>;
}
