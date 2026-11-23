/* eslint-disable @next/next/no-page-custom-font -- The shared App Router layout loads the original public fonts on every public route. */
import type { ReactNode } from "react";
import { PublicFrame } from "@/features/public/public-frame";
import { SiteFooter, WhatsAppShortcut } from "@/features/public/site-footer";
import { WelcomeEnquiry } from "@/features/public/welcome-enquiry";
import "@/features/public/public-theme.css";
import "@/features/public/public-overrides.css";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div data-interface="public">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        precedence="beth-shalom-fonts"
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
      />
      <link
        rel="stylesheet"
        precedence="beth-shalom-fonts"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600&display=swap"
      />
      <link
        rel="stylesheet"
        precedence="beth-shalom-fonts"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
      />
      <link
        rel="stylesheet"
        precedence="beth-shalom-fonts"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
      <PublicFrame>{children}</PublicFrame>
      <WhatsAppShortcut />
      <SiteFooter />
      <WelcomeEnquiry />
    </div>
  );
}
