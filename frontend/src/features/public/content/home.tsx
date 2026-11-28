import { HomeRoomTiles } from "../room-catalogue";
import Link from "next/link";
import { SiteImage } from "../site-image";
import { ChildrenSupportSection } from "./children-support";
function WelcomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-primary text-on-primary">
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent z-10"></div>
      <SiteImage
        className="absolute inset-0 w-full h-full object-cover opacity-100 scale-105 transform duration-1000 ease-out"
        src="/beth-shalom/assets/home-hero-residents.webp"
        srcSet="/beth-shalom/assets/home-hero-residents-640.webp 640w, /beth-shalom/assets/home-hero-residents-960.webp 960w, /beth-shalom/assets/home-hero-residents.webp 1376w"
        sizes="100vw"
        alt=""
        data-alt="Older women sharing a conversation in the garden of a welcoming residence"
        loading="eager"
        fetchPriority="high"
      />
      <div className="relative z-20 max-w-7xl mx-auto px-margin-mobile md:px-margin py-16 md:py-24 lg:py-28 flex flex-col justify-center min-h-[580px]">
        <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-surface-bright max-w-4xl tracking-tight mb-6 leading-tight">
          “Where Faith Gives Hope, Love Gives Care, and Peace Becomes Home.”
        </h1>
        <p className="font-body-lg text-body-lg text-surface-container-highest max-w-3xl mb-10 leading-relaxed font-normal opacity-95">
          The epitome of worry-free assisted community living and specialized
          holistic care for families of developmentally disabled individuals and
          senior citizens under Malankara Orthodox Syrian Church auspices.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg hover:bg-secondary/90 transition-all duration-200 shadow-md focus:outline-none focus:ring-4 focus:ring-tertiary-fixed-dim/40 hover:-translate-y-0.5"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            Explore Living Spaces{" "}
            <span
              className="material-symbols-outlined ml-2 text-[20px]"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </Link>{" "}
          <Link
            className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-lg hover:bg-surface-bright transition-all duration-200 shadow-md focus:outline-none focus:ring-4 focus:ring-tertiary-fixed-dim/40"
            data-path="admission-inquiry"
            href="/admission-enquiry"
            prefetch={false}
          >
            Submit Admission Enquiry
          </Link>{" "}
          <a
            className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border border-white/70 bg-white/15 text-surface-bright font-label-lg text-label-lg backdrop-blur-sm hover:bg-white/25 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-tertiary-fixed-dim/40"
            href="#home-virtual-tour"
          >
            <span
              className="material-symbols-outlined mr-2 text-[20px]"
              aria-hidden="true"
            >
              360
            </span>
            Take a Virtual Tour
          </a>
          <div className="flex items-center gap-3 pl-2 sm:pl-4 text-surface-container-highest">
            <span
              className="material-symbols-outlined text-tertiary-fixed-dim text-[24px]"
              aria-hidden="true"
            >
              support_agent
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-surface-container-highest/80">
                Direct Helpline
              </span>{" "}
              <a
                className="font-label-md text-label-md text-surface-bright hover:underline font-semibold"
                href="tel:+918289838745"
              >
                +91 8289838745
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-surface-container-highest/20 max-w-4xl">
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-tertiary-fixed-dim">
              60+
            </span>{" "}
            <span className="font-body-sm text-body-sm text-surface-container-highest/80">
              Years of Trusted Care
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-tertiary-fixed-dim">
              32
            </span>{" "}
            <span className="font-body-sm text-body-sm text-surface-container-highest/80">
              Geriatric Suites &amp; Rooms
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-tertiary-fixed-dim">
              24/7
            </span>{" "}
            <span className="font-body-sm text-body-sm text-surface-container-highest/80">
              Dedicated Nursing Care
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-tertiary-fixed-dim">
              100%
            </span>{" "}
            <span className="font-body-sm text-body-sm text-surface-container-highest/80">
              Accessible Sanctuary
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogoStory() {
  return (
    <section
      className="w-full py-space-xl bg-surface-container-low"
      aria-labelledby="logo-story-heading"
    >
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin grid grid-cols-1 md:grid-cols-[220px_1fr] gap-space-lg items-center">
        <div className="mx-auto w-48 h-48 rounded-full bg-white p-3 shadow-sm">
          <SiteImage
            src="/beth-shalom/assets/beth-shalom-logo.jpeg"
            alt="Beth Shalom logo: a dove, olive branch and welcoming home"
            className="w-full h-full object-contain"
            width={192}
            height={192}
            loading="lazy"
          />
        </div>
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
            The meaning in our mark
          </p>
          <h2
            id="logo-story-heading"
            className="font-headline-lg text-headline-lg text-primary mb-3"
          >
            A symbol of peace, shelter and care
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            The emblem reflects the charitable mission carried forward by PMGM
            Abhayabhavan Society, registered in 1967. Its dove and olive branch
            speak of peace and hope; the green roof forms a welcoming home,
            while the golden lines suggest care through every season of life.
            Together, these elements express Beth Shalom’s promise of dignity,
            belonging and compassionate support.
          </p>
        </div>
      </div>
    </section>
  );
}

