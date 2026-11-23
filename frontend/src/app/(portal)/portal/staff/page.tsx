import type { Metadata } from "next";
import { StaffDashboard } from "@/features/portal/screens/staff";
export const metadata: Metadata = { title: { absolute: "Staff Dashboard — Beth Shalom Retirement Home" } };
export default function Page() {
  return <StaffDashboard />;
}
