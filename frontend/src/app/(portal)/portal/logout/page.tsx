import type { Metadata } from "next";
import { PortalLogout } from "@/features/portal/screens/logout";
import { ServerPortalGate } from "@/features/portal/server-gate";
export const metadata: Metadata = {
  title: { absolute: "Logout — Beth Shalom Retirement Home" },
};
export default function Page() {
  return (
    <ServerPortalGate role="signed-in">
      <PortalLogout />
    </ServerPortalGate>
  );
}
