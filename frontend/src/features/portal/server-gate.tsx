import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieSettings, forward } from "@/lib/api-server";
import { dashboardRoute, type PortalRole } from "./models";
import { RestoreSession } from "./restore-session";
import { PortalSessionSeed } from "./portal-session";
import type { PortalSession } from "./models";

export async function ServerPortalGate({
  role,
  children,
}: {
  role: PortalRole | "signed-in";
  children: ReactNode;
}) {
  const store = await cookies();
  const names = cookieSettings();
  const token = store.get(names.access)?.value;
  const canRefresh = Boolean(store.get(names.refresh)?.value);
  if (!token && !canRefresh) redirect("/portal/login");
  let actor: (Omit<PortalSession, "role"> & { role: string }) | undefined;
  let unavailable = false;
  if (token) {
    try {
      const response = await forward("/auth/context", {
        headers: { Authorization: "Bearer " + token },
      });
      if (response.ok) actor = await response.json();
      else if (response.status !== 401) unavailable = true;
    } catch {
      unavailable = true;
    }
  }
  if (unavailable) return <RestoreSession retry />;
  if (!actor) {
    if (!canRefresh) redirect("/portal/login?expired=1");
    return <RestoreSession />;
  }
  const current = actor.role === "ADMIN" ? "admin" : "staff";
  if (role !== "signed-in" && role !== current)
    redirect(dashboardRoute(current));
  return (
    <PortalSessionSeed
      actor={{ id: actor.id, name: actor.name, role: current }}
    >
      {children}
    </PortalSessionSeed>
  );
}
