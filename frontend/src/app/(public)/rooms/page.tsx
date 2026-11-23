import type { Metadata } from "next";
import { RoomsContent } from "@/features/public/content/rooms";
export const metadata: Metadata = { title: "Rooms" };
export default function RoomsPage() {
  return <RoomsContent />;
}
