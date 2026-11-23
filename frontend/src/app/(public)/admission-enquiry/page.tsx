import type { Metadata } from "next";
import { AdmissionContent } from "@/features/public/content/admission";
export const metadata: Metadata = { title: "Admission & Care Inquiry" };
export default function AdmissionPage() {
  return <AdmissionContent />;
}
