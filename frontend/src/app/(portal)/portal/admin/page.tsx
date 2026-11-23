import type { Metadata } from "next";
import { AdminDashboard } from "@/features/portal/screens/admin";
export const metadata: Metadata = { title: { absolute: "Admin Dashboard — Beth Shalom Retirement Home" } };
export default function Page() {
  return <AdminDashboard />;
}
