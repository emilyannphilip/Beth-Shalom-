import type { Metadata } from "next";
import { HarmonyContent } from "@/features/public/content/harmony";
export const metadata: Metadata = { title: "Harmony Suite" };
export default function HarmonyPage() {
  return <HarmonyContent />;
}
