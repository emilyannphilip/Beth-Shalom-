import type { Metadata } from "next";
import { FacilitiesContent } from "@/features/public/content/facilities";
export const metadata: Metadata = { title: "Facilities" };
export default function FacilitiesPage() {
  return <FacilitiesContent />;
}
