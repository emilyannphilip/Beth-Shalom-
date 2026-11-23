import Link from "next/link";
import { SiteImage } from "../site-image";
import {
  RoomsProvider,
  RoomPreviewModal,
  RoomFilterButton,
  RoomCard,
  RoomDetailsButton,
  RoomCloseButton,
  RoomValue,
  RoomApplicationButton,
} from "../room-interactions";
function RoomsHero() {
  return (
    <section className="relative w-full bg-surface-container-low px-margin-mobile md:px-margin py-space-xl overflow-hidden">
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
      <div className="absolute left-10 bottom-0 w-80 h-80 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-space-sm">
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                apartment
              </span>{" "}
              Architectural Sanctuaries
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight mb-space-sm">
              Rooms
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Find the perfect space for your comfort, dignity, and peace of
              mind in our geriatric-friendly architectural sanctuary.
              Meticulously engineered with barrier-free circulation, emergency
              nurse summons, and gentle Kerala hillside breezes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 bg-surface-container-lowest p-space-sm rounded-xl shadow-sm self-start lg:self-auto">
            <div className="px-3 py-1.5 rounded-lg bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                Total Categories
              </span>{" "}
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                6 Layouts
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                Floor Access
              </span>{" "}
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                Lifts &amp; Ramps
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                Emergency Link
              </span>{" "}
              <span className="font-headline-sm text-headline-sm text-tertiary font-bold">
                24/7 Ward Station
              </span>
            </div>
          </div>
        </div>
        <div
          className="mt-space-lg pt-space-md flex flex-wrap items-center gap-2"
          id="living-filter-group"
        >
          <RoomFilterButton
            className="filter-tab active-filter min-h-[44px] px-5 py-2 rounded-full font-label-md text-label-md bg-primary text-on-primary shadow-sm transition-all duration-200 cursor-pointer"
            data-filter="all"
            type="button"
            filter="all"
          >
            All Spaces (6)
          </RoomFilterButton>
          <RoomFilterButton
            className="filter-tab min-h-[44px] px-5 py-2 rounded-full font-label-md text-label-md bg-surface-container hover:bg-surface-container-high text-on-surface transition-all duration-200 cursor-pointer"
            data-filter="studio"
            type="button"
            filter="studio"
          >
            Studios (Nest, Heaven)
          </RoomFilterButton>
          <RoomFilterButton
            className="filter-tab min-h-[44px] px-5 py-2 rounded-full font-label-md text-label-md bg-surface-container hover:bg-surface-container-high text-on-surface transition-all duration-200 cursor-pointer"
            data-filter="1bed"
            type="button"
            filter="1bed"
          >
            1-Bedroom (Aura, Vista)
          </RoomFilterButton>
          <RoomFilterButton
            className="filter-tab min-h-[44px] px-5 py-2 rounded-full font-label-md text-label-md bg-surface-container hover:bg-surface-container-high text-on-surface transition-all duration-200 cursor-pointer"
            data-filter="suite"
            type="button"
            filter="suite"
          >
            Suites (Harmony, Grande)
          </RoomFilterButton>
        </div>
      </div>
    </section>
  );
}