function VirtualTour() {
  return (
    <section
      id="home-virtual-tour"
      className="w-full py-space-xl bg-surface"
      aria-labelledby="virtual-tour-heading"
    >
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-center">
        <div className="rounded-2xl overflow-hidden bg-primary-container aspect-[16/9] relative">
          <SiteImage
            src="/beth-shalom/assets/design/home-b4205c461c77.webp"
            alt="A sunlit garden courtyard with resident seating and greenery"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-primary/35 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-6xl"
              aria-hidden="true"
            >
              play_circle
            </span>
          </div>
          <span className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-3 py-1 font-label-sm text-label-sm text-on-surface-variant">
            Virtual walkthrough coming soon
          </span>
        </div>
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">
            Explore at your own pace
          </p>
          <h2
            id="virtual-tour-heading"
            className="font-headline-lg text-headline-lg text-primary mb-3"
          >
            Feel at home before you arrive
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
            Our interactive 360° campus tour is being prepared. For now, browse
            the living spaces and facilities, or contact us to arrange an
            in-person visit.
          </p>
          <Link
            className="inline-flex items-center justify-center min-h-[48px] px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
            href="/facilities"
            prefetch={false}
          >
            Explore campus facilities
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeritageSpotlight() {
  return (
    <section className="w-full bg-surface-container-low py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-secondary"></span>{" "}
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                Our Sacred Foundation
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight mb-6">
              Founded on Unwavering Compassion &amp; Saintly Grace
            </h2>
            <div className="space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
              <p>
                His Grace{" "}
                <strong className="text-on-surface font-semibold">
                  Kuriakose Mar Gregorios
                </strong>{" "}
                of blessed memory, affectionately known across Kerala as{" "}
                <em className="text-primary font-serif">‘Pampady Thirumeni’</em>
                , led a holy and saintly life centered at Mar Kuriakose Dayara,
                Pampady. He embodied boundless empathy, love, and protection
                towards the elderly, the differently abled, and the marginalized
                in our society.
              </p>
              <p>
                Carrying this venerable mantle forward,{" "}
                <strong className="text-on-surface font-semibold">
                  BethShalom Geevarghese Mar Ivanios (GMI) Retirement Home
                </strong>{" "}
                was birthed from the heartfelt vision of{" "}
                <strong className="text-on-surface font-semibold">
                  Late Lamented His Grace Geevarghese Mar Ivanios Thirumeni
                </strong>
                . It stands as a beacon of safety for children and adults with
                developmental delays alongside their aging parents.
              </p>
              <p>
                Functioning under the steadfast governance of{" "}
                <strong className="text-primary font-semibold">
                  PMGM Abhayabhavan Charitable Society
                </strong>{" "}
                (Reg. No. K. 20 of 1967), the sanctuary unites
                geriatric-friendly living spaces, round-the-clock supportive
                nursing, and spiritual nourishment within the Kottayam Diocese.
              </p>
            </div>
            <div className="mt-8 p-5 rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    account_balance
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Societies Registration Act 1955
                  </p>
                  <p className="font-label-md text-label-md text-primary font-semibold">
                    Reg. No. K. 20 of 1967 (Kottayam)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    badge
                  </span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Government Portal
                  </p>
                  <p className="font-label-md text-label-md text-primary font-semibold">
                    NGO Darpan: KL/22/0254564
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-surface-container-highest">
              <SiteImage
                className="w-full h-80 lg:h-96 object-cover"
                data-alt="High quality architectural view of Beth Shalom GMI Retirement Home with terracotta brick façade, white balconies and red tile eaves set against rolling green Kerala hills and rubber plantation groves"
                src="/beth-shalom/assets/design/home-c68e4731ef8e.webp"
                alt=""
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent p-6 text-on-primary">
                <p className="font-headline-sm text-headline-sm text-surface-bright">
                  Mar Kuriakose Dayara, Pampady
                </p>
                <p className="font-body-sm text-body-sm text-surface-container-highest">
                  Elakodinji, Kottayam, Kerala
                </p>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-highest flex items-start gap-4 shadow-sm">
              <span
                className="material-symbols-outlined text-secondary text-[28px] shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                church
              </span>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Malankara Orthodox Heritage
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Daily chapel prayers, spiritual counsel, Holy Qurbana access,
                  and unhurried meditation in harmony with nature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionPillars() {
  return (
    <section className="w-full bg-surface py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-secondary"></span>{" "}
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                Our Guiding Purpose
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
              Our Noble Mission for Families &amp; Seniors
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Beth Shalom is designed around total life-care: bridging physical
            rehabilitation, quiet retirement, and lasting peace of mind.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                family_restroom
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
              Lifelong Family Shelter
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Providing a secure, nurturing home to abandoned and
              developmentally challenged children alongside their parents,
              easing worry for future tomorrows.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                spa
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
              Peace &amp; Serene Ambiance
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Surrounded by unpolluted village greenery in Elakodinji, creating
              a calm atmosphere that nurtures emotional stability and mental
              tranquility.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                sentiment_satisfied
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
              Dignity, Worth &amp; Hope
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Ensuring every resident feels honored, safe, and purposeful with
              engaging daily activities, compassionate care, and a community to
              belong to.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                psychology
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
              Holistic Well-being
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Attending to the combined physical, psychological, and emotional
              requirements of residents with dedicated nurses, dietitians, and
              therapists.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                agriculture
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
              Empowerment &amp; Farming
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Imparting therapeutic vocational training in horticulture and
              organic agriculture, encouraging self-worth and gentle outdoor
              engagement.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                accessible
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-3">
              Assistive Mobility Support
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Providing modern aids, wheelchairs, elevators, grab bars, and
              non-skid paths to ensure universal mobility for all basic daily
              tasks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LivingSpacesShowcase() {
  return (
    <section
      id="home-living-spaces"
      className="home-refresh home-living-spaces"
      aria-labelledby="home-living-title"
    >
      <div className="home-refresh-inner">
        <div className="home-refresh-heading">
          <h2
            id="home-living-title"
            className="font-headline-lg text-headline-lg text-primary"
          >
            Thoughtfully Planned Living Spaces
          </h2>
          <p className="font-body-md text-body-md">
            Explore senior-friendly residences, from independent studios to
            spacious multi-bedroom homes.
          </p>
        </div>
        <HomeRoomTiles />
        <div className="home-refresh-actions">
          <Link
            className="home-refresh-action font-label-md text-label-md"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            Explore All Rooms{" "}
            <span className="material-symbols-outlined " aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FacilitiesHighlights() {
  return (
    <section className="w-full bg-surface py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[2px] bg-secondary"></span>{" "}
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                Amenities &amp; Care
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight mb-6">
              Comprehensive Facilities for Physical, Emotional &amp; Spiritual
              Well-being
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
              Beth Shalom combines the comforts of a private retreat with
              specialized clinical and therapeutic resources to attend to
              residents of all ability levels.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  check
                </span>{" "}
                Wheelchair Ramp Ingress
              </span>{" "}
              <span className="px-4 py-2 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  check
                </span>{" "}
                Hospital-grade Elevator
              </span>{" "}
              <span className="px-4 py-2 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  check
                </span>{" "}
                24/7 Security &amp; CCTV
              </span>{" "}
              <span className="px-4 py-2 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  check
                </span>{" "}
                Purified RO Drinking Water
              </span>{" "}
              <span className="px-4 py-2 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  check
                </span>{" "}
                24/7 Ambulance Service
              </span>{" "}
              <span className="px-4 py-2 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[16px] text-secondary"
                  aria-hidden="true"
                >
                  check
                </span>{" "}
                On-call Doctors
              </span>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-md">
                <SiteImage
                  className="w-full h-48 sm:h-56 object-cover"
                  data-alt="Interior view of a sunlit peaceful Christian prayer chapel with wooden altar, candles, and cross in Beth Shalom retirement home Kottayam"
                  src="/beth-shalom/assets/design/home-9b3562340f30.webp"
                  alt=""
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md mt-6">
                <SiteImage
                  className="w-full h-48 sm:h-56 object-cover"
                  data-alt="Senior physiotherapy gym and wellness room with mobility rails, gentle exercise equipment, and therapist assisting an elderly patient"
                  src="/beth-shalom/assets/design/home-d64c8a1a0e2d.webp"
                  alt=""
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <SiteImage
                  className="w-full h-48 sm:h-56 object-cover"
                  data-alt="Central airy botanical courtyard and indoor atrium with skylight, lush indoor plants, comfortable seating and elders reading together"
                  src="/beth-shalom/assets/design/home-b4205c461c77.webp"
                  alt=""
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md mt-6">
                <SiteImage
                  className="w-full h-48 sm:h-56 object-cover"
                  data-alt="Warm modern senior recreation lounge and home theater with comfortable armchairs where residents gather for community fellowship"
                  src="/beth-shalom/assets/design/home-6d3f012045e6.webp"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <ul
          className="home-amenity-icons"
          aria-label="Featured facilities"
          role="list"
        >
          <li>
            <span
              className="material-symbols-outlined amenity-icon-devotional"
              aria-hidden="true"
            >
              church
            </span>
            <span className="home-amenity-label font-body-md text-body-md">
              A Devotional Place
            </span>
          </li>
          <li>
            <span
              className="material-symbols-outlined amenity-icon-theater"
              aria-hidden="true"
            >
              theater_comedy
            </span>
            <span className="home-amenity-label font-body-md text-body-md">
              Recreation &amp; Theater
            </span>
          </li>
          <li>
            <span
              className="material-symbols-outlined amenity-icon-care"
              aria-hidden="true"
            >
              health_and_safety
            </span>
            <span className="home-amenity-label font-body-md text-body-md">
              Dedicated Care Room
            </span>
          </li>
          <li>
            <span
              className="material-symbols-outlined amenity-icon-fitness"
              aria-hidden="true"
            >
              fitness_center
            </span>
            <span className="home-amenity-label font-body-md text-body-md">
              Senior Gym &amp; Saloon
            </span>
          </li>
        </ul>
        <div className="home-refresh-actions">
          <Link
            className="home-refresh-action home-amenity-cta font-label-md text-label-md"
            data-path="facilities"
            href="/facilities"
            prefetch={false}
          >
            Explore All Facilities{" "}
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function GuidedVisit() {
  return (
    <section className="w-full bg-surface-bright py-16 lg:py-20 border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-3xl bg-white shadow-sm">
          <div className="max-w-2xl">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
              Immediate Support &amp; Tours
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight mt-1 mb-3">
              Schedule a Guided Visit to Beth Shalom
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Experience the serenity of Elakodinji, tour our specialized living
              spaces, and speak with our caretakers and admissions committee to
              find the right sanctuary for your family.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
            <Link
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
              data-path="admission-inquiry"
              href="/admission-enquiry"
              prefetch={false}
            >
              Enquire About Admission
            </Link>{" "}
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md hover:bg-surface-container transition-colors"
              href="tel:+918289838745"
            >
              <span
                className="material-symbols-outlined mr-2 text-[20px]"
                aria-hidden="true"
              >
                call
              </span>{" "}
              Call Office
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function HomeContent() {
  return (
    <main className="w-full bg-surface">
      <div className="flex flex-col w-full">
        <WelcomeHero />
        <LogoStory />
        <VirtualTour />
        <HeritageSpotlight />
        <MissionPillars />
        <ChildrenSupportSection />
        <LivingSpacesShowcase />
        <FacilitiesHighlights />
        <GuidedVisit />
      </div>
    </main>
  );
}
