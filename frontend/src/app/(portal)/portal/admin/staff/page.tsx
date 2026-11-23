import type { Metadata } from "next";
import { StaffManagement } from "@/features/portal/screens/staff-management";
export const metadata: Metadata = {
  title: { absolute: "Staff Management (Admin) — Beth Shalom Retirement Home" },
};
export default function Page() {
  return <StaffManagement />;
}
