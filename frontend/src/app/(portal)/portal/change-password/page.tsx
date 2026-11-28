import type { Metadata } from "next";
import { ServerPortalGate } from "@/features/portal/server-gate";
import { PasswordScreen } from "@/features/portal/screens/password";
export const metadata: Metadata = { title: "Change Password — Beth Shalom" };
export default function Page() {
  return (
    <ServerPortalGate role="signed-in">
      <PasswordScreen mode="change" />
    </ServerPortalGate>
  );
}
