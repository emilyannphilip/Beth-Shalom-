import Link from "next/link";
import { PreviewForm, PreviewFeedback, PreviewAction } from "../preview-form";
function ContactIntro() {
  return (
    <section className="relative w-full bg-surface-container-low py-space-xl px-margin-mobile md:px-margin overflow-hidden">
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant"
          >
            <Link
              className="hover:text-primary transition-colors flex items-center gap-1"
              data-path="home-landing-page"
              href="/"
              prefetch={false}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                home
              </span>{" "}
              Home
            </Link>{" "}
            <span className="text-outline-variant font-medium">/</span>{" "}
            <span className="text-primary font-semibold">
              Contact &amp; Directions
            </span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full shadow-sm">
            <span
              className="material-symbols-outlined text-[16px] text-secondary"
              aria-hidden="true"
            >
              verified
            </span>{" "}
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              PMGM Abhayabhavan Charitable Society | Diocese of Kottayam
            </span>
          </div>
        </div>
        <div className="max-w-4xl">
          <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold block mb-2">
            Plan Your Visit &amp; Inquiry
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-space-sm leading-tight">
            Get in Touch &amp; Plan Your Visit to Beth Shalom
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Located in the tranquil hills of Elakodinji, Pampady. Whether you
            are inquiring about admissions for your loved ones, seeking
            spiritual peace, or planning an accompanied campus tour, our
            administrative and care counseling team is here to assist you with
            unhurried hospitality.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactOptions() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin -mt-8 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center mb-space-sm">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                call
              </span>
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-secondary font-bold">
              Primary Contact
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary mt-1 mb-2">
              Admissions Helpline
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              General admissions, room consultation, fee structure &amp;
              administrative secretary.
            </p>
            <div className="bg-surface-container-low p-2.5 rounded-lg mb-space-sm">
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  schedule
                </span>{" "}
                <span>Mon – Sat: 9:00 AM – 5:30 PM IST</span>
              </div>
            </div>
          </div>
          <a
            className="inline-flex items-center justify-center min-h-[52px] w-full px-4 py-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors focus:ring-4 focus:ring-tertiary-fixed-dim"
            href="tel:+918289838745"
          >
            <span
              className="material-symbols-outlined mr-2 text-[20px]"
              aria-hidden="true"
            >
              phone_in_talk
            </span>{" "}
            Call +91 8289838745
          </a>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 rounded-xl bg-secondary text-on-primary flex items-center justify-center mb-space-sm">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                health_and_safety
              </span>
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-secondary font-bold">
              24/7 Helpline
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary mt-1 mb-2">
              Care Coordinator
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Clinical requisites, geriatric assessment, emergency intake &amp;
              resident support.
            </p>
            <div className="bg-surface-container-low p-2.5 rounded-lg mb-space-sm">
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  emergency
                </span>{" "}
                <span className="font-bold text-secondary">
                  24/7 Emergency Care Desk
                </span>
              </div>
            </div>
          </div>
          <a
            className="inline-flex items-center justify-center min-h-[52px] w-full px-4 py-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-on-secondary-fixed-variant transition-colors focus:ring-4 focus:ring-tertiary-fixed-dim"
            href="tel:+919947575762"
          >
            <span
              className="material-symbols-outlined mr-2 text-[20px]"
              aria-hidden="true"
            >
              phone_enabled
            </span>{" "}
            Call +91 9947575762
          </a>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center mb-space-sm">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                mail
              </span>
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-secondary font-bold">
              Written Inquiries
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary mt-1 mb-2">
              Electronic Mail
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Official records review, foreign correspondence, and societal
              governance queries.
            </p>
            <div className="bg-surface-container-low p-2.5 rounded-lg mb-space-sm">
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  timer
                </span>{" "}
                <span>Response: 24–48 Business Hours</span>
              </div>
            </div>
          </div>
          <a
            className="inline-flex items-center justify-center min-h-[52px] w-full px-4 py-3 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors focus:ring-4 focus:ring-tertiary-fixed-dim"
            href="mailto:emilyphilipann@gmail.com"
          >
            <span
              className="material-symbols-outlined mr-2 text-[20px]"
              aria-hidden="true"
            >
              send
            </span>{" "}
            Email Us Directly
          </a>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center mb-space-sm">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                chat
              </span>
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-secondary font-bold">
              Direct Messaging
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary mt-1 mb-2">
              WhatsApp Channel
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Instant digital brochures, floor visualizer plans, live video
              tours &amp; NRI calls.
            </p>
            <div className="bg-surface-container-low p-2.5 rounded-lg mb-space-sm">
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  mark_chat_read
                </span>{" "}
                <span>Instant Location Pin Available</span>
              </div>
            </div>
          </div>
          <a
            className="inline-flex items-center justify-center min-h-[52px] w-full px-4 py-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-primary transition-colors focus:ring-4 focus:ring-tertiary-fixed-dim"
            href="https://wa.me/918289838745?text=Hello%20Beth%20Shalom%2C%20I%20would%20like%20to%20inquire%20about%20admissions%20and%20schedule%20a%20visit."
            rel="noopener noreferrer"
            target="_blank"
          >
            <span
              className="material-symbols-outlined mr-2 text-[20px]"
              aria-hidden="true"
            >
              forum
            </span>{" "}
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function DirectionsAndMap() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold mb-2">
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                location_on
              </span>{" "}
              Official Address &amp; Sanctuary Premise
            </div>
            <h2 className="font-headline-md text-headline-md text-primary mb-3">
              Beth Shalom GMI Retirement Home
            </h2>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed mb-4">
              Elakodinji, Pampady, Kottayam District,
              <br />
              Kerala, India – 686502
            </p>
            <div className="p-3 bg-surface-container-low rounded-lg text-on-surface-variant font-body-sm text-body-sm flex items-start gap-2.5">
              <span
                className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5"
                aria-hidden="true"
              >
                church
              </span>
              <div>
                <span className="font-bold text-primary block">
                  Sanctuary of Peace
                </span>{" "}
                Functioning under PMGM Abhayabhavan Charitable Society (Reg. No.
                K.20/1967) and under the spiritual blessings of Mar Kuriakose
                Dayara, Diocese of Kottayam.
              </div>
            </div>
          </div>
          <div className="bg-surface-container rounded-xl p-space-md shadow-sm">
            <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase font-bold mb-2">
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                event_available
              </span>{" "}
              Visitor Guidelines &amp; Walkthrough Hours
            </div>
            <div className="space-y-3 font-body-sm text-body-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/30">
                <span className="text-on-surface font-medium">
                  Monday to Saturday
                </span>{" "}
                <span className="font-semibold text-primary">
                  9:00 AM – 5:30 PM
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/30">
                <span className="text-on-surface font-medium">
                  Sundays &amp; Feast Days
                </span>{" "}
                <span className="font-semibold text-primary">
                  11:30 AM – 5:00 PM
                </span>
              </div>
              <p className="text-on-surface-variant font-label-sm text-label-sm italic pt-1">
                *Sunday visits are scheduled following morning Holy Qurbana at
                the Dayara Chapel. Prior appointment recommended so our care
                counselors can give you undivided attention.
              </p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-primary">
              How to Reach Us
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-secondary">
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden="true"
                >
                  directions_car
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-label-md text-label-md text-primary font-bold">
                  By Road (Kottayam–Kumily KK Road)
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Take the KK Road to Pampady 16th Mile Junction. Turn toward
                  Elakodinji Hilltop road (approx. 4.5 km gentle scenic climb).
                  Ample senior-accessible parking on-site.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-secondary">
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden="true"
                >
                  train
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-label-md text-label-md text-primary font-bold">
                  By Rail (Kottayam Railway Station - KTYM)
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Approximately 20 km (35–45 minutes drive). Taxis, pre-paid
                  autos, and fast-passenger KSRTC buses are frequently available
                  directly to Pampady.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-secondary">
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden="true"
                >
                  flight
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-label-md text-label-md text-primary font-bold">
                  By Air (Nearest Airports)
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Cochin International Airport (COK) is 95 km away (~2.5 hours
                  via MC Road). Trivandrum Airport (TRV) is 150 km (~4 hours).
                  Direct chauffeured pick-up can be arranged upon prior request.
                </p>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm hover:bg-primary transition-colors"
                href="https://maps.google.com/?q=Elakodinji+Pampady+Kottayam+Beth+Shalom"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  near_me
                </span>{" "}
                Open in Google Maps
              </a>
              <PreviewAction
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-sm text-label-sm transition-colors"
                type="button"
                message="Directions PDF is not available in this preview. Use the Google Maps directions link for route information."
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  download
                </span>{" "}
                Directions PDF
              </PreviewAction>
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-secondary font-label-sm text-label-sm transition-colors"
                href="https://wa.me/?text=Here%20is%20the%20location%20and%20directions%20for%20Beth%20Shalom%20GMI%20Retirement%20Home%2C%20Elakodinji%2C%20Pampady%3A%20https%3A%2F%2Fmaps.google.com%2F%3Fq%3DElakodinji%2BPampady"
                target="_blank"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  share
                </span>{" "}
                Share via WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden flex flex-col h-full min-h-[540px]">
            <div className="bg-surface-container-high px-space-md py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>{" "}
                <span className="font-label-md text-label-md font-bold text-primary">
                  Interactive Sanctuary Geo-Locator
                </span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1 rounded-full text-secondary font-label-sm text-label-sm font-semibold shadow-sm">
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  landscape
                </span>{" "}
                High-Altitude Clean Air Sanctuary
              </div>
            </div>
            <div className="relative flex-1 w-full bg-surface-dim overflow-hidden min-h-[440px]">
              <div
                className="w-full h-full bg-cover bg-center relative"
                data-location="Pampady, Kottayam, Kerala"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAa6KQcAFUstdhrBaG2hfcUKt6sVxmQClkGhBbLlo-s34tLIddKr2iHXXSSWGy7biFtZZDjTwyPq30_cXP6ZPXNGR7stv_yNhB8Grqcv6-qLNmMHVtGkD7ia3iwy-j6dI7MbDszJxZlGbxo0Y_V0TSFqUGmJ5GT1znz1PApcJ9Gz-uPN1NhldID4sJKlDwEjNUaqTmdUHPnce6v-Z03v6rlmO4FfD4IeSEluc3zWQ')",
                }}
              >
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="bg-primary text-on-primary px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 border border-primary-fixed mb-1 animate-bounce">
                    <span
                      className="material-symbols-outlined text-secondary-fixed text-[18px]"
                      aria-hidden="true"
                    >
                      nest_multi_room
                    </span>{" "}
                    <span className="font-label-sm text-label-sm font-bold tracking-wide">
                      Beth Shalom Campus
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg ring-4 ring-white">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      villa
                    </span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-primary rotate-45 -mt-1 shadow-md"></div>
                </div>
                <div className="absolute top-[28%] left-[34%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-surface-container-lowest/95 px-2.5 py-1 rounded-lg shadow-md">
                  <span
                    className="material-symbols-outlined text-tertiary-container text-[16px]"
                    aria-hidden="true"
                  >
                    church
                  </span>{" "}
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">
                    Mar Kuriakose Dayara (3.5 km)
                  </span>
                </div>
                <div className="absolute bottom-[24%] left-[28%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-surface-container-lowest/95 px-2.5 py-1 rounded-lg shadow-md">
                  <span
                    className="material-symbols-outlined text-primary text-[16px]"
                    aria-hidden="true"
                  >
                    add_road
                  </span>{" "}
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">
                    Pampady Town &amp; KK Road (4.5 km)
                  </span>
                </div>
                <div className="absolute bottom-[18%] right-[22%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-surface-container-lowest/95 px-2.5 py-1 rounded-lg shadow-md">
                  <span
                    className="material-symbols-outlined text-error text-[16px]"
                    aria-hidden="true"
                  >
                    local_hospital
                  </span>{" "}
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">
                    Kottayam Medical Hub (20 km)
                  </span>
                </div>
                <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
                  <PreviewAction
                    aria-label="Zoom In"
                    className="w-11 h-11 rounded-lg bg-surface-container-lowest text-primary shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
                    type="button"
                    message="Zooming closer into Elakodinji Hilltop Campus map..."
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      add
                    </span>
                  </PreviewAction>
                  <PreviewAction
                    aria-label="Zoom Out"
                    className="w-11 h-11 rounded-lg bg-surface-container-lowest text-primary shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
                    type="button"
                    message="Zooming out to view Kottayam District overview..."
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      remove
                    </span>
                  </PreviewAction>
                  <PreviewAction
                    aria-label="Recenter Map"
                    className="w-11 h-11 rounded-lg bg-surface-container-lowest text-secondary shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
                    type="button"
                    message="Map centered on Beth Shalom GMI Retirement Home, Elakodinji, Pampady (Elevation: 210m)."
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      my_location
                    </span>
                  </PreviewAction>
                </div>
                <div className="absolute left-4 bottom-4 z-20 bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-lg shadow-md max-w-xs text-xs">
                  <span className="font-bold text-primary block mb-1.5 font-label-sm">
                    Topography &amp; Proximity
                  </span>
                  <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-on-surface-variant font-body-sm">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>{" "}
                      Residence
                    </span>{" "}
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                      Lush Canopy
                    </span>{" "}
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-error"></span>{" "}
                      Clinics
                    </span>{" "}
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>{" "}
                      Dayara Chapel
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container p-space-sm flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  gps_fixed
                </span>{" "}
                <span>
                  GPS: 9.5892° N, 76.6436° E | Elevation: 210m Above Sea Level
                </span>
              </div>
              <a
                className="font-label-sm text-label-sm text-secondary hover:text-primary font-bold flex items-center gap-1"
                href="https://maps.google.com/?q=Beth+Shalom+GMI+Retirement+Home+Elakodinji+Pampady"
                rel="noopener noreferrer"
                target="_blank"
              >
                Start Turn-by-Turn Navigation{" "}
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CampusWalkthrough() {
  return (
    <section className="w-full bg-surface-container-low py-space-xl px-margin-mobile md:px-margin">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-md">
          <div className="mb-space-md">
            <div className="inline-flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider mb-1">
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden="true"
              >
                calendar_month
              </span>{" "}
              Complimentary Campus Visit
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Schedule an Accompanied Walkthrough
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Experience the soothing atmosphere, view our living suites (Nest,
              Heaven, Aura, Vista, Harmony, Grande), visit the chapel, and
              discuss personalized care plans with our senior welfare officers.
            </p>
          </div>
          <PreviewForm
            className="space-y-space-md"
            id="visitInquiryForm"
            resetAfterValidation
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md font-bold text-primary"
                  htmlFor="fullName"
                >
                  Full Name of Inquirer / Guardian{" "}
                  <span className="text-error">*</span>
                </label>
                <input
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface font-body-md text-body-md text-on-surface border-0 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm"
                  id="fullName"
                  name="fullName"
                  placeholder="e.g. Thomas Mathew"
                  required
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md font-bold text-primary"
                  htmlFor="phoneNumber"
                >
                  Phone / WhatsApp Number <span className="text-error">*</span>
                </label>
                <input
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface font-body-md text-body-md text-on-surface border-0 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+91 98765 43210"
                  required
                  type="tel"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md font-bold text-primary"
                  htmlFor="emailAddress"
                >
                  Email Address
                </label>
                <input
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface font-body-md text-body-md text-on-surface border-0 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md font-bold text-primary"
                  htmlFor="visitPurpose"
                >
                  Purpose of Visit <span className="text-error">*</span>
                </label>
                <select
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface font-body-md text-body-md text-on-surface border-0 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                  id="visitPurpose"
                  name="visitPurpose"
                  required
                >
                  <option value="admission-consultation">
                    Senior Admission &amp; Living Spaces Tour
                  </option>
                  <option value="differently-abled">
                    Differently-Abled Supportive Living Care
                  </option>
                  <option value="suite-visualizer">
                    Detailed Suite &amp; Floor Plan Inspection
                  </option>
                  <option value="spiritual-dayara">
                    Spiritual Retreat &amp; Chapel Prayer Visit
                  </option>
                  <option value="general-inquiry">
                    General Institutional Walkthrough
                  </option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md font-bold text-primary"
                  htmlFor="visitDate"
                >
                  Preferred Visit Date <span className="text-error">*</span>
                </label>
                <input
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface font-body-md text-body-md text-on-surface border-0 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm"
                  id="visitDate"
                  name="visitDate"
                  required
                  type="date"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-label-md text-label-md font-bold text-primary"
                  htmlFor="visitSlot"
                >
                  Preferred Time Slot <span className="text-error">*</span>
                </label>
                <select
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface font-body-md text-body-md text-on-surface border-0 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                  id="visitSlot"
                  name="visitSlot"
                  required
                >
                  <option value="morning">Morning (10:00 AM – 12:30 PM)</option>
                  <option value="afternoon">
                    Afternoon (02:00 PM – 04:00 PM)
                  </option>
                  <option value="evening">
                    Late Afternoon (04:00 PM – 05:30 PM)
                  </option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                className="font-label-md text-label-md font-bold text-primary"
                htmlFor="specialNeeds"
              >
                Notes or Accessibility Assistance Required (Optional)
              </label>
              <textarea
                className="w-full p-4 rounded-lg bg-surface font-body-md text-body-md text-on-surface border-0 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm"
                id="specialNeeds"
                name="specialNeeds"
                placeholder="e.g. Wheelchair assistance required upon arrival, dietary queries, special care review..."
                rows={3}
              ></textarea>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg">
              <input
                className="w-6 h-6 mt-0.5 rounded text-primary focus:ring-tertiary-fixed-dim shrink-0 cursor-pointer"
                id="consentAgree"
                name="consentAgree"
                required
                type="checkbox"
              />
              <label
                className="font-body-sm text-body-sm text-on-surface leading-snug cursor-pointer"
                htmlFor="consentAgree"
              >
                I agree to be contacted by PMGM Abhayabhavan Charitable Society
                regarding this campus walkthrough. No commercial consultation
                fees or booking deposits are charged.
              </label>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-2">
              <button
                className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all duration-200 shadow-md focus:ring-4 focus:ring-tertiary-fixed-dim"
                type="submit"
              >
                Confirm Visit Request
              </button>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  verified_user
                </span>{" "}
                Your privacy is respected and protected.
              </span>
            </div>
            <PreviewFeedback
              className="p-4 bg-secondary-container text-on-secondary-fixed rounded-lg text-center font-body-md text-body-md font-semibold"
              id="formSuccessMessage"
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
        <div className="lg:col-span-5 flex flex-col justify-between gap-space-md">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-secondary font-bold block mb-1">
              Surrounding Sanctuary Ecosystem
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-space-sm">
              Nearby Heritage &amp; Medical Network
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
              Beth Shalom benefits from both serene spiritual isolation on the
              Elakodinji plateau and immediate proximity to world-class
              healthcare centers in Central Travancore.
            </p>
            <div className="space-y-space-sm">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-start gap-space-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    aria-hidden="true"
                  >
                    account_balance
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Mar Kuriakose Dayara
                    </h3>
                    <span className="text-xs bg-surface-container px-2 py-0.5 rounded text-secondary font-bold">
                      3.5 km
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Pothenpuram, Pampady. Holy resting place of saintly Pampady
                    Thirumeni; site of continuous prayers, spiritual solace, and
                    devotional quiet.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-start gap-space-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    aria-hidden="true"
                  >
                    local_pharmacy
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Pampady Town &amp; Clinics
                    </h3>
                    <span className="text-xs bg-surface-container px-2 py-0.5 rounded text-secondary font-bold">
                      4.0 km
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Immediate access to state banks, post offices, pharmacies,
                    diagnostics labs, and primary medical care facilities.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-start gap-space-sm">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    aria-hidden="true"
                  >
                    emergency
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Super-Speciality Network
                    </h3>
                    <span className="text-xs bg-surface-container px-2 py-0.5 rounded text-secondary font-bold">
                      18-22 km
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Tie-up protocols with Caritas Hospital, Mandiram Hospital,
                    and Kottayam Government Medical College for specialized
                    geriatric and acute clinical emergencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-primary text-on-primary p-space-md rounded-xl shadow-md mt-space-md">
            <div className="flex items-center gap-2 text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wide font-bold mb-1">
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                diversity_1
              </span>{" "}
              Our Inclusive Mission
            </div>
            <h4 className="font-headline-sm text-headline-sm mb-2">
              Differently-Abled Supportive Unit
            </h4>
            <p className="font-body-sm text-body-sm text-primary-fixed leading-relaxed mb-3">
              In accordance with the sacred vision of Late Lamented H.G.
              Geevarghese Mar Ivanios, our campus also features dedicated
              supportive wings for differently-abled children accompanied by
              aging parents.
            </p>
            <Link
              className="inline-flex items-center gap-1 font-label-md text-label-md text-tertiary-fixed hover:text-white font-semibold transition-colors"
              data-path="about-heritage-mission"
              href="/about-us"
              prefetch={false}
            >
              Read about our founding mission{" "}
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                chevron_right
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisitFaq() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-xl">
      <div className="max-w-3xl mb-space-md">
        <span className="font-label-sm text-label-sm uppercase tracking-wide text-secondary font-bold block mb-1">
          Helpful Advice for Visitors
        </span>
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Frequently Asked Visit Questions
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary"
              aria-hidden="true"
            >
              accessible
            </span>{" "}
            Is the campus wheelchair accessible?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Yes, Beth Shalom is engineered strictly as a geriatric-friendly
            facility. We have zero-threshold entry ramps, wide sensor lifts,
            grab-bar corridors, and specialized wheelchairs available at our
            welcome reception.
          </p>
        </div>
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary"
              aria-hidden="true"
            >
              meeting_room
            </span>{" "}
            Can families view furnished suite models?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Yes! During regular walkthrough hours, families can explore model
            layouts for our Nest, Heaven, Aura, and Vista suites, as well as our
            community dining hall, quiet atrium, and prayer chapel.
          </p>
        </div>
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary"
              aria-hidden="true"
            >
              local_taxi
            </span>{" "}
            Can pick-up from Kottayam station be arranged?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Yes. For visiting senior citizens or NRI family representatives
            arriving from distant locations, we can coordinate trusted local
            transport to and from Kottayam Railway Station or bus stands with
            prior notice.
          </p>
        </div>
      </div>
    </section>
  );
}
export function ContactContent() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full">
        <ContactIntro />
        <ContactOptions />
        <DirectionsAndMap />
        <CampusWalkthrough />
        <VisitFaq />
      </div>
    </main>
  );
}
