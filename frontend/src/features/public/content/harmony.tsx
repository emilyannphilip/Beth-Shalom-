import Link from "next/link";
import { SiteImage } from "../site-image";
import { PreviewForm, PreviewFeedback } from "../preview-form";
import {
  GalleryProvider,
  GalleryModal,
  GalleryButton,
} from "../gallery-interactions";
function HarmonyBreadcrumb() {
  return (
    <section className="w-full bg-surface-container-low/70 py-4">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin flex flex-wrap items-center justify-between gap-y-2">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant"
        >
          <Link
            className="hover:text-primary transition-colors flex items-center gap-1"
            data-path="home"
            href="/"
            prefetch={false}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              home
            </span>{" "}
            <span>Home</span>
          </Link>{" "}
          <span
            className="material-symbols-outlined text-[16px] text-outline"
            aria-hidden="true"
          >
            chevron_right
          </span>{" "}
          <Link
            className="hover:text-primary transition-colors"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            Rooms
          </Link>{" "}
          <span
            className="material-symbols-outlined text-[16px] text-outline"
            aria-hidden="true"
          >
            chevron_right
          </span>{" "}
          <span className="text-primary font-semibold">Harmony Suite</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>{" "}
            Sanctioned Layout Available
          </span>{" "}
          <span className="hidden sm:inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span
              className="material-symbols-outlined text-[16px] text-secondary"
              aria-hidden="true"
            >
              verified
            </span>{" "}
            PMGM Approved Spec
          </span>
        </div>
      </div>
    </section>
  );
}

