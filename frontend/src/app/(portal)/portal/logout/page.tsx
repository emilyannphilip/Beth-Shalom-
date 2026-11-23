import type { Metadata } from "next";
import { PortalLogout } from "@/features/portal/screens/logout";
export const metadata: Metadata = { title: { absolute: "Logout — Beth Shalom Retirement Home" } };
export default function Page() {
  return <PortalLogout />;
}