function RoomCatalogue() {
  return (
    <section className="w-full px-margin-mobile md:px-margin py-space-xl max-w-7xl mx-auto">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg"
        id="spaces-grid"
      >
        <RoomCard
          className="space-card group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          data-category="studio"
          as="div"
          category="studio"
        >
          <div className="relative h-60 w-full overflow-hidden">
            <SiteImage
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="A warm sun-drenched senior single studio retirement bedroom interior in Kerala style with teak wood accents, an ergonomic orthopedic bed, wide private balcony overlooking lush green tropical palm treetops, grab rails, and subtle soothing beige and sage walls."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRtvUG0FuIR42NgWoqFqHmu2sFLxCJPNl564CEnV03RLi7z2IGBkaRoraguIjgzUFP_UNXGDzbl2rotdMx0j1c2pZGpDFANrV4jIbJr8U0I2efB8qS0wnbkrXqE3llWCI_TONWt0jzthAQg_pA9cKjYISgKTVCp2atsMhI-NjygfeHmuu1vcT0PNRy2HVw9pGlrugYGJCsjWt6l-FYsGCoznRfbAZzflSnTlZJTQ"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                Studio Single Living
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-primary">
              <div>
                <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider block font-semibold">
                  Level 3
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold">
                  Nest
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-semibold">
                16 Units Built
              </span>
            </div>
          </div>
          <div className="p-space-md flex-1 flex flex-col justify-between">
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                Cozy and thoughtfully designed for peaceful, independent living
                with zero trip hazards and intimate privacy.
              </p>
              <div className="mb-space-md">
                <span className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-wider block mb-2">
                  Room Features
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Anti-slip bath with European water closet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Private scenic balcony</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>24/7 Emergency call bell at bedside</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Geriatric safety grab rails installed</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-space-sm flex flex-col sm:flex-row gap-2">
              <RoomDetailsButton
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                type="button"
                room={{
                  title: "Nest Suite",
                  category: "Studio Single Living (3rd Floor)",
                  units: "16 Units Built / Launch Planned",
                  description:
                    "Nest provides an autonomous sanctuary tailored for an individual resident wanting quiet serenity without housekeeping burdens. It includes custom non-reflective ambient lighting, sound-insulated glazed balcony doors, and immediate reach to floor elevator banks.",
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  info
                </span>{" "}
                Details
              </RoomDetailsButton>
              <Link
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                href="/rooms/visualizer"
                prefetch={false}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                Explore 3D Plan
              </Link>
            </div>
          </div>
        </RoomCard>
        <RoomCard
          className="space-card group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          data-category="studio"
          as="div"
          category="studio"
        >
          <div className="relative h-60 w-full overflow-hidden">
            <SiteImage
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="A bright and airy studio plus retirement apartment suite with an open kitchenette, polished natural stone breakfast counter, large floor-to-ceiling windows showing tropical trees, ergonomic lounge armchair, warm Kerala timber finishings, and neutral earth tones."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDusRpci5ZjJ9HBFUnrfvigLODSf3UmFVaYbOE1qlecESXgrq8ZFSbJxccPlYx3SlNTsAK4UHUtCcxE7e2wxinQDXX2PD7wvCenjOzTAtVCXMXBEANzxuIliKOWqMgYPjSZSp3SDV3H8oxTAXAqZxKyrbOR9v3RkXxPOZ1Y_2mDPW0ZO2r85xpPJZov5dsFuIpoZZEze3hzUlh7oTzPt-GvzfZKjx4XR582HNyJwQ"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                Studio+ Living Space
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-primary">
              <div>
                <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider block font-semibold">
                  Level 2
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold">
                  Heaven
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-secondary font-label-sm text-label-sm font-semibold">
                4 Units Available
              </span>
            </div>
          </div>
          <div className="p-space-md flex-1 flex flex-col justify-between">
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                A bright, airy retreat balancing modern comforts with serene
                surroundings, equipped with a handy tea-making kitchenette.
              </p>
              <div className="mb-space-md">
                <span className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-wider block mb-2">
                  Room Features
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Generous sit-out balcony</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Compact open pantry kitchenette</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Wheelchair-accessible bath with toilet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Extra-wide hallway and doorways</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-space-sm flex flex-col sm:flex-row gap-2">
              <RoomDetailsButton
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                type="button"
                room={{
                  title: "Heaven Studio+",
                  category: "Studio+ Living Space (2nd Floor)",
                  units: "4 Units Available",
                  description:
                    "Heaven suites add pantry autonomy with safety induction capability, recessed cabinetry handles preventing robe snags, and broad balcony access ideal for morning contemplation and gentle breeze intake.",
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  info
                </span>{" "}
                Details
              </RoomDetailsButton>
              <Link
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                href="/rooms/visualizer"
                prefetch={false}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                Explore 3D Plan
              </Link>
            </div>
          </div>
        </RoomCard>
        <RoomCard
          className="space-card group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          data-category="1bed"
          as="div"
          category="1bed"
        >
          <div className="relative h-60 w-full overflow-hidden">
            <SiteImage
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="An elegant 1 bedroom retirement apartment with separate comfortable living parlor, upholstered recliner armchairs, hardwood low coffee table, connected open kitchen, private bedroom visible through wide wooden archway, sunlit window overlooking Kottayam garden courtyard."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEQIwi3ZQTraYEA1F3-dW6Sb_LK4T8UTifOFjo4u2Gfv5tk8bniyV3fK87yiW5nwCip_CJcsZqgF7Mg5Osfv_eyHOMUgiW8brNHC8qMS-FM7L8uYOiMCqTzQP6eLHacvOdQSCxtmdLR_CDxzciBk0eDExrNrU9z0onpOfge55mSL4pfh3BXd10PDE012kJ7KHn18nqlaYJIR2MDOZQ6IcBhdnoecwZAl13-YWTZg"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                1 Bed Living Space
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-primary">
              <div>
                <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider block font-semibold">
                  Levels 1 &amp; 2
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold">
                  Aura
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-semibold">
                2 Units Available
              </span>
            </div>
          </div>
          <div className="p-space-md flex-1 flex flex-col justify-between">
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                Dedicated room separations create a truly homely atmosphere for
                singles or couples craving distinct living and sleeping domains.
              </p>
              <div className="mb-space-md">
                <span className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-wider block mb-2">
                  Room Features
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Fully partitioned master bedroom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Relaxing panoramic veranda / balcony</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Dedicated kitchen utility space</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Independent living &amp; guest seating area</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-space-sm flex flex-col sm:flex-row gap-2">
              <RoomDetailsButton
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                type="button"
                room={{
                  title: "Aura 1-Bedroom",
                  category: "Levels 1 & 2 Residences",
                  units: "2 Units Available",
                  description:
                    "Aura offers residential distinction where visitors can be received warmly in the salon area without disturbing the privacy of the sleeping sanctuary. Fitted with low pile acoustic rugs and anti-slip bath floor.",
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  info
                </span>{" "}
                Details
              </RoomDetailsButton>
              <Link
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                href="/rooms/visualizer"
                prefetch={false}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                Explore 3D Plan
              </Link>
            </div>
          </div>
        </RoomCard>
        <RoomCard
          className="space-card group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          data-category="1bed"
          as="div"
          category="1bed"
        >
          <div className="relative h-60 w-full overflow-hidden">
            <SiteImage
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="A modern 1 bedroom senior residence with wide glass sliding doors opening to an expansive lush garden terrace overlooking Pampady rubber plantations, comfortable warm living room sofa set, fully accessible en-suite washroom with support bars, soft morning natural light."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnjaULLJKn2ijZG7BDCFdsLFxptgdi4vmKST7bUYksvgCt_09-iaYQ__ofsmN86bmFIhP-N1GOImLtU-tgPNpf2uN-Nh6gXOenBI3pz9Yp9_mQYKC_k5HkTS3fjVoIQc-Kng7Nwy3YRyIogeRK7R6IEFxokvWyUta-9JOB8XCOFzvRCXTUgPiDcGVMesF2zu64J3jAE_0KPcoqaM7fK25vXu5bQbTlhe39IRS29g"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                1 Bed Garden Living
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-primary">
              <div>
                <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider block font-semibold">
                  Level 1 (Ground Proximity)
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold">
                  Vista
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-secondary font-label-sm text-label-sm font-semibold">
                4 Units Available
              </span>
            </div>
          </div>
          <div className="p-space-md flex-1 flex flex-col justify-between">
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                A complete and highly functional layout with beautiful open
                garden views and quick, step-free access to central community
                dining.
              </p>
              <div className="mb-space-md">
                <span className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-wider block mb-2">
                  Room Features
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Spacious bedroom with garden vista</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Accessible en-suite bath with grab bars</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Expansive open kitchenette &amp; living space</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Scenic shaded sit-out balcony</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-space-sm flex flex-col sm:flex-row gap-2">
              <RoomDetailsButton
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                type="button"
                room={{
                  title: "Vista Living Space",
                  category: "1st Floor Garden Level",
                  units: "4 Units Available",
                  description:
                    "Positioned on the primary residential tier for minimal lift dependence, Vista offers tranquil botanical views, cross-ventilation designed to minimize air-conditioning needs, and expansive wardrobe storage.",
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  info
                </span>{" "}
                Details
              </RoomDetailsButton>
              <Link
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                href="/rooms/visualizer"
                prefetch={false}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                Explore 3D Plan
              </Link>
            </div>
          </div>
        </RoomCard>
        <RoomCard
          className="space-card group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          data-category="suite"
          as="div"
          category="suite"
        >
          <div className="relative h-60 w-full overflow-hidden">
            <SiteImage
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="An expansive luxury senior suite featuring dual private balconies overlooking Kerala estate hills, large dining and lounge hall, warm recessed ceiling LED illumination, two well-appointed modern bathrooms, warm earth-toned upholstery and polished terracotta tile accents."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7YOv-wCW-br_k4henGWsWacrs6FLUv_2RwcN6jaGWKxPG9uHeelARLwKTolf_hgeDd4V3n-_TNL4ZHEPKMHhPNUTJoPjSD1tMfuBUJ6RawURMuUIfshSEvW2ifzEH4FU5APzDb6J0saaXRW9HOsNU-HnvFhIELOQVzDwAGqeEISSG8Pciaub8dWbwlpCAOifs6fu157iokllKdxs3U9uYlnv6RzgPaF7EGOuYmA"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider shadow-sm font-bold">
                Suite Living Space
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-primary">
              <div>
                <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider block font-semibold">
                  Levels 1 &amp; 2
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold">
                  Harmony
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-semibold">
                4 Units Available
              </span>
            </div>
          </div>
          <div className="p-space-md flex-1 flex flex-col justify-between">
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                Expansive suite living with generous proportions, dual outdoor
                access, and full dual bathroom facilities for visiting family.
              </p>
              <div className="mb-space-md">
                <span className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-wider block mb-2">
                  Room Features
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>2 Baths with senior-safe toilets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>2 Independent private balconies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Full open kitchenette &amp; pantry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Generous living &amp; formal dining salon</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-space-sm flex flex-col sm:flex-row gap-2">
              <RoomDetailsButton
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                type="button"
                room={{
                  title: "Harmony Suite",
                  category: "Multi-room Suite (Levels 1 & 2)",
                  units: "4 Units Available",
                  description:
                    "Perfect for couples or seniors who host visiting children and grandchildren. Accommodates separate day lounge and restful bedtime sanctuary, complemented by secondary guest restroom.",
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  info
                </span>{" "}
                Details
              </RoomDetailsButton>
              <Link
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                href="/rooms/visualizer"
                prefetch={false}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                Explore 3D Plan
              </Link>
            </div>
          </div>
        </RoomCard>
        <RoomCard
          className="space-card group flex flex-col bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          data-category="suite"
          as="div"
          category="suite"
        >
          <div className="relative h-60 w-full overflow-hidden">
            <SiteImage
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              data-alt="A magnificent grand premium senior suite with sprawling timber ceilings, floor-to-ceiling glass wrapping around corner panoramic views of church spires and verdant coconut groves, designer seating area, bespoke dining table, and premium warm lighting."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhuvFMZrWYlUAiCBSUaeB80CMgCOsYjDeCRQ_et00AxcaGuXnOsQere4sREMr4H3mk2c6tA45FgKmDX1MrVwMXaeVAYrruXgxddQeJRjJz8XA6po9C4waVk_wUvydWQyC42fD_hNt28gDL2JiPJIoiYu_81ZDUniA6vASGEtyPq7O20dqjw9_8_a-A4i1SWIE9JpM5iqpd4dfjRdApujCsZmt0_ISlDmA6sEO3qQ"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider shadow-sm font-bold">
                Crown Jewel Suite
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-primary">
              <div>
                <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider block font-semibold">
                  Level 1 (Premium Corner)
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold">
                  Grande
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-semibold">
                2 Units Available
              </span>
            </div>
          </div>
          <div className="p-space-md flex-1 flex flex-col justify-between">
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                Our crown jewel — the most spacious and refined offering in the
                home, crafted for peerless ease, dignity, and elevated living.
              </p>
              <div className="mb-space-md">
                <span className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-wider block mb-2">
                  Room Features
                </span>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Expansive primary living &amp; dining hall</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Open chef-ready breakfast kitchen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>2 Full baths with wheelchair accessibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      aria-hidden="true"
                    >
                      check_circle
                    </span>{" "}
                    <span>Corner panoramic view balconies</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-space-sm flex flex-col sm:flex-row gap-2">
              <RoomDetailsButton
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                type="button"
                room={{
                  title: "Grande Premium Suite",
                  category: "Level 1 Corner Showcase",
                  units: "2 Units Available",
                  description:
                    "Grande suites occupy privileged corner orientations maximizing cross-ventilation and quiet views. Includes bespoke acoustic wall linings, double en-suite amenities, and oversized lounge for prolonged family gatherings.",
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  info
                </span>{" "}
                Details
              </RoomDetailsButton>
              <Link
                className="flex-1 min-h-[48px] px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"
                href="/rooms/visualizer"
                prefetch={false}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                Explore 3D Plan
              </Link>
            </div>
          </div>
        </RoomCard>
      </div>
    </section>
  );
}

function RoomComparison() {
  return (
    <section className="w-full bg-surface-container-low px-margin-mobile md:px-margin py-space-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Quick Reference
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
              Room Category Comparison
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-2 md:mt-0">
            All living spaces are equipped with non-slip anti-fall tilework,
            emergency nurse alarms, and unhindered elevator access.
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface font-label-md text-label-md">
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Floor Level</th>
                  <th className="p-4 font-bold">Bedrooms</th>
                  <th className="p-4 font-bold">Bathrooms</th>
                  <th className="p-4 font-bold">Balcony</th>
                  <th className="p-4 font-bold">Kitchenette</th>
                  <th className="p-4 font-bold">Units Built</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm text-on-surface">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-bold text-primary">Nest</td>
                  <td className="p-4">3rd Floor</td>
                  <td className="p-4">Studio open</td>
                  <td className="p-4">1 En-suite</td>
                  <td className="p-4">1 Private</td>
                  <td className="p-4 text-on-surface-variant">
                    Shared Refreshment Hub
                  </td>
                  <td className="p-4 font-bold text-secondary">16 Units</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-bold text-primary">Heaven</td>
                  <td className="p-4">2nd Floor</td>
                  <td className="p-4">Studio+</td>
                  <td className="p-4">1 En-suite</td>
                  <td className="p-4">1 Private</td>
                  <td className="p-4">Open Kitchenette</td>
                  <td className="p-4 font-bold text-secondary">4 Units</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-bold text-primary">Aura</td>
                  <td className="p-4">1st &amp; 2nd Floors</td>
                  <td className="p-4">1 Dedicated</td>
                  <td className="p-4">1 En-suite</td>
                  <td className="p-4">1 Private</td>
                  <td className="p-4">Full Kitchen Space</td>
                  <td className="p-4 font-bold text-secondary">2 Units</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-bold text-primary">Vista</td>
                  <td className="p-4">1st Floor</td>
                  <td className="p-4">1 Dedicated</td>
                  <td className="p-4">1 En-suite</td>
                  <td className="p-4">1 Garden Veranda</td>
                  <td className="p-4">Open Kitchen Space</td>
                  <td className="p-4 font-bold text-secondary">4 Units</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-bold text-primary">Harmony</td>
                  <td className="p-4">1st &amp; 2nd Floors</td>
                  <td className="p-4">Suite Partitioned</td>
                  <td className="p-4">2 Full Baths</td>
                  <td className="p-4">2 Dual Balconies</td>
                  <td className="p-4">Full Open Kitchen</td>
                  <td className="p-4 font-bold text-secondary">4 Units</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 font-bold text-primary">Grande</td>
                  <td className="p-4">1st Floor</td>
                  <td className="p-4">Master Suite</td>
                  <td className="p-4">2 Full Baths</td>
                  <td className="p-4">Wrap-around Corner</td>
                  <td className="p-4">Full Breakfast Kitchen</td>
                  <td className="p-4 font-bold text-secondary">2 Units</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoomEnquiry() {
  return (
    <section className="w-full px-margin-mobile md:px-margin py-space-xl max-w-7xl mx-auto">
      <div className="bg-surface-container p-space-lg rounded-xl shadow-sm mb-space-lg relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-secondary"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-space-md">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed/40 flex items-center justify-center flex-shrink-0 text-secondary">
            <span
              className="material-symbols-outlined text-[28px]"
              aria-hidden="true"
            >
              policy
            </span>
          </div>
          <div className="flex-1">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold block mb-1">
              Institutional Policy &amp; Admissions Notice
            </span>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              In accordance with institutional policy under PMGM Abhayabhavan
              Charitable Society, public room prices are not published online.
              Unit counts reflect current planned availability. Inquiries and
              admissions are processed directly via our administrative office to
              ensure bespoke care matching and needs evaluation.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-primary text-on-primary rounded-xl p-space-lg md:p-space-xl relative overflow-hidden shadow-lg">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary/30 blur-2xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/30 text-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-space-sm font-semibold">
            <span
              className="material-symbols-outlined text-[16px]"
              aria-hidden="true"
            >
              how_to_reg
            </span>{" "}
            Direct Family &amp; Resident Desk
          </span>
          <h2 className="font-headline-xl text-headline-xl font-bold mb-space-sm">
            Reserve an On-Site Tour or File an Admission Inquiry
          </h2>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim leading-relaxed mb-space-lg">
            Speak with our admission counselors, arrange physical inspections of
            our suites, or discuss individualized assistance needs for aging
            parents and differently-abled family members.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
            <Link
              className="inline-flex items-center justify-center min-h-[52px] px-8 py-3 rounded-full bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-lg text-label-lg font-bold transition-all shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
              data-path="admission-inquiry"
              href="/admission-enquiry"
              prefetch={false}
            >
              <span>Begin Admission Inquiry</span>{" "}
              <span
                className="material-symbols-outlined ml-2 text-[20px]"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </Link>{" "}
            <a
              className="inline-flex items-center justify-center min-h-[52px] px-6 py-3 rounded-full bg-primary-container hover:bg-surface-tint/40 text-on-primary font-label-lg text-label-lg transition-colors"
              href="tel:+918289838745"
            >
              <span
                className="material-symbols-outlined mr-2 text-[20px]"
                aria-hidden="true"
              >
                call
              </span>{" "}
              <span>Direct Call: +91 8289838745</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoomPreview() {
  return (
    <RoomPreviewModal
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm"
      id="space-modal"
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-space-lg shadow-2xl relative max-h-[921px] overflow-y-auto transform transition-all">
        <RoomCloseButton
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none"
          type="button"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            aria-hidden="true"
          >
            close
          </span>
        </RoomCloseButton>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined text-secondary text-[24px]"
            aria-hidden="true"
          >
            architecture
          </span>{" "}
          <span
            className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold"
            id="modal-category"
          >
            <RoomValue field="category" />
          </span>
        </div>
        <h3
          className="font-headline-lg text-headline-lg text-primary mb-2 font-bold"
          id="modal-title"
        >
          <RoomValue field="title" />
        </h3>
        <div
          className="inline-block px-3 py-1 rounded-md bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold mb-4"
          id="modal-units"
        >
          <RoomValue field="units" />
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low mb-space-md">
          <div className="w-full h-48 bg-surface-container flex flex-col items-center justify-center rounded-lg relative overflow-hidden mb-3">
            <svg
              className="w-full h-full text-secondary/30 p-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 400 200"
            >
              <rect
                height="160"
                rx="4"
                strokeDasharray="4 4"
                width="360"
                x="20"
                y="20"
              ></rect>
              <rect
                fill="currentColor"
                fillOpacity="0.05"
                height="130"
                stroke="currentColor"
                strokeWidth="2"
                width="220"
                x="35"
                y="35"
              ></rect>
              <rect
                height="70"
                stroke="currentColor"
                strokeWidth="2"
                width="110"
                x="270"
                y="35"
              ></rect>
              <rect
                height="50"
                stroke="currentColor"
                strokeWidth="2"
                width="110"
                x="270"
                y="115"
              ></rect>
              <circle
                cx="145"
                cy="100"
                fill="currentColor"
                fillOpacity="0.1"
                r="18"
              ></circle>
              <path
                d="M145 70 L145 130 M115 100 L175 100"
                strokeWidth="1.5"
              ></path>
            </svg>
            <span className="absolute bottom-2 right-3 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest/80 px-2 py-0.5 rounded">
              Architectural Rendering • Scaled
            </span>
          </div>
          <p
            className="font-body-md text-body-md text-on-surface leading-relaxed"
            id="modal-desc"
          >
            <RoomValue field="description" />
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-space-sm pt-2">
          <RoomApplicationButton
            type="button"
            data-request-kind="room"
            aria-haspopup="dialog"
            className="flex-1 min-h-[52px] px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              aria-hidden="true"
            >
              assignment
            </span>{" "}
            Apply for This Room Category
          </RoomApplicationButton>
          <RoomCloseButton
            className="min-h-[52px] px-6 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors"
            type="button"
          >
            Close Preview
          </RoomCloseButton>
        </div>
      </div>
    </RoomPreviewModal>
  );
}
export function RoomsContent() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full">
        <RoomsProvider>
          <RoomsHero />
          <RoomCatalogue />
          <RoomComparison />
          <RoomEnquiry />
          <RoomPreview />
        </RoomsProvider>
      </div>
    </main>
  );
}
