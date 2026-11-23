import type { Metadata } from "next";
import { PortalLogin } from "@/features/portal/screens/login";
export const metadata: Metadata = {
  title: { absolute: "Unified Portal Login — Beth Shalom Retirement Home" },
};
export default function Page() {
  return <PortalLogin />;
}
