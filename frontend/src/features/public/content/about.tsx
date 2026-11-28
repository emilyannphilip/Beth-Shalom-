import Link from "next/link";
import { SiteImage } from "../site-image";
function HeritageNavigation() {
  return (
    <section className="w-full bg-surface-container-low py-4 px-margin-mobile md:px-margin">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-on-surface-variant font-label-md text-label-md">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-on-surface-variant"
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
            Home
          </Link>{" "}
          <span className="text-outline-variant" aria-hidden="true">/</span>{" "}
          <span className="text-primary font-bold" aria-current="page">
            About Us
          </span>
        </nav>
        <nav
          aria-label="Heritage In-page Jump Navigation"
          className="flex flex-wrap items-center gap-2 text-label-sm font-label-sm"
        >
          <a
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-all duration-200"
            href="#sacred-heritage"
          >
            Sacred Roots
          </a>{" "}
          <a
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-all duration-200"
            href="#visionary-founder"
          >
            Founding Vision
          </a>{" "}
          <a
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-all duration-200"
            href="#governing-society"
          >
            PMGM Society
          </a>{" "}
          <a
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-all duration-200"
            href="#mission-pillars"
          >
            Four Pillars
          </a>{" "}
          <a
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-all duration-200"
            href="#elakodinji-sanctuary"
          >
            The Hilltop Campus
          </a>{" "}
          <a
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary transition-all duration-200"
            href="#governing-society"
          >
            Charitable Trust
          </a>
        </nav>
      </div>
    </section>
  );
}

