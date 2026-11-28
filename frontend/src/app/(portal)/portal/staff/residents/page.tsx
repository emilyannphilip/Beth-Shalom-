import type { Metadata } from "next";
import { ResidentManagement } from "@/features/portal/screens/residents";

export const metadata: Metadata = {
  title: {
    absolute: "Admitted Residents Management — Beth Shalom Retirement Home",
  },
};

export default function Page() {
  return <ResidentManagement staff />;
}
