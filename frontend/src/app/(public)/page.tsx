import type { Metadata } from "next";
import { HomeContent } from "@/features/public/content/home";
export const metadata: Metadata = { title: { absolute: "Beth Shalom GMI Retirement Home" } };
export default function HomePage() {
  return <HomeContent />;
}
