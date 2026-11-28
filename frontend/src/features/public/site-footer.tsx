import Link from "next/link";
import { SiteImage } from "./site-image";
export function SiteFooter() {
  return (
    <footer id="site-footer" className="site-footer">
      <div className="public-section-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <SiteImage
              src="/beth-shalom/assets/beth-shalom-logo.jpeg"
              alt=""
              width={64}
              height={64}
              loading="lazy"
            />
            <h2>Beth Shalom</h2>
          </div>
          <nav aria-label="Footer quick links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <Link href="/" prefetch={false}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" prefetch={false}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/rooms" prefetch={false}>
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/facilities" prefetch={false}>
                  Facilities
                </Link>
              </li>
              <li>
                <Link href="/contact" prefetch={false}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2>Direct Contact</h2>
            <address>
              <p>Elakodinji, Pampady, Kottayam District, Kerala – 686502</p>
              <div>
                <a href="mailto:emilyphilipann@gmail.com">
                  emilyphilipann@gmail.com
                </a>
              </div>
              <div>
                <a href="tel:+918289838745">+91 8289838745</a>
              </div>
              <div>
                <a href="tel:+919947575762">+91 9947575762</a>
              </div>
            </address>
          </div>
          <div>
            <h2>Follow Us</h2>
            <div className="site-footer-social">
              <a
                href="https://www.facebook.com/harmonygardens.india"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.2-1.5 1.5-1.5H17V4a19 19 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 4V10H8.3v3h2.6v8z"></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/harmonygardens.india/"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></rect>
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></circle>
                  <circle cx="17.5" cy="6.5" r="1"></circle>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@harmony-gardens/shorts"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 8.1a3 3 0 0 0-2.1-2.2C18 5.4 12 5.4 12 5.4s-6 0-7.9.5A3 3 0 0 0 2 8.1 30 30 0 0 0 2 16a3 3 0 0 0 2.1 2.2c1.9.5 7.9.5 7.9.5s6 0 7.9-.5A3 3 0 0 0 22 16a30 30 0 0 0 0-7.9zM10 15V9l5.2 3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p className="site-footer-copyright">
          © 2025 Beth Shalom GMI Retirement Home. All rights reserved. PMGM
          Abhayabhavan Charitable Society.
        </p>
      </div>
    </footer>
  );
}
export function WhatsAppShortcut() {
  return (
    <a
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-space-xs bg-secondary hover:bg-primary text-on-primary py-3 px-4 rounded-full shadow-[0_10px_25px_-5px_rgba(30,58,47,0.25)] transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
      href="https://wa.me/918289838745"
      rel="noopener noreferrer"
      target="_blank"
    >
      <span
        className="material-symbols-outlined text-[24px]"
        aria-hidden="true"
      >
        chat
      </span>
      <span className="font-label-md text-label-md hidden sm:inline">
        WhatsApp Enquiry
      </span>
    </a>
  );
}
