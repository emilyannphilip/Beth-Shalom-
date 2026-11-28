import type { ReactNode } from "react";
import { AvailabilityProvider } from "@/features/public/room-availability";
import { PublicFrame } from "@/features/public/public-frame";
import { SiteFooter, WhatsAppShortcut } from "@/features/public/site-footer";
import { WelcomeEnquiry } from "@/features/public/welcome-enquiry";
import "@/features/public/public-fonts.css";
import "@/features/public/public-theme.css";
import "@/features/public/public-overrides.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div data-interface="public" className="bg-surface">
      <AvailabilityProvider>
        <PublicFrame>{children}</PublicFrame>
      </AvailabilityProvider>
      <WhatsAppShortcut />
      <SiteFooter />
      <WelcomeEnquiry />
    </div>
  );
}
