import type { Metadata } from "next";
import { AboutContent } from "@/features/public/content/about";
export const metadata: Metadata = { title: "About Us" };
export default function AboutPage() {
  return <AboutContent />;
}