function AboutHero() {
  return (
    <section className="w-full relative px-margin-mobile md:px-margin py-space-xl overflow-hidden bg-gradient-to-b from-surface-container-low to-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container w-fit font-label-sm text-label-sm">
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              spa
            </span>{" "}
            <span>Sacred Roots &amp; Enduring Grace • Pampady, Kerala</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">
            A Sanctuary Born from Saints’ Prayers, Guided by Lifelong
            Compassion.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Beth Shalom (GMI) Retirement Home is more than a residence—it is a
            spiritual covenant rooted in the lush hills of Elakodinji, Pampady.
            Formed under the aegis of the Kottayam Diocese of the Malankara
            Orthodox Syrian Church, we offer an enduring haven where elderly
            parents and their differently-abled children live side-by-side with
            peace, lifelong security, and quiet dignity.
          </p>
          <div className="flex flex-wrap items-center gap-space-md pt-2">
            <a
              className="min-h-[52px] px-8 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg inline-flex items-center gap-2 shadow-sm transition-all duration-200"
              href="#mission-pillars"
            >
              <span>Explore Our Calling</span>{" "}
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                south
              </span>
            </a>{" "}
            <a
              className="min-h-[52px] px-7 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-lg text-label-lg inline-flex items-center gap-2 transition-all duration-200"
              href="#governing-society"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                verified
              </span>{" "}
              <span>60-Year Charitable Trust</span>
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm pt-space-md mt-space-sm bg-surface-container p-space-md rounded-xl">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                1967
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Founded by PMGM Society
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                100%
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Not-for-Profit Mission
              </span>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                KL/22/0254564
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Govt NGO Darpan ID
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col items-center relative">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface-container-highest">
            <SiteImage
              className="w-full h-full object-cover"
              data-alt="Stunning aerial view of Beth Shalom multi-storey retirement retreat nestled into the lush tropical green hills and coconut groves of Elakodinji Pampady Kerala in warm afternoon sunlight, showcasing peaceful architecture and natural Kerala mountain flora."
              src="/beth-shalom/assets/design/about-163ae172280f.webp"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-space-lg text-on-primary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary-fixed font-semibold">
                Elakodinji Hilltop Sanctuary
              </span>
              <p className="font-headline-sm text-headline-sm mt-1 text-on-primary">
                &quot;Where Faith Gives Hope, Love Gives Care, and Peace Becomes
                Home.&quot;
              </p>
            </div>
          </div>
          <div className="w-[90%] -mt-10 relative z-20 bg-surface-container-lowest p-space-md rounded-xl shadow-lg flex items-center gap-space-sm">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
              <span
                className="material-symbols-outlined text-[26px]"
                aria-hidden="true"
              >
                volunteer_activism
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary font-bold">
                Dual-Vow of Sacred Protection
              </span>{" "}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Providing permanent shelter for aging parents and their
                challenged children together.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SacredHeritage() {
  return (
    <section
      className="w-full py-space-xl px-margin-mobile md:px-margin bg-surface"
      id="sacred-heritage"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
            The Spiritual Lineage
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Rooted in the Living Memory of Pampady Thirumeni
          </h2>
          <div className="w-16 h-1 rounded-full bg-tertiary-fixed-dim"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="relative rounded-xl overflow-hidden shadow-md bg-surface-container-high aspect-[3/2]">
              <SiteImage
                className="w-full h-full object-cover"
                data-alt="Serene historical monastery setting of Mar Kuriakose Dayara Pothenpuram Pampady surrounded by tall teak trees and tropical gardens, showing classic Kerala Christian chapel arches and a peaceful prayer environment in soft morning light."
                src="/beth-shalom/assets/design/about-5e85214c1b8b.webp"
                alt=""
              />
              <div className="absolute bottom-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-on-surface font-label-sm text-label-sm">
                Mar Kuriakose Dayara, Pothenpuram
              </div>
            </div>
            <div className="bg-surface-container p-space-md rounded-xl flex items-start gap-space-sm">
              <span
                className="material-symbols-outlined text-secondary text-[28px] mt-1 shrink-0"
                aria-hidden="true"
              >
                format_quote
              </span>
              <div className="flex flex-col">
                <p className="font-headline-sm text-headline-sm text-primary italic font-normal">
                  &quot;To comfort those who weep and to extend both hands to
                  those whom the world overlooks—this is pure worship.&quot;
                </p>
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold mt-2">
                  — Saintly Memory of H.G. Kuriakose Mar Gregorios (Pampady
                  Thirumeni)
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
              His Grace Kuriakose Mar Gregorios of blessed memory,
              affectionately revered across Kerala as{" "}
              <strong className="text-primary font-bold">
                ‘Pampady Thirumeni’
              </strong>
              , was a figure of incandescent empathy. During an era when those
              living with severe bodily ailments and intellectual challenges
              were frequently marginalized, Thirumeni transformed Mar Kuriakose
              Dayara in Pothenpuram into an open sanctuary of unceasing prayer,
              healing, and warmth.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Following his departure to the heavenly realm, his disciples and
              devotees established the{" "}
              <strong className="text-primary">
                PMGM Abhayabhavan Charitable Society
              </strong>{" "}
              in 1965 at the Dayara. Their single guiding principle was to
              institutionalize his tender solicitude into permanent physical
              homes where love and dignity could flourish undisturbed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-secondary font-label-md text-label-md font-bold">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    local_hospital
                  </span>{" "}
                  Boundless Empathy
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Pampady Thirumeni visited destitute families by foot, sharing
                  meals and blessing medicines, anchoring our healthcare
                  philosophy in humble personal attention.
                </p>
              </div>
              <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-secondary font-label-md text-label-md font-bold">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    church
                  </span>{" "}
                  Daily Monastic Grace
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  The continuous spiritual vigil of Dayara priests and fathers
                  continues to bless Beth Shalom&#39;s daily life, chapel
                  devotions, and resident peace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FoundingVision() {
  return (
    <section
      className="w-full py-space-xl px-margin-mobile md:px-margin bg-surface-container-low"
      id="visionary-founder"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                  GMI
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    H.G. Geevarghese Mar Ivanios
                  </h3>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">
                    Visionary Bishop &amp; Spiritual Father
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Kottayam Diocese (Late Lamented)
                  </span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                Mar Ivanios Thirumeni intimately understood the quiet,
                unbearable agony of aging parents:{" "}
                <em className="text-primary italic">
                  &quot;What happens to my disabled child after my eyes close
                  forever?&quot;
                </em>
              </p>
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-2">
                <span className="font-label-sm text-label-sm font-bold text-primary uppercase">
                  The Divine Mandate
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  &quot;Let us build not merely an old age home, nor an asylum
                  of isolation, but Beth Shalom—a House of Peace where mother,
                  father, and child may remain together under God&#39;s
                  canopy.&quot;
                </p>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  verified
                </span>{" "}
                <span>
                  Conceived &amp; Authorized under PMGM Abhayabhavan Supervision
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-space-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary w-fit font-label-sm text-label-sm font-semibold">
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                visibility
              </span>{" "}
              The GMI Inspiration
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Answering the Silent Prayer of Every Aging Caregiver.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              In traditional senior care, aging parents are severed from their
              adult children who require specialized support due to cerebral
              palsy, Down syndrome, severe autism, or cognitive impairment. Mar
              Ivanios recognized this tragic flaw in modern societal care
              structures.
            </p>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              He designated Beth Shalom GMI as an innovative, dual-purpose
              community where parents receive top-tier geriatric comfort,
              companionship, and round-the-clock medical care, while their
              children access dedicated behavioral therapy, compassionate
              caregivers, and agricultural vocational empowerment within the
              exact same building and campus.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
              <div className="flex items-start gap-space-xs">
                <span
                  className="material-symbols-outlined text-secondary text-[22px] mt-0.5"
                  aria-hidden="true"
                >
                  family_restroom
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-primary">
                    Unbroken Family Bonds
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Zero separation anxiety between elderly parents and
                    challenged adult children.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-space-xs">
                <span
                  className="material-symbols-outlined text-secondary text-[22px] mt-0.5"
                  aria-hidden="true"
                >
                  favorite
                </span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md font-bold text-primary">
                    Perpetual Care Assurance
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    The Society pledges lifelong guardian care when elderly
                    parents eventually pass on.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimony() {
  return (
    <section
      id="testimony"
      className="testimony-section"
      aria-labelledby="testimony-heading"
    >
      <div className="testimony-grid">
        <SiteImage
          className="testimony-photo"
          src="/beth-shalom/assets/testimony-portrait.jpg"
          alt="Church dignitary in ceremonial vestments holding a cross and staff"
          width={1400}
          height={2197}
          loading="lazy"
          decoding="async"
        />
        <div className="testimony-copy">
          <h2
            id="testimony-heading"
            className="font-headline-lg text-headline-lg text-primary"
          >
            A Message of Blessing &amp; Inspiration
          </h2>
          <h3 className="font-headline-sm text-headline-sm text-primary">
            A Vision Rooted in Faith, Compassion &amp; Dignity
          </h3>
          <blockquote
            className="font-body-md text-body-md text-on-surface-variant"
            aria-describedby="testimony-draft-note"
          >
            <span className="testimony-quote-mark" aria-hidden="true">
              “
            </span>
            <p>
              Beth Shalom represents a beautiful vision of compassionate living,
              where every individual is valued, respected, and cared for with
              dignity. Inspired by the principles of faith, love, and service,
              this retirement home seeks to provide more than a place to reside.
              It aspires to create a peaceful community where senior citizens
              experience belonging, comfort, spiritual fulfillment, and
              meaningful companionship.
            </p>
            <p>
              May Beth Shalom continue to be a sanctuary of peace, hope, and
              compassionate care, enriching the lives of all who become part of
              this community.
            </p>
          </blockquote>
          <p className="font-label-md text-label-md text-primary">
            Name and official designation to be confirmed.
          </p>
          <p
            id="testimony-draft-note"
            className="testimony-note font-body-sm text-body-sm text-on-surface-variant"
          >
            <strong>Sample website copy.</strong> This quotation is awaiting
            approval and is not attributed to the person pictured.
          </p>
        </div>
      </div>
    </section>
  );
}

function CarePillars() {
  return (
    <section
      className="w-full py-space-xl px-margin-mobile md:px-margin bg-surface-container-low"
      id="mission-pillars"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
            Our Sacred Mission
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Four Pillars of Care, Dignity &amp; Wholeness
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Formulated directly from our official charter to create an enduring
            environment of security, awareness, comfort, and peace of mind.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[28px]"
                  aria-hidden="true"
                >
                  cottage
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-surface-container text-primary font-bold">
                PILLAR 01
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Shelter for Differently-Abled &amp; Their Parents
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Providing lifelong, worry-free residential living for children and
              adults afflicted with intellectual challenges, cerebral palsy,
              autism, and multiple disabilities, alongside their aging parents.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>Eliminates lifelong fear of parental absence</span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Fully customized living suites and barrier-free dormitories
                </span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>Caregiver support relieving elderly burden</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[28px]"
                  aria-hidden="true"
                >
                  cardiology
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-surface-container text-primary font-bold">
                PILLAR 02
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Primary Healthcare, Therapy &amp; Care Rooms
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Round-the-clock geriatric nursing, special education routines,
              physical therapy, mobility aid distribution, and direct tie-ups
              with leading hospitals in Kottayam.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Dedicated on-site Care Rooms &amp; continuous nursing
                  attendants
                </span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Mobility appliances and orthopedic aids provided per
                  individual need
                </span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Routine health camps and resident hygiene awareness sessions
                </span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[28px]"
                  aria-hidden="true"
                >
                  psychology
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-surface-container text-primary font-bold">
                PILLAR 03
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Empowerment, Dignity &amp; Horticultural Therapy
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Nurturing human worth through organic agriculture, gardening,
              sensory engagement, and vocational routines tailored for residents
              with cognitive and physical limitations.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Training in agricultural chores &amp; campus vegetable
                  cultivation
                </span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Recreational therapy: indoor games, audio-visual mini theater,
                  saloon
                </span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Instilling purposeful daily rhythms and self-confidence
                </span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[28px]"
                  aria-hidden="true"
                >
                  self_improvement
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-surface-container text-primary font-bold">
                PILLAR 04
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Spiritual Solace, Serene Ambiance &amp; Devotion
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              A sacred devotional chapel, prayer rooms, quiet open atriums, and
              scenic hill breezes that bring quietude to tired minds and healing
              to aging bodies.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>Daily prayers and spiritual pastoral counseling</span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>
                  Open-air atrium with natural Kerala sunlight &amp; breezes
                </span>
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                <span>A peaceful, respectful, and joyful twilight of life</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HilltopCampus() {
  return (
    <section
      className="w-full py-space-xl px-margin-mobile md:px-margin bg-surface"
      id="elakodinji-sanctuary"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-6 flex flex-col gap-space-md">
            <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">
              Purpose-Built Architecture
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Designed Specifically for Geriatric &amp; Accessible Comfort
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Constructed upon the high scenic ground of Elakodinji, Pampady,
              Beth Shalom integrates modern barrier-free engineering with
              soothing natural surroundings.
            </p>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              The facility encompasses 16 single bedrooms, 14 double bedrooms, 2
              quadruple suites, alongside 2 spacious independent dormitories of
              16 beds each (dedicated separately for men and women).
            </p>
            <div className="grid grid-cols-2 gap-space-sm pt-2">
              <div className="bg-surface-container p-space-sm rounded-lg flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  accessible
                </span>{" "}
                <span className="font-label-sm text-label-sm font-semibold text-primary">
                  Step-Free Thresholds
                </span>
              </div>
              <div className="bg-surface-container p-space-sm rounded-lg flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  air
                </span>{" "}
                <span className="font-label-sm text-label-sm font-semibold text-primary">
                  Hillside Cross-Ventilation
                </span>
              </div>
              <div className="bg-surface-container p-space-sm rounded-lg flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  theater_comedy
                </span>{" "}
                <span className="font-label-sm text-label-sm font-semibold text-primary">
                  Indoor Mini Theater
                </span>
              </div>
              <div className="bg-surface-container p-space-sm rounded-lg flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  content_cut
                </span>{" "}
                <span className="font-label-sm text-label-sm font-semibold text-primary">
                  Resident Saloon &amp; Grooming
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-space-sm">
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm bg-surface-container-high">
              <SiteImage
                className="w-full h-full object-cover"
                data-alt="Detailed architectural front elevation of Beth Shalom retirement home in Elakodinji Pampady Kerala with red brick facade, green gabled roofs, wide balconies, and manicured green hedges under clear blue sky."
                src="/beth-shalom/assets/design/about-4ed439290e96.webp"
                alt=""
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm bg-surface-container-high">
              <SiteImage
                className="w-full h-full object-cover"
                data-alt="Interior architectural floorplan visualization showing accessible senior living suite with bedroom, spacious bathroom with safety grab rails, kitchenette, and open sun balcony."
                src="/beth-shalom/assets/design/about-41677925e868.webp"
                alt=""
              />
            </div>
            <div className="col-span-2 aspect-[16/9] rounded-xl overflow-hidden shadow-sm bg-surface-container-high relative">
              <SiteImage
                className="w-full h-full object-cover"
                data-alt="Lush panoramic aerial vista of the mountain landscape of Elakodinji Kottayam Kerala with mist over tea plantations, coconut palms, and peaceful church spires in the distance."
                src="/beth-shalom/assets/design/about-10fae210081d.webp"
                alt=""
              />
              <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-sm text-on-primary px-3 py-1 rounded-md font-label-sm text-label-sm">
                Pure Hilltop Air • 0% Urban Noise Pollution
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Leadership() {
  return (
    <section
      id="organizational-hierarchy"
      className="leadership-chart"
      aria-labelledby="leadership-heading"
    >
      <div className="leadership-inner">
        <h2
          id="leadership-heading"
          className="font-headline-lg text-headline-lg text-primary"
        >
          Organizational Hierarchy
        </h2>
        <div className="leadership-grid">
          <article className="leadership-card">
            <SiteImage
              className="leadership-avatar"
              src="/beth-shalom/assets/thomas-mar-athanasius.jpg"
              alt=""
              width={88}
              height={88}
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Thomas Mar Athanasius
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Governing Board Member, OTS Kottayam
            </p>
          </article>
          <article className="leadership-card">
            <SiteImage
              className="leadership-avatar"
              src="/beth-shalom/assets/yuhanon-mar-meletius.jpg"
              alt=""
              width={88}
              height={88}
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Yuhanon Mar Meletius
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Representative to UTC, Bangalore
            </p>
          </article>
          <article className="leadership-card">
            <SiteImage
              className="leadership-avatar"
              src="/beth-shalom/assets/geevarghese-mar-coorilose.jpg"
              alt=""
              width={88}
              height={88}
              loading="lazy"
              decoding="async"
            />
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Geevarghese Mar Coorilose
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              President, The Servants of the Cross; President, Ministry of Human
              Empowerment; Representative to CMC Ludhiana
            </p>
          </article>
          <article className="leadership-card">
            <span
              className="leadership-avatar font-label-md text-label-md"
              aria-hidden="true"
            >
              ZN
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Zachariah Mar Nicholovos
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Vice President, Inter-Church Relations Department; President, Rule
              Committee
            </p>
          </article>
          <article className="leadership-card">
            <span
              className="leadership-avatar font-label-md text-label-md"
              aria-hidden="true"
            >
              YI
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Dr. Yakob Mar Irenios
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              President, MOC Publications; President, Divyabodhanam;
              Representative to CASA
            </p>
          </article>
          <article className="leadership-card">
            <span
              className="leadership-avatar font-label-md text-label-md"
              aria-hidden="true"
            >
              GG
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Dr. Gabriel Mar Gregorios
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manager, Catholicate &amp; MD Corporate Schools; President,
              Mission Board
            </p>
          </article>
          <article className="leadership-card">
            <span
              className="leadership-avatar font-label-md text-label-md"
              aria-hidden="true"
            >
              YC
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Dr. Yuhanon Mar Chrysostamos
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Secretary, Holy Episcopal Synod; Representative to Working
              Committee; President, MDCC Sub Committee
            </p>
          </article>
          <article className="leadership-card">
            <span
              className="leadership-avatar font-label-md text-label-md"
              aria-hidden="true"
            >
              YP
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              H.G Yuhanon Mar Policarpos
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              President, Marriage Assistance Scheme; President, Church Finance
              Committee
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Custodianship() {
  return (
    <section
      id="governing-society"
      className="feature-section"
      aria-labelledby="governing-society-heading"
    >
      <div className="public-section-inner">
        <div className="public-section-heading">
          <h2 id="governing-society-heading">Organization Custodianship</h2>
        </div>
        <div className="feature-grid custodian-grid custodian-collection">
          <article className="feature-card">
            <SiteImage
              src="/beth-shalom/assets/beth-shalom-logo.jpeg"
              alt=""
              width={64}
              height={64}
              loading="lazy"
            />
            <h3>PMGM Abhayabhavan Charitable Society</h3>
            <p>
              The registered charitable society responsible for Beth Shalom
              under the auspices of the Malankara Orthodox Syrian Church Diocese
              of Kottayam.
            </p>
          </article>
          <article className="feature-card" data-organization-placeholder="">
            <span
              className="material-symbols-outlined custodian-placeholder"
              aria-hidden="true"
            >
              corporate_fare
            </span>
            <h3 className="">
              Organization 2 <span className="sr-only">(placeholder)</span>
            </h3>
            <p className="">Name, logo and description pending confirmation.</p>
          </article>
          <article className="feature-card" data-organization-placeholder="">
            <span
              className="material-symbols-outlined custodian-placeholder"
              aria-hidden="true"
            >
              corporate_fare
            </span>
            <h3 className="">
              Organization 3 <span className="sr-only">(placeholder)</span>
            </h3>
            <p className="">Name, logo and description pending confirmation.</p>
          </article>
          <article className="feature-card" data-organization-placeholder="">
            <span
              className="material-symbols-outlined custodian-placeholder"
              aria-hidden="true"
            >
              corporate_fare
            </span>
            <h3 className="">
              Organization 4 <span className="sr-only">(placeholder)</span>
            </h3>
            <p className="">Name, logo and description pending confirmation.</p>
          </article>
          <article className="feature-card" data-organization-placeholder="">
            <span
              className="material-symbols-outlined custodian-placeholder"
              aria-hidden="true"
            >
              corporate_fare
            </span>
            <h3 className="">
              Organization 5 <span className="sr-only">(placeholder)</span>
            </h3>
            <p className="">Name, logo and description pending confirmation.</p>
          </article>
          <article className="feature-card" data-organization-placeholder="">
            <span
              className="material-symbols-outlined custodian-placeholder"
              aria-hidden="true"
            >
              corporate_fare
            </span>
            <h3 className="">
              Organization 6 <span className="sr-only">(placeholder)</span>
            </h3>
            <p className="">Name, logo and description pending confirmation.</p>
          </article>
          <article className="feature-card" data-organization-placeholder="">
            <span
              className="material-symbols-outlined custodian-placeholder"
              aria-hidden="true"
            >
              corporate_fare
            </span>
            <h3 className="">
              Organization 7 <span className="sr-only">(placeholder)</span>
            </h3>
            <p className="">Name, logo and description pending confirmation.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
export function AboutContent() {
  return (
    <main className="w-full bg-surface">
      <div className="flex flex-col w-full">
        <HeritageNavigation />
        <AboutHero />
        <SacredHeritage />
        <FoundingVision />
        <Testimony />
        <CarePillars />
        <HilltopCampus />
        <Leadership />
        <Custodianship />
      </div>
    </main>
  );
}
