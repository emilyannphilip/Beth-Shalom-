import type { ReactNode } from "react";
import { ServerPortalGate } from "@/features/portal/server-gate";
export default function StaffLayout({ children }: { children: ReactNode }) {
  return <ServerPortalGate role="staff">{children}</ServerPortalGate>;
}
