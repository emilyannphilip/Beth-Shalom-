import type { Metadata } from "next";
import { AdmissionContent } from "@/features/public/content/admission";
export const metadata: Metadata = { title: "Admission & Care Enquiry" };
export default function AdmissionPage() {
  return <AdmissionContent />;
}
