import type { ReactNode } from "react";
import { ServerPortalGate } from "@/features/portal/server-gate";
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ServerPortalGate role="admin">{children}</ServerPortalGate>;
}