function AccommodationRibbon() {
  return (
    <section className="w-full bg-surface-container-lowest shadow-sm">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold mr-2 whitespace-nowrap hidden lg:inline">
            Categories:
          </span>{" "}
          <Link
            className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            <span>Nest Suite</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              Studio
            </span>
          </Link>{" "}
          <Link
            className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            <span>Heaven</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              Studio+
            </span>
          </Link>{" "}
          <Link
            className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            <span>Aura</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              1 Bed
            </span>
          </Link>{" "}
          <Link
            className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            <span>Vista</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              1 Bed Open
            </span>
          </Link>{" "}
          <Link
            className="px-4 py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md whitespace-nowrap shadow-sm flex items-center gap-1.5 font-bold"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            <span
              className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim"
              aria-hidden="true"
            >
              check_circle
            </span>{" "}
            <span>Harmony Suite</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface/20 text-on-primary">
              Active
            </span>
          </Link>{" "}
          <Link
            className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            <span>Grande</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
              Master
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HarmonyShowcase() {
  return (
    <section className="w-full py-space-lg lg:py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-lg">
          <div className="flex flex-col max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold tracking-wide uppercase">
                Premier Suite Living Space
              </span>{" "}
              <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  accessible
                </span>{" "}
                Full Geriatric Accessibility
              </span>{" "}
              <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">
                Floors: 1st &amp; 2nd Level
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              Harmony Suite
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 leading-relaxed">
              Expansive dual-balcony sanctuary designed for unhindered
              wheelchair mobility, serene natural cross-ventilation, and
              dignified independence with integrated 24/7 PMGM institutional
              nursing support.
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm pt-2 lg:pt-0">
            <a
              className="inline-flex items-center justify-center min-h-[52px] px-6 rounded-full bg-surface-container-highest text-primary hover:bg-surface-variant font-label-md text-label-md transition-all duration-200 gap-2"
              href="#floorplan-section"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                view_in_ar
              </span>{" "}
              <span>Inspect 3D Plan</span>
            </a>{" "}
            <a
              className="inline-flex items-center justify-center min-h-[52px] px-7 rounded-full bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md transition-all duration-200 shadow-md gap-2"
              href="#inquiry-booking"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                calendar_month
              </span>{" "}
              <span>Reserve On-Site Tour</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-6 rounded-xl bg-surface-container-lowest shadow-sm mb-space-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                bathtub
              </span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Restrooms
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold">
                2 Full Ensuites
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                deck
              </span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Outdoor Vistas
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold">
                2 Balconies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                countertops
              </span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Pantry Space
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold">
                Open Kitchenette
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                domain
              </span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Availability
              </p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold">
                4 Units Sanctioned
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md mb-space-xl">
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative w-full h-[380px] sm:h-[480px] rounded-xl overflow-hidden shadow-md group">
              <SiteImage
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-alt="Expansive interior of Harmony Suite retirement living room with solid teak furniture, warm afternoon sunlight pouring through floor-to-ceiling balcony doors opening to lush misty Kerala hillside hills, cream ceramic slip-resistant floor, comfortable senior-ergonomic sofa and dining set, lush botanical plants inside."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNe_RUr2n-Zqd-4kpvOcnJM7oYILtuBzqoLqiV7uX1j7FFdEB59c_6xQCR6enXVZK_V1D0fRj1dK52coPgxp8eZRLkP4kX_NcRcz2C-sWIXZR4K_b0X11NQTlQl2IwCrWhZoAmqeTlShYVPySu4Vro1hkp0q3QqVBw6_T27EwwyLx3cpr7WmuXvi-zTk5E2Tw1Job-W6jWuN6SGwI2XYZGGzrCw3pwNBy6Ra-a6Q"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2 inline-block">
                    Formal Living &amp; Hillside Balcony View
                  </span>
                  <p className="text-on-primary font-headline-sm text-headline-sm drop-shadow-md">
                    Generous Open-Plan Living &amp; Serene Atrium Airflow
                  </p>
                </div>
                <GalleryButton
                  className="px-4 py-2 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  type="button"
                  action="open"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    photo_library
                  </span>{" "}
                  <span>View All 8 Photos</span>
                </GalleryButton>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-space-md">
            <div className="relative w-full h-[182px] sm:h-[230px] rounded-xl overflow-hidden shadow-sm group">
              <SiteImage
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-alt="Senior-friendly European ensuite bathroom with polished stainless steel safety grab rails mounted beside toilet and shower stall, zero-threshold barrier-free walk-in shower area, emergency pull-cord alarm bell, textured anti-slip warm terracotta tiles, soft warm overhead lighting."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeymv9OMusDNnMThYDFd-5O3krMc7DGio7mTt4sDaUR8ewMNP-EURwg9A0pf5-QwGpzUYYNvRld7v5uPVLsaMUgX--0KhAMWakzXc7cDOLpHVi_-Fs2M7bWJ5E6mXz8RZiJBc3ApB_DWVweMRI2uA57nzz3ylMgXOp74jTEH8WOCED-YVTypMEoy9urFXbj4IpWtk4dgJXkNXabmV1XZbgzh-GWEYvRpGFwAXl2Q"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-on-primary">
                <p className="font-label-md text-label-md font-bold">
                  Safety Restroom (Grab Rails)
                </p>
                <p className="font-body-sm text-body-sm opacity-90">
                  Dual European ensuite setup
                </p>
              </div>
            </div>
            <div className="relative w-full h-[182px] sm:h-[230px] rounded-xl overflow-hidden shadow-sm group">
              <SiteImage
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-alt="Master bedroom in Harmony Suite with wide clearance around orthopedic twin beds, natural teak headboard, bedside nurse alert call console, direct access sliding glass door to an independent veranda overlooking coconut palms and Dayara forest landscape."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmvKaWoPdq-BQUBPDRWPLSIdLDm6T7eohWRcynUbUT7x8bj9uoiS9XBoRgHG8u6tbhXKmNgkftqqABFTS3nYcwaXEordzqybJ6z47tGvJ_Sgw5MMNaGgvxmbWtB3Cu42cO8d0R7t5tdobzThS5nbydqI-gbn57L03tJXmzXaxxRYsQxzZJm0JRyYvfBgLcOVAXmtFMlWeumn4QoPeVaVtCVSAwgooNnGKj3wnOpQ"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-on-primary">
                <p className="font-label-md text-label-md font-bold">
                  Private Bedroom &amp; Terrace
                </p>
                <p className="font-body-sm text-body-sm opacity-90">
                  Bedside emergency ward call bell
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HarmonySpecifications() {
  return (
    <section className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="max-w-3xl mb-space-lg">
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest block mb-1">
            Detailed Room Anatomy
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            Engineered for Geriatric Dignity and Total Family Peace of Mind
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Beth Shalom’s layout is meticulously vetted under PMGM Abhayabhavan
            standards to eliminate falls, accommodate broad wheelchairs, and
            ensure seamless medical caregiver access 24 hours a day.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
          <div className="p-6 md:p-8 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  apartment
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
                Architectural Highlights
              </h3>
              <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>
                    <strong>Dual Private Balconies:</strong> Cross-ventilation
                    with unblocked view of the Pampady hills.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>
                    <strong>Twin Accessible Bathrooms:</strong> Senior European
                    water closets, anti-slip flooring, and grab bars.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>
                    <strong>Dedicated Kitchenette:</strong> Fitted with granite
                    counter, induction readiness, and safe dry pantry.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>
                    <strong>Spacious Living &amp; Dining:</strong> Generous
                    floor radius to comfortably accommodate family visitors.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 bg-surface-container-low p-3 rounded-lg flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span
                className="material-symbols-outlined text-secondary text-[18px]"
                aria-hidden="true"
              >
                meeting_room
              </span>{" "}
              <span>Clear 950mm wide zero-threshold doors throughout</span>
            </div>
          </div>
          <div className="p-6 md:p-8 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center mb-4">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  health_and_safety
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
                Emergency &amp; Care Built-In
              </h3>
              <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    notifications_active
                  </span>{" "}
                  <span>
                    <strong>Nurse Call Panic Buttons:</strong> Hardwired at
                    bedside and inside both shower zones.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    wheelchair_pickup
                  </span>{" "}
                  <span>
                    <strong>Full Wheelchair Turning Circles:</strong> 1500mm
                    free turning clearance in living, bath, and bed.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    floor_lamp
                  </span>{" "}
                  <span>
                    <strong>Circadian Night Pathways:</strong> Low-glare
                    recessed floor lighting to prevent disoriented night falls.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    power
                  </span>{" "}
                  <span>
                    <strong>100% Generator Backup:</strong> Uninterrupted power
                    for oxygen concentrators and vital medical devices.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 bg-surface-container-low p-3 rounded-lg flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span
                className="material-symbols-outlined text-secondary text-[18px]"
                aria-hidden="true"
              >
                medical_services
              </span>{" "}
              <span>
                Direct wireless relay to Central On-Duty Nurse Station
              </span>
            </div>
          </div>
          <div className="p-6 md:p-8 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  room_service
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
                Comprehensive Services Included
              </h3>
              <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface">
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    restaurant
                  </span>{" "}
                  <span>
                    <strong>Nutritious Dietary Meals:</strong> Freshly prepared
                    Satvik/Kerala meals customized to diabetic profiles.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    cleaning_services
                  </span>{" "}
                  <span>
                    <strong>Housekeeping &amp; Linen Care:</strong> Daily
                    dusting, sanitized bathroom scrubbing, and laundered sheets.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    vital_signs
                  </span>{" "}
                  <span>
                    <strong>Bi-Daily Vitals Check:</strong> Blood pressure,
                    blood glucose, temperature &amp; medicine administration.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    church
                  </span>{" "}
                  <span>
                    <strong>Spiritual &amp; Wellness Sanctuary:</strong>{" "}
                    On-campus Chapel, Dayara prayer access, and botanical walks.
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 bg-surface-container-low p-3 rounded-lg flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span
                className="material-symbols-outlined text-secondary text-[18px]"
                aria-hidden="true"
              >
                favorite
              </span>{" "}
              <span>
                Supported living assistance for differently abled dependents
              </span>
            </div>
          </div>
        </div>
        <div className="w-full p-5 rounded-xl bg-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-secondary text-[24px] mt-0.5"
              aria-hidden="true"
            >
              info
            </span>
            <div className="text-on-surface">
              <p className="font-label-md text-label-md font-bold">
                Sanctioned Floor Plans &amp; Non-Profit Contribution Policy
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Room dimensions strictly comply with the sanctioned
                architectural plan under PMGM Abhayabhavan Charitable Society
                (Reg. No. K. 20 of 1967). In accordance with institutional
                bylaws, admission fees and maintenance contributions are shared
                transparently following personalized medical &amp; care
                evaluation.
              </p>
            </div>
          </div>
          <a
            className="whitespace-nowrap px-4 py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container font-label-sm text-label-sm font-bold transition-colors"
            href="#inquiry-booking"
          >
            Request Breakdown
          </a>
        </div>
      </div>
    </section>
  );
}

function HarmonyFloorPlan() {
  return (
    <section className="w-full py-space-xl bg-surface" id="floorplan-section">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col lg:flex-row items-center gap-space-lg">
          <div className="w-full lg:w-7/12">
            <div className="p-6 md:p-8 rounded-xl bg-surface-container-lowest shadow-md flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 bg-surface-container-low/50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary"
                    aria-hidden="true"
                  >
                    architecture
                  </span>{" "}
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    Suite Room #204 Blueprint Preview
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  Approved Plan
                </span>
              </div>
              <div className="relative w-full h-[320px] sm:h-[400px] rounded-lg overflow-hidden bg-surface-container flex items-center justify-center">
                <SiteImage
                  className="w-full h-full object-contain p-2"
                  data-alt="High precision top-down architectural colored floor plan rendering of the Harmony Suite showing two complete balconies, master bedroom with orthopedic twin beds, open living room with dining table, kitchenette corner, two wheelchair accessible full bathrooms, labeled dimensions and turning radius in muted architectural tones."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOsYf7uXG4FtA4cVNyPgtlBx3i5ntU6mapNSyNjs0M52zR44RH2LDCY7tAWPH6drl5nmZmIf5snxhzDgBkSqF0leSbEhmZVrTpk2bMmUqYrd_rA_iIHTghFPDnlOXhJ5zp_-uvYgzL_C6Y95wfgB3KUAiJUrEU4LIcfGgriiV6SOk1UmM5GpXT7iVFkyw8h64a_vIXVFFDbMPqacumffLOjXFwHD9n8je_8rXrnA"
                  alt=""
                />
                <div className="absolute top-[28%] left-[24%]">
                  <div className="relative group">
                    <span className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold shadow-md cursor-pointer animate-bounce">
                      1
                    </span>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-inverse-surface text-inverse-on-surface rounded shadow-xl font-label-sm text-label-sm z-20 pointer-events-none">
                      <strong>Master Bedroom:</strong> 16ft x 14ft with bedside
                      nurse alarm &amp; terrace access.
                    </div>
                  </div>
                </div>
                <div className="absolute top-[65%] left-[32%]">
                  <div className="relative group">
                    <span className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold shadow-md cursor-pointer">
                      2
                    </span>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-inverse-surface text-inverse-on-surface rounded shadow-xl font-label-sm text-label-sm z-20 pointer-events-none">
                      <strong>Accessible Ensuites:</strong> Grab rails, seated
                      shower &amp; anti-fall gradient floor.
                    </div>
                  </div>
                </div>
                <div className="absolute top-[40%] right-[30%]">
                  <div className="relative group">
                    <span className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold shadow-md cursor-pointer">
                      3
                    </span>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-inverse-surface text-inverse-on-surface rounded shadow-xl font-label-sm text-label-sm z-20 pointer-events-none">
                      <strong>Dual Balconies:</strong> Morning and afternoon
                      shade verandas.
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 text-center font-label-sm text-label-sm text-on-surface-variant">
                <span className="flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                  1: Master Suite
                </span>{" "}
                <span className="flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                  2: Safety Restrooms
                </span>{" "}
                <span className="flex items-center justify-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                  3: Private Balconies
                </span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-5/12 flex flex-col">
            <div className="p-8 rounded-xl bg-primary text-on-primary shadow-lg flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-surface-container/20 text-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider mb-4 inline-block">
                  Interactive Space Inspection
                </span>
                <h3 className="font-headline-lg text-headline-lg font-bold mb-3 leading-tight">
                  Walk through the Harmony Suite in 3D
                </h3>
                <p className="font-body-md text-body-md text-surface-container mb-6 leading-relaxed">
                  Test clearances, verify wheelchair turning arcs, evaluate
                  panoramic hillside sightlines, and explore how customized
                  furniture accommodates assistive devices before visiting in
                  person.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        straighten
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-surface-container">
                      True-to-Scale Sanctioned 3D Models
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        light_mode
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-surface-container">
                      Daylight &amp; Shading Simulation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        accessible_forward
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-surface-container">
                      Motorized &amp; Manual Wheelchair Clearance Check
                    </span>
                  </div>
                </div>
              </div>
              <Link
                className="w-full min-h-[52px] px-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim font-label-md text-label-md font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                data-path="interactive-3d-plan"
                href="/rooms/visualizer"
                prefetch={false}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                <span>Launch Interactive 3D Room Visualizer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CampusAmenities() {
  return (
    <section className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="text-center max-w-3xl mx-auto mb-space-lg">
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest block mb-1">
            Life Beyond the Suite
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            Holistic Care Grounded in Faith, Dignity, and Nature
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Residents of the Harmony Suite enjoy unrestricted access to the
            entire Beth Shalom sanctuary campus at Mar Kuriakose Dayara,
            Pampady.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span
                className="material-symbols-outlined text-[28px]"
                aria-hidden="true"
              >
                church
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-2">
              Consecrated Chapel
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Daily liturgical prayer and quiet reflection in the tradition of
              blessed Pampady Thirumeni.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span
                className="material-symbols-outlined text-[28px]"
                aria-hidden="true"
              >
                park
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-2">
              Botanical Courtyard
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Lush green atriums, level sensory walking paths, and peaceful
              shade under indigenous Kerala trees.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span
                className="material-symbols-outlined text-[28px]"
                aria-hidden="true"
              >
                fitness_center
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-2">
              Therapy &amp; Senior Gym
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Physiotherapy facilities, low-impact exercise machines, and
              trained physical rehabilitation guides.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span
                className="material-symbols-outlined text-[28px]"
                aria-hidden="true"
              >
                local_pharmacy
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-primary mb-2">
              Physician On-Call
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Regular clinical visits, immediate emergency ambulance tie-up with
              nearby tertiary care hospitals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HarmonyEnquiry() {
  return (
    <section className="w-full py-space-xl bg-surface" id="inquiry-booking">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          <div className="lg:col-span-5 p-8 rounded-xl bg-primary-container text-on-primary flex flex-col justify-between shadow-lg">
            <div>
              <span className="px-3 py-1 rounded-full bg-surface-container/20 text-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider mb-4 inline-block">
                Priority Consultation
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold mb-4">
                Interested in the Harmony Suite for your family?
              </h2>
              <p className="font-body-md text-body-md text-surface-container mb-6 leading-relaxed">
                Our compassionate admissions team evaluates the specific
                mobility, medical, and emotional needs of every prospective
                resident and dependent. We warmly invite you for a guided
                sanctuary tour.
              </p>
              <div className="flex flex-col gap-4 py-4 mb-6">
                <a
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface/10 hover:bg-surface/20 transition-colors"
                  href="tel:+918289838745"
                >
                  <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-primary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      call
                    </span>
                  </span>
                  <div>
                    <p className="font-label-sm text-label-sm opacity-80">
                      Primary Admission Desk
                    </p>
                    <p className="font-label-lg text-label-lg font-bold">
                      +91 8289838745
                    </p>
                  </div>
                </a>{" "}
                <a
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface/10 hover:bg-surface/20 transition-colors"
                  href="tel:+919947575762"
                >
                  <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-primary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      call
                    </span>
                  </span>
                  <div>
                    <p className="font-label-sm text-label-sm opacity-80">
                      Alternate / Caregiver Helpline
                    </p>
                    <p className="font-label-lg text-label-lg font-bold">
                      +91 9947575762
                    </p>
                  </div>
                </a>
              </div>
            </div>
            <div className="bg-surface/10 p-4 rounded-lg flex items-start gap-3">
              <span
                className="material-symbols-outlined text-tertiary-fixed text-[22px] shrink-0"
                aria-hidden="true"
              >
                pin_drop
              </span>
              <div className="font-body-sm text-body-sm text-surface-container">
                <strong className="text-on-primary block font-label-md">
                  Location:
                </strong>{" "}
                Elakodinji, Pampady, Kottayam District, Kerala - 686502 (PMGM
                Abhayabhavan Charitable Society)
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 p-8 rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
            <PreviewForm className="flex flex-col gap-5" id="suiteInquiryForm">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                  Schedule an On-Site Tour or Receive Admissions Pack
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  We will contact you within 24 business hours to address care
                  requisites and availability.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-semibold"
                    htmlFor="applicantName"
                  >
                    Your Full Name
                  </label>
                  <input
                    className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary"
                    id="applicantName"
                    placeholder="e.g., Joseph Varghese"
                    required
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-semibold"
                    htmlFor="applicantPhone"
                  >
                    Contact Phone Number
                  </label>
                  <input
                    className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary"
                    id="applicantPhone"
                    placeholder="+91 98470 00000"
                    required
                    type="tel"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-semibold"
                    htmlFor="applicantEmail"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary"
                    id="applicantEmail"
                    placeholder="name@domain.com"
                    required
                    type="email"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-semibold"
                    htmlFor="selectedCategory"
                  >
                    Selected Accommodation
                  </label>
                  <select
                    className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary font-medium"
                    id="selectedCategory"
                    defaultValue="harmony"
                  >
                    <option value="harmony">
                      Harmony Suite (Suite Living Space - 2 Balconies)
                    </option>
                    <option value="nest">Nest (Studio - Single Living)</option>
                    <option value="heaven">
                      Heaven (Studio+ - Serene Living)
                    </option>
                    <option value="aura">Aura (1 Bed Living Space)</option>
                    <option value="vista">
                      Vista (1 Bed Functional Open Layout)
                    </option>
                    <option value="grande">
                      Grande (Premium Living Suite - Master)
                    </option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-semibold"
                    htmlFor="careRequirement"
                  >
                    Primary Care Need
                  </label>
                  <select
                    className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary font-medium"
                    id="careRequirement"
                  >
                    <option>Independent Senior Retirement</option>
                    <option>Assisted Senior Living (Mobility Support)</option>
                    <option>
                      Supportive Living for Differently-Abled Child &amp; Parent
                    </option>
                    <option>Post-Operative Recovery / Short Stay</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-sm text-label-sm text-on-surface font-semibold"
                    htmlFor="tourDate"
                  >
                    Preferred On-Site Visit Date
                  </label>
                  <input
                    className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary"
                    id="tourDate"
                    type="date"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-sm text-label-sm text-on-surface font-semibold"
                  htmlFor="additionalNotes"
                >
                  Special Medical or Dietary Considerations
                </label>
                <textarea
                  className="w-full p-4 rounded-lg bg-surface-container-low text-on-surface font-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                  id="additionalNotes"
                  placeholder="Please specify if wheelchair assistance, diabetic diets, or specific medical devices are used..."
                  rows={3}
                ></textarea>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <input
                  className="w-5 h-5 rounded text-secondary focus:ring-secondary mt-0.5"
                  id="consent"
                  required
                  type="checkbox"
                />
                <label
                  className="font-body-sm text-body-sm text-on-surface-variant"
                  htmlFor="consent"
                >
                  I agree to be contacted by PMGM Abhayabhavan Society
                  representatives regarding room allocation and institutional
                  policies.
                </label>
              </div>
              <button
                className="w-full min-h-[52px] px-6 rounded-full bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 mt-2"
                type="submit"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  send
                </span>{" "}
                <span>Submit Admission Inquiry for Harmony Suite</span>
              </button>
              <PreviewFeedback
                className="p-4 rounded-lg bg-secondary-container text-on-secondary-container flex items-center gap-3"
                id="success-feedback"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  info
                </span>
                <span>
                  Preview complete. Your details were not sent or saved.
                </span>
              </PreviewFeedback>
            </PreviewForm>
          </div>
        </div>
      </div>
    </section>
  );
}

function OtherAccommodation() {
  return (
    <section className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest block mb-1">
              Compare Living Spaces
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
              Other Accommodation Categories
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Carefully curated configurations suited to independent singles,
              couples, and assisted wards.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-1 text-secondary hover:text-primary font-label-md text-label-md font-semibold transition-colors"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            <span>View All 6 Living Models</span>{" "}
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-space-md">
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                  Studio
                </span>{" "}
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  3rd Floor
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                Nest
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Cozy and thoughtfully designed for peaceful, independent living.
              </p>
              <div className="font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-1.5 pb-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Bath with Toilet
                </span>{" "}
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Scenic Balcony
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                16 Units Built
              </span>{" "}
              <Link
                className="text-secondary hover:text-primary font-label-sm text-label-sm font-bold"
                data-path="rooms"
                href="/rooms"
                prefetch={false}
              >
                Details →
              </Link>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                  Studio+
                </span>{" "}
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  2nd Floor
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                Heaven
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                A bright, airy retreat balancing modern comforts with serene
                surroundings.
              </p>
              <div className="font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-1.5 pb-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Balcony &amp; Open Kitchen
                </span>{" "}
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Bath with Toilet
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                4 Units Built
              </span>{" "}
              <Link
                className="text-secondary hover:text-primary font-label-sm text-label-sm font-bold"
                data-path="rooms"
                href="/rooms"
                prefetch={false}
              >
                Details →
              </Link>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                  1 Bed
                </span>{" "}
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  1st &amp; 2nd Floor
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                Aura
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Dedicated room separations create a truly homely atmosphere.
              </p>
              <div className="font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-1.5 pb-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Bedroom &amp; Balcony
                </span>{" "}
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Kitchen &amp; Living Area
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                2 Units Built
              </span>{" "}
              <Link
                className="text-secondary hover:text-primary font-label-sm text-label-sm font-bold"
                data-path="rooms"
                href="/rooms"
                prefetch={false}
              >
                Details →
              </Link>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                  1 Bed Open
                </span>{" "}
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  1st Floor
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                Vista
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                A complete and highly functional layout with beautiful open
                views.
              </p>
              <div className="font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-1.5 pb-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Bedroom &amp; Bath Toilet
                </span>{" "}
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Balcony &amp; Open Kitchen
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                4 Units Built
              </span>{" "}
              <Link
                className="text-secondary hover:text-primary font-label-sm text-label-sm font-bold"
                data-path="rooms"
                href="/rooms"
                prefetch={false}
              >
                Details →
              </Link>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                  Premium
                </span>{" "}
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  1st Floor
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                Grande
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Our crown jewel — the most spacious and refined offering in the
                home.
              </p>
              <div className="font-label-sm text-label-sm text-on-surface-variant flex flex-col gap-1.5 pb-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  Living Area &amp; Open Kitchen
                </span>{" "}
                <span className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                  2 Baths with Toilets
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                2 Units Built
              </span>{" "}
              <Link
                className="text-secondary hover:text-primary font-label-sm text-label-sm font-bold"
                data-path="rooms"
                href="/rooms"
                prefetch={false}
              >
                Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoArchive() {
  return (
    <GalleryModal
      className="fixed inset-0 z-50 bg-inverse-surface/80 backdrop-blur-sm flex items-center justify-center p-4"
      id="gallery-modal"
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-4xl w-full p-6 shadow-2xl max-h-[921px] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/20">
          <div>
            <h3
              className="font-headline-sm text-headline-sm text-primary"
              id="gallery-title"
            >
              Harmony Suite Visual Archive
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              High-resolution views of architectural execution and senior
              furnishings
            </p>
          </div>
          <GalleryButton
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            type="button"
            action="close"
            aria-label="Close photo archive"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              aria-hidden="true"
            >
              close
            </span>
          </GalleryButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden h-60">
            <SiteImage
              className="w-full h-full object-cover"
              data-alt="Harmony suite spacious sunny veranda facing the lush green hills of Pampady Kerala with cane patio chairs and potted blooming jasmine plants."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt2UYdSblkDtZU0vReM1Zaz8Pjgm56XH5yia9-ZNYKfxYl2qSAB9wJQ6z9mFq2yRG6bFMYt6d_y6rUo4-p7R1HmCx3aTB8i7_5cncKYwjlBOm3ZwbGCOsUQpbuI0SLlxyzUP9dycvBKZsa3ohsMhqpQ9pBXhEdyWew1rZs8wxF09SGtSYsi3JFWnSIeRd6cIwmktRjmehFHm6AqclqCbi9ACWMgq_v9dmg_nkENw"
              alt=""
            />
          </div>
          <div className="rounded-lg overflow-hidden h-60">
            <SiteImage
              className="w-full h-full object-cover"
              data-alt="Open plan kitchenette inside Harmony suite featuring granite countertop, induction cooker, microwave, polished upper cabinets, and senior-height reachable storage."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSfpOmKMcHp0WAM0QTjtUmcTN7YTMdQfSwUWwOGGTXwXINW03_Fwf1o2EDfvzBfKHpGA0tVeg45kEgp7vxeHyKVmYKMi04sZdZuGwG1cOq951SoYSV2x_ByBiz2OfGrvuZ3x9rI7RbdEPGAppPQIdgdA2HsfXKBff4K0Ys1eM7mSpDQ4om_v3EKVKz1iReDnkczDZXn9xC3Ros8kIQnwKE_SqzuS4h0Laj_Xjs5A"
              alt=""
            />
          </div>
          <div className="rounded-lg overflow-hidden h-60">
            <SiteImage
              className="w-full h-full object-cover"
              data-alt="Senior twin bedroom setup with emergency bedside push cord, soft indirect warm lighting, reading lamp, and large window overlooking misty forest valley."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8hwgLKezSjvGfrulFQzbSxoxhj8umN3d696WV5YiCPkMNfXCebAUNyhajudHkKUOpNJSMwgkz8bdBQ79NsPhDtte8uLvZfuoCepTxfba0VgzHVk571aH-V6eQ-ibyu6UTsffrFHGYpaPXnSNtcU05vZ8TRxyIiXsu56rIvtOygQ25Oq02GGlGrmSizKDqv12E2_pRYiBXPq0rk-QaKSMx3s0uGr1dam7K2UoXMQ"
              alt=""
            />
          </div>
          <div className="rounded-lg overflow-hidden h-60">
            <SiteImage
              className="w-full h-full object-cover"
              data-alt="Close up view of the European senior toilet in Harmony suite with stainless steel support arms, non-skid floor tiles, and walk-in zero transition shower floor."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxKTDO2SFGiSrqjX7UY8jRVMgggX06KgHGGjCuzDx5AhfMi4DI9X8gWG72ExXIDTHzDCb4sHrZTZz2_pzJ2myVn9UF7i8scpvKmnqUPco1Mu_1WbDAgX1SxzfwUoN0llhcNQ8wZcrx9F-6HwhXBTtXRTp8Cm7JpyXrxof4u6EiI2v4_5OrRHK7dy83XUXHhshXH8pUEMZVvgypMSsM-WMPg0k3wyJC9QRt8QnF1g"
              alt=""
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <GalleryButton
            className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold"
            type="button"
            action="close"
          >
            Close Archive
          </GalleryButton>
        </div>
      </div>
    </GalleryModal>
  );
}
export function HarmonyContent() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full">
        <GalleryProvider>
          <HarmonyBreadcrumb />
          <AccommodationRibbon />
          <HarmonyShowcase />
          <HarmonySpecifications />
          <HarmonyFloorPlan />
          <CampusAmenities />
          <HarmonyEnquiry />
          <OtherAccommodation />
          <PhotoArchive />
        </GalleryProvider>
      </div>
    </main>
  );
}
