import Link from "next/link";
import { PreviewForm, PreviewFeedback } from "../preview-form";
function AdmissionIntro() {
  return (
    <section className="w-full bg-gradient-to-b from-surface-container-low to-surface py-space-lg px-margin-mobile md:px-margin">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-sm">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm"
        >
          <Link
            className="hover:text-primary transition-colors flex items-center gap-1"
            data-path="p-01-home-landing-page"
            href="/"
            prefetch={false}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              aria-hidden="true"
            >
              home
            </span>{" "}
            <span>Home</span>
          </Link>{" "}
          <span className="opacity-40">/</span>{" "}
          <span className="text-on-surface-variant font-medium">
            Admissions
          </span>{" "}
          <span className="opacity-40">/</span>{" "}
          <span className="text-primary font-bold">Admission Inquiry Form</span>
        </nav>
        <div className="max-w-3xl flex flex-col gap-space-xs mt-2">
          <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
            Confidential &amp; Compassionate
          </span>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
            Admission &amp; Care Inquiry
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Take the first step toward secure, peaceful, and dignified living
            for your loved ones. Our admissions committee reviews inquiries with
            gentle attentiveness, medical sensitivity, and utmost
            confidentiality.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-4">
          <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
              <span
                className="material-symbols-outlined text-[22px]"
                aria-hidden="true"
              >
                verified
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary font-semibold">
                Non-Profit Guidance
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Under PMGM Abhayabhavan Society
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
              <span
                className="material-symbols-outlined text-[22px]"
                aria-hidden="true"
              >
                schedule
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary font-semibold">
                Prompt Consultation
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Direct response within 24 hours
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary flex-shrink-0">
              <span
                className="material-symbols-outlined text-[22px]"
                aria-hidden="true"
              >
                public
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary font-semibold">
                Worldwide Assistance
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Domestic &amp; NRI inquiries welcomed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdmissionApplication() {
  return (
    <section className="w-full py-space-xl px-margin-mobile md:px-margin">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest p-6 sm:p-8 md:p-10 rounded-2xl shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  Inquiry Application
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Fields indicated with{" "}
                  <span className="text-error font-bold">*</span> are required
                  for medical and room scheduling.
                </p>
              </div>
              <span
                className="material-symbols-outlined text-secondary text-3xl hidden sm:block"
                aria-hidden="true"
              >
                edit_note
              </span>
            </div>
            <PreviewForm className="flex flex-col gap-6" id="admissionForm">
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-md text-label-md text-on-surface flex items-center justify-between"
                  htmlFor="fullName"
                >
                  <span>
                    Full Name of Applicant / Guardian{" "}
                    <span className="text-error">*</span>
                  </span>{" "}
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
                    Primary Point of Contact
                  </span>
                </label>
                <div className="relative">
                  <input
                    className="w-full min-h-[52px] px-4 pl-11 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm"
                    id="fullName"
                    name="fullName"
                    placeholder="e.g. Thomas Varghese"
                    required
                    type="text"
                  />
                  <span
                    className="material-symbols-outlined absolute left-3.5 top-3.5 text-on-surface-variant text-[20px]"
                    aria-hidden="true"
                  >
                    person
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-md text-label-md text-on-surface"
                  htmlFor="phoneNumber"
                >
                  Contact Telephone Number <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-1">
                    <select
                      aria-label="International Country Code"
                      className="w-full min-h-[52px] px-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm"
                      id="countryCode"
                      name="countryCode"
                    >
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+1">🇺🇸 +1 (US/CA)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+965">🇰🇼 +965 (Kuwait)</option>
                      <option value="+968">🇴🇲 +968 (Oman)</option>
                      <option value="+974">🇶🇦 +974 (Qatar)</option>
                      <option value="+65">🇸🇬 +65 (SG)</option>
                      <option value="+61">🇦🇺 +61 (AU)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3 relative">
                    <input
                      className="w-full min-h-[52px] px-4 pl-11 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="98470 12345"
                      required
                      type="tel"
                    />
                    <span
                      className="material-symbols-outlined absolute left-3.5 top-3.5 text-on-surface-variant text-[20px]"
                      aria-hidden="true"
                    >
                      call
                    </span>
                  </div>
                </div>
                <label className="flex items-center gap-3 mt-1.5 p-2 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors w-fit">
                  <input
                    defaultChecked
                    className="w-5 h-5 rounded text-secondary focus:ring-secondary accent-secondary"
                    id="whatsappAvailable"
                    type="checkbox"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface flex items-center gap-1.5">
                    <span
                      className="material-symbols-outlined text-secondary text-[18px]"
                      aria-hidden="true"
                    >
                      chat
                    </span>{" "}
                    This contact number is registered on WhatsApp for rapid file
                    sharing &amp; room photos
                  </span>
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-md text-label-md text-on-surface"
                  htmlFor="emailAddress"
                >
                  Email Address <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full min-h-[52px] px-4 pl-11 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm"
                    id="emailAddress"
                    name="emailAddress"
                    placeholder="thomas.varghese@example.com"
                    required
                    type="email"
                  />
                  <span
                    className="material-symbols-outlined absolute left-3.5 top-3.5 text-on-surface-variant text-[20px]"
                    aria-hidden="true"
                  >
                    mail
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  We send admission checklists and institutional brochures to
                  this email.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-label-md text-on-surface">
                  Applicant / Guardian Residence Status{" "}
                  <span className="text-error">*</span>
                </span>
                <div
                  aria-label="Residence status"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  role="radiogroup"
                >
                  <label className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-all has-[:checked]:bg-secondary-container/40 has-[:checked]:ring-2 has-[:checked]:ring-secondary">
                    <input
                      defaultChecked
                      className="w-5 h-5 accent-secondary"
                      name="residenceStatus"
                      type="radio"
                      value="Domestic"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-primary">
                        Domestic Resident
                      </span>{" "}
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Residing in Kerala / India
                      </span>
                    </div>
                  </label>{" "}
                  <label className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-all has-[:checked]:bg-secondary-container/40 has-[:checked]:ring-2 has-[:checked]:ring-secondary">
                    <input
                      className="w-5 h-5 accent-secondary"
                      name="residenceStatus"
                      type="radio"
                      value="NRI"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-primary">
                        NRI / Overseas Family
                      </span>{" "}
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Gulf, North America, UK, Europe
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-md text-label-md text-on-surface flex items-center justify-between"
                  htmlFor="accommodationType"
                >
                  <span>
                    Preferred Living Space Category{" "}
                    <span className="text-error">*</span>
                  </span>{" "}
                  <Link
                    className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-1"
                    data-path="rooms"
                    href="/rooms"
                    prefetch={false}
                  >
                    <span>Compare All 6 Suites</span>{" "}
                    <span
                      className="material-symbols-outlined text-[14px]"
                      aria-hidden="true"
                    >
                      open_in_new
                    </span>
                  </Link>
                </label>
                <select
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm"
                  id="accommodationType"
                  name="accommodationType"
                >
                  <option value="Nest (Studio - Single Living)">
                    Nest (Studio - Single Living · Bath with Toilet &amp;
                    Balcony · 3rd Floor)
                  </option>
                  <option value="Heaven (Studio+ - Serene Balcony)">
                    Heaven (Studio+ - Serene Balcony · Open Kitchen &amp; Bath ·
                    2nd Floor)
                  </option>
                  <option value="Aura (1-Bed Dedicated Living)">
                    Aura (1-Bed Dedicated Living · Separate Bedroom, Kitchen,
                    Hall · 1st &amp; 2nd Floor)
                  </option>
                  <option value="Vista (1-Bed Garden Living)">
                    Vista (1-Bed Garden Living · Open Kitchen, Balcony, Toilet ·
                    1st Floor)
                  </option>
                  <option value="Harmony (Suite - Dual Balcony &amp; 2 Baths)">
                    Harmony (Suite - Dual Balcony &amp; 2 Baths · 1st &amp; 2nd
                    Floor)
                  </option>
                  <option value="Grande (Crown Suite - 2 Baths &amp; Expansive Living)">
                    Grande (Crown Suite - 2 Baths &amp; Expansive Living · 1st
                    Floor)
                  </option>
                  <option value="Not Sure / Needs Guidance">
                    Not Sure / Recommend Based on Care Assessment
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-md text-label-md text-on-surface"
                  htmlFor="careRequirement"
                >
                  Primary Care &amp; Support Requirement{" "}
                  <span className="text-error">*</span>
                </label>
                <select
                  className="w-full min-h-[52px] px-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm"
                  id="careRequirement"
                  name="careRequirement"
                >
                  <option value="Independent Senior Living">
                    Independent Senior Living (Active retirement with dining
                    &amp; housekeeping)
                  </option>
                  <option value="Assisted Daily Living (ADL)">
                    Assisted Daily Living (ADL support, medication supervision,
                    mobility aid)
                  </option>
                  <option value="Special Needs Support (Autism / CP / Developmental)">
                    Special Needs Support (Autism / CP / Developmental with or
                    without Parents)
                  </option>
                  <option value="Post-Operative / Convalescent Care">
                    Post-Operative / Short-Term Convalescent Recovery
                  </option>
                  <option value="Spouse / Couple Living">
                    Spouse / Couple Living (Joint accommodation)
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-md text-label-md text-on-surface"
                  htmlFor="timeline"
                >
                  Anticipated Move-In Timeline{" "}
                  <span className="text-error">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-secondary-container/40 has-[:checked]:ring-2 has-[:checked]:ring-secondary">
                    <input
                      defaultChecked
                      className="w-4 h-4 accent-secondary"
                      name="timeline"
                      type="radio"
                      value="Immediate"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Immediate (&lt; 30 Days)
                    </span>
                  </label>{" "}
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-secondary-container/40 has-[:checked]:ring-2 has-[:checked]:ring-secondary">
                    <input
                      className="w-4 h-4 accent-secondary"
                      name="timeline"
                      type="radio"
                      value="Next 1-3 Months"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Next 1–3 Months
                    </span>
                  </label>{" "}
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all has-[:checked]:bg-secondary-container/40 has-[:checked]:ring-2 has-[:checked]:ring-secondary">
                    <input
                      className="w-4 h-4 accent-secondary"
                      name="timeline"
                      type="radio"
                      value="Future Planning"
                    />
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Future (3–6 Months)
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-label-md text-label-md text-on-surface"
                  htmlFor="specialNotes"
                >
                  Resident Details &amp; Specific Medical Requisites
                </label>
                <textarea
                  className="w-full p-4 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm leading-relaxed"
                  id="specialNotes"
                  name="specialNotes"
                  placeholder="Please share details regarding resident&#39;s age, mobility assistance (wheelchair, walker), dietary requirements, sensory sensitivities, or developmental support requirements..."
                  rows={4}
                ></textarea>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Sharing relevant clinical context helps our doctor prepare the
                  initial accommodation feasibility note.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    className="w-5 h-5 rounded text-secondary focus:ring-secondary accent-secondary mt-0.5"
                    id="privacyConsent"
                    name="privacyConsent"
                    required
                    type="checkbox"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface leading-snug">
                    I consent to having PMGM Abhayabhavan Charitable Society
                    contact me via call, WhatsApp, or email regarding admission
                    review, room availability, and scheduling an on-site visit
                    in accordance with institutional privacy standards.{" "}
                    <span className="text-error">*</span>
                  </span>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-2">
                <button
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[52px] px-8 py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all duration-200 shadow-md focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
                  type="submit"
                >
                  <span
                    className="material-symbols-outlined mr-2 text-[20px]"
                    aria-hidden="true"
                  >
                    lock
                  </span>{" "}
                  Submit Admission Inquiry
                </button>
                <button
                  className="w-full sm:w-auto inline-flex items-center justify-center min-h-[52px] px-6 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors"
                  type="reset"
                >
                  <span
                    className="material-symbols-outlined mr-2 text-[18px]"
                    aria-hidden="true"
                  >
                    restart_alt
                  </span>{" "}
                  Reset Form
                </button>
              </div>
              <div className="p-4 rounded-xl bg-surface-container border-l-4 border-secondary text-on-surface-variant font-body-sm text-body-sm leading-relaxed mt-2">
                <div className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    info
                  </span>
                  <div>
                    <strong className="text-primary font-semibold">
                      Institutional Policy Notice:
                    </strong>{" "}
                    In accordance with our charitable trust bylaws, room tariffs
                    and care contributions are customized solely on individual
                    nursing intensity and medical needs. No financial
                    transactions, commercial bookings, or advance payments occur
                    through this website form.
                  </div>
                </div>
              </div>
              <PreviewFeedback
                className="p-5 rounded-xl bg-secondary-container text-on-secondary-container shadow-md flex items-start gap-3"
                id="confirmationToast"
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
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          <div className="bg-primary text-on-primary p-6 sm:p-8 rounded-2xl shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">
                Admissions Office
              </span>{" "}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-primary-fixed text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>{" "}
                Lines Open 9 AM - 5:30 PM
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-headline-sm text-on-primary">
                Direct Assistance Desk
              </h3>
              <p className="font-body-sm text-body-sm text-surface-container-highest">
                Prefer speaking directly with our geriatric care coordinator?
                Call or message our admissions counselors for immediate
                guidance.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                className="flex items-center justify-between p-3.5 rounded-xl bg-primary-container hover:bg-surface-tint/30 transition-colors text-on-primary"
                href="tel:+918289838745"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-[24px]"
                    aria-hidden="true"
                  >
                    call
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant-fixed">
                      Main Admissions Cell
                    </span>{" "}
                    <span className="font-label-lg text-label-lg font-bold tracking-wide">
                      +91 8289838745
                    </span>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-primary-fixed text-[18px]"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </a>{" "}
              <a
                className="flex items-center justify-between p-3.5 rounded-xl bg-primary-container hover:bg-surface-tint/30 transition-colors text-on-primary"
                href="tel:+919947575762"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-[24px]"
                    aria-hidden="true"
                  >
                    support_agent
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant-fixed">
                      Care Coordinator
                    </span>{" "}
                    <span className="font-label-lg text-label-lg font-bold tracking-wide">
                      +91 9947575762
                    </span>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-primary-fixed text-[18px]"
                  aria-hidden="true"
                >
                  chevron_right
                </span>
              </a>{" "}
              <a
                className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary/90 transition-all font-label-md text-label-md font-bold shadow-sm"
                href="https://wa.me/918289838745?text=Hello%20Beth%20Shalom,%20I%20would%20like%20to%20inquire%20about%20senior%20living%20admission."
                rel="noopener noreferrer"
                target="_blank"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  chat
                </span>{" "}
                Chat Directly on WhatsApp
              </a>
            </div>
            <div className="pt-3 border-t border-primary-container text-xs text-primary-fixed/80 flex items-center justify-between">
              <span>Mar Kuriakose Dayara, Pampady</span>{" "}
              <span>Diocese of Kottayam</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-md flex flex-col gap-space-md">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                Clear &amp; Transparent
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Admission Process
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                How we ensure thoughtful placement and medical compatibility for
                every new resident.
              </p>
            </div>
            <ol className="flex flex-col gap-5 relative">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold">
                    Inquiry &amp; Tele-Discussion (24h)
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Our admissions officer reviews medical needs, room
                    suitability, and answers all family questions.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold">
                    Geriatric &amp; Mobility Assessment
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Clinical review of medications, doctor&#39;s prescription
                    history, and functional independence level.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold">
                    Campus Walkthrough &amp; Room Selection
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Accompanied tour of our Pampady sanctuary, prayer chapel,
                    dining halls, and specific suite options.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold">
                    Committee Review &amp; Peaceful Welcome
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Formal allocation by PMGM Abhayabhavan Society, personalized
                    diet planning, and settling-in support.
                  </span>
                </div>
              </li>
            </ol>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-secondary text-[24px]"
                aria-hidden="true"
              >
                location_on
              </span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-primary font-bold">
                  Physical Campus Location
                </span>{" "}
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Mar Kuriakose Dayara, Elakodinji, Pampady, Kottayam
                </span>
              </div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[18px] text-secondary"
                  aria-hidden="true"
                >
                  calendar_today
                </span>{" "}
                Visiting Hours: Mon – Sat
              </span>{" "}
              <span className="font-semibold text-primary">
                9:00 AM – 5:30 PM
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdmissionFaq() {
  return (
    <section className="w-full bg-surface-container-low py-space-xl px-margin-mobile md:px-margin">
      <div className="max-w-4xl mx-auto flex flex-col gap-space-lg">
        <div className="text-center flex flex-col gap-2">
          <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
            Common Inquiries
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Frequently Asked Questions
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Essential information regarding daily life, clinical emergency
            preparedness, and family engagement.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <details className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm transition-all duration-200 open:shadow-md cursor-pointer">
            <summary className="flex items-center justify-between font-label-lg text-label-lg text-primary list-none select-none">
              <span className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  family_restroom
                </span>{" "}
                Can family members accompany residents or visit frequently?
              </span>{" "}
              <span
                className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                expand_more
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-surface-container-high font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Yes, warm family bonds are deeply nurtured at Beth Shalom.
              Relatives and children may visit during regular daytime hours. For
              overseas or out-of-station family members arriving in Kerala,
              guest dining and scheduled short-stay visitor arrangements can be
              facilitated with prior notification to the superintendent.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm transition-all duration-200 open:shadow-md cursor-pointer">
            <summary className="flex items-center justify-between font-label-lg text-label-lg text-primary list-none select-none">
              <span className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  medical_services
                </span>{" "}
                How is medical emergency care managed around the clock?
              </span>{" "}
              <span
                className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                expand_more
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-surface-container-high font-body-md text-body-md text-on-surface-variant leading-relaxed">
              The retirement home maintains trained on-campus nursing staff,
              round-the-clock emergency medical response, oxygen support, and
              vital signs monitoring. In addition, Beth Shalom has an
              institutional tie-up with premier multi-speciality tertiary
              hospitals in Pampady and Kottayam town with designated on-call
              ambulance conveyance.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm transition-all duration-200 open:shadow-md cursor-pointer">
            <summary className="flex items-center justify-between font-label-lg text-label-lg text-primary list-none select-none">
              <span className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  description
                </span>{" "}
                What documents are required during formal admission?
              </span>{" "}
              <span
                className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                expand_more
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-surface-container-high font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Standard documentation includes: (1) Government Identity &amp;
              Address proof of the resident and nominated local/NRI guardian
              (Aadhaar, Passport, or Voter ID), (2) Comprehensive medical
              history summary and latest physician prescriptions, and (3) Two
              recent passport-sized photographs.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm transition-all duration-200 open:shadow-md cursor-pointer">
            <summary className="flex items-center justify-between font-label-lg text-label-lg text-primary list-none select-none">
              <span className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  accessible_forward
                </span>{" "}
                Does Beth Shalom support differently-abled children and adults?
              </span>{" "}
              <span
                className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                expand_more
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-surface-container-high font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Yes, this is an integral pillar of our founding mission under the
              vision of Late Lamented His Grace Geevarghese Mar Ivanios
              Thirumeni. We welcome developmentally challenged individuals,
              adults with autism or cerebral palsy, and offer integrated options
              where elderly parents and their special-needs children reside
              harmoniously under unified institutional protection.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-xl p-5 shadow-sm transition-all duration-200 open:shadow-md cursor-pointer">
            <summary className="flex items-center justify-between font-label-lg text-label-lg text-primary list-none select-none">
              <span className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  hotel
                </span>{" "}
                Are short-term or convalescent respite stays permitted?
              </span>{" "}
              <span
                className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              >
                expand_more
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-surface-container-high font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Subject to room availability in our Nest and Heaven suites, we
              accommodate short-term respite stays (minimum 30 days) for seniors
              recovering post-surgery or whose primary caregivers are
              temporarily traveling abroad.
            </div>
          </details>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-surface-container shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-secondary text-[28px]"
              aria-hidden="true"
            >
              live_help
            </span>
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-primary font-bold">
                Have a specific question not covered here?
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Our welfare superintendent is available to assist your family
                directly.
              </span>
            </div>
          </div>
          <a
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm flex-shrink-0"
            href="tel:+918289838745"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              call
            </span>{" "}
            Speak to Staff
          </a>
        </div>
      </div>
    </section>
  );
}
export function AdmissionContent() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full">
        <AdmissionIntro />
        <AdmissionApplication />
        <AdmissionFaq />
      </div>
    </main>
  );
}
