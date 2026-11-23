import type { Metadata } from "next";
import { ContactContent } from "@/features/public/content/contact";
export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  return <ContactContent />;
}
