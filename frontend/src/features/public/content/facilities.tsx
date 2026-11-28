import Link from "next/link";
import { SiteImage } from "../site-image";
import { RequestAction } from "../requests";
function FacilitiesIntro() {
  return (
    <section className="relative bg-gradient-to-b from-surface-container-low via-surface to-surface-container-low/40 px-margin-mobile md:px-margin py-space-xl overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant"
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
            Home
          </Link>{" "}
          <span className="opacity-40">/</span>{" "}
          <span className="text-primary font-semibold">
            Facilities &amp; Specialities
          </span>
        </nav>
        <div className="flex flex-wrap items-center gap-space-sm">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold tracking-wide">
            <span
              className="material-symbols-outlined text-[16px]"
              aria-hidden="true"
            >
              verified
            </span>{" "}
            Holistic Care Grounded in Faith, Dignity, and Nature
          </span>{" "}
          <span className="text-on-surface-variant font-label-sm text-label-sm hidden sm:inline">
            Under PMGM Abhayabhavan Charitable Society (Reg. No. K. 20 of 1967)
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
          <div className="lg:col-span-8 flex flex-col gap-space-sm">
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
              Nurturing Mind, Body &amp; Spirit Through World-Class Geriatric
              Facilities
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
              Meticulously planned sanctuary campus nestled across the verdant
              hills of Elakodinji, Pampady. Engineered for universal
              barrier-free mobility, round-the-clock specialized healthcare, and
              lifelong spiritual serenity under the eternal blessings of Pampady
              Thirumeni.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3 bg-surface-container-highest/60 p-space-md rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[24px]"
                  aria-hidden="true"
                >
                  verified_user
                </span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-primary font-bold">
                  100% Barrier-Free
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Designed specifically for elderly and neurodiverse dignity
                </p>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> 24/7
                Ward Nurses
              </span>{" "}
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Emergency Evac Ready
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 flex flex-wrap gap-2 sm:gap-space-xs font-label-md text-label-md">
          <a
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary transition-all duration-200 shadow-sm"
            href="#healthcare"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              medical_services
            </span>{" "}
            Healthcare &amp; Specialized Care
          </a>{" "}
          <a
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary transition-all duration-200 shadow-sm"
            href="#lifestyle"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              church
            </span>{" "}
            Lifestyle &amp; Spiritual Sanctuary
          </a>{" "}
          <a
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary transition-all duration-200 shadow-sm"
            href="#nature"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              nature_people
            </span>{" "}
            Hillside Nature &amp; Agriculture
          </a>{" "}
          <a
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary transition-all duration-200 shadow-sm"
            href="#accessibility"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              accessible
            </span>{" "}
            Campus Engineering &amp; Safety
          </a>
        </div>
      </div>
    </section>
  );
}

function Healthcare() {
  return (
    <section
      className="px-margin-mobile md:px-margin py-space-xl scroll-mt-24"
      id="healthcare"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
              Medical &amp; Compassionate Support
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
              Round-the-Clock Geriatric &amp; Specialized Care
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 text-on-surface-variant font-label-md text-label-md bg-surface-container-low px-4 py-2 rounded-lg">
            <span
              className="material-symbols-outlined text-secondary text-[20px]"
              aria-hidden="true"
            >
              e911_emergency
            </span>{" "}
            Direct 24-hr Emergency Medical Desk Connected
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  vital_signs
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                24/7 Dedicated Care Rooms &amp; Nursing Station
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Equipped with round-the-clock registered geriatric nurses,
                periodic biometrics and vitals monitoring, in-house oxygen
                concentrators, and structured weekly physician clinical
                consults.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Continuous vitals, glucose &amp; ECG tracking
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Oxygen support systems &amp; suction apparatus
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Doctor on call with electronic medical logs
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  diversity_1
                </span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Specialized Residential Disability Wing
                </h3>
                <span className="bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm px-2.5 py-0.5 rounded-full font-bold">
                  Key Mission
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Dedicated, compassionate long-term support for adults and
                children with cerebral palsy, autism, intellectual challenges,
                and multiple disabilities, offering aged parents peaceful
                reassurance.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Special education &amp; sensory integration therapy
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Co-residence options with aging parents
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Lifelong compassionate guardianship assurance
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  fitness_center
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Geriatric Physical Therapy &amp; Senior Gym
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Equipped with senior-friendly hydraulic resistance machinery,
                gait training parallel bars, and rehabilitation benches for
                stroke, arthritis, and orthopedic recovery.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Certified physical therapist individualized sessions
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Anti-fall balance drills &amp; joint mobility regimens
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Wheelchair accessible training spaces
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  emergency
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Tertiary Hospital Tie-Up &amp; Ambulance
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Institutional medical pacts with premier super-specialty
                hospitals in Pampady and Kottayam town. On-premise emergency
                call bells hardwired directly to nurse quarters.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Under-15-minute emergency hospital transfer route
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Dual bedside &amp; washroom pull-cord alarm points
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Dedicated critical-care stretcher elevator access
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  volunteer_activism
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Committed ADL Caretakers &amp; Staff
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Gentle, empathetic staff offering unhurried assistance with
                hygiene, bathing, dressing, medication reminders, mobility
                guidance, and wheelchair transfers.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                High caretaker-to-resident ratio for personalized attention
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Dignified assistance adhering to Christian ethos of love
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Regular staff sensitisation &amp; specialized safety training
              </li>
            </ul>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  assist_walker
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Mobility Appliances &amp; Assistive Aids
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Provision of customized orthotics, active walkers, lightweight
                motorized wheelchairs, anti-decubitus air mattresses, and
                customized rehabilitation equipment.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Complimentary on-site fitting &amp; adjustments
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Ergonomic support cushions &amp; bed rails
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[18px]"
                  aria-hidden="true"
                >
                  check_circle
                </span>{" "}
                Pressure ulcer prevention specialized management
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpiritualAndCommunityLife() {
  return (
    <section
      className="bg-surface-container-low px-margin-mobile md:px-margin py-space-xl scroll-mt-24"
      id="lifestyle"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        <div className="max-w-3xl">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
            Community &amp; Soul Care
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
            Enriching the Soul and Fostering Meaningful Community
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Beth Shalom is built not as an institution, but as a living family
            home. Every space is curated for warmth, social interaction,
            spiritual enrichment, and dignified relaxation.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <SiteImage
                className="w-full h-full object-cover"
                data-alt="A sunlit, serene Christian liturgical prayer chapel and sanctuary room inside a Kerala retirement residence with polished teak wooden altar, quiet prayer pews, stained glass accents casting soft warm rays, clean minimalist aesthetic, high-contrast tranquil sacred space."
                src="/beth-shalom/assets/design/facilities-7a32dc60efd8.webp"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6 text-on-primary">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm px-3 py-1 rounded-full font-bold">
                  Spiritual Heart of Beth Shalom
                </span>
                <h3 className="font-headline-md text-headline-md mt-2 text-on-primary">
                  Consecrated Devotional Chapel &amp; Prayer Room
                </h3>
              </div>
            </div>
            <div className="p-space-md flex flex-col gap-3">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Rooted deeply in the holy legacy of Mar Kuriakose Dayara and
                Pampady Thirumeni. Daily common prayers (Sandhya Namaskaram),
                Sunday Holy Qurbana services, and peaceful personal adoration
                spaces provide profound spiritual solace.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-primary font-label-sm text-label-sm">
                <span className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    schedule
                  </span>{" "}
                  Daily Liturgical Prayers
                </span>{" "}
                <span className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    church
                  </span>{" "}
                  Pastoral Guidance &amp; Confession
                </span>{" "}
                <span className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[18px] text-secondary"
                    aria-hidden="true"
                  >
                    favorite
                  </span>{" "}
                  Open for all Christian traditions
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <SiteImage
                className="w-full h-full object-cover"
                data-alt="Sun-drenched architectural interior central atrium of an Indian senior living facility in Kerala with indoor tropical palm trees, ferns, comfortable teak wood lounge chairs, open skylight casting natural light onto limestone floors, senior citizens relaxing peacefully."
                src="/beth-shalom/assets/design/facilities-373991e1df30.webp"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6 text-on-primary">
                <h3 className="font-headline-md text-headline-md text-on-primary">
                  Sunlit Central Atrium
                </h3>
              </div>
            </div>
            <div className="p-space-md flex flex-col gap-3">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                A breath of natural freshness flowing through all residential
                corridors. The triple-height atrium courtyard delivers natural
                breeze, lush foliage, and bright morning sun.
              </p>
              <div className="pt-2 flex items-center gap-2 text-secondary font-label-sm text-label-sm font-semibold">
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  eco
                </span>{" "}
                Passive cooling, zero-humidity architecture
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  theaters
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                AV Community Theater &amp; Hall
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                A cozy 60-seat auditorium for classic Malayalam movie matinees,
                sacred music performances, Sunday School presentations, and
                vibrant festive celebrations like Onam and Christmas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-2 text-secondary font-label-sm text-label-sm">
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                hearing
              </span>{" "}
              Hearing-loop compatible audio system
            </div>
          </div>
          <div className="lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  content_cut
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                In-House Grooming Saloon
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Dedicated salon offering hygienic haircuts, gentle head
                massages, nail clipping, shaving, and skincare tailored
                specifically for senior residents and special care inmates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-2 text-secondary font-label-sm text-label-sm">
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                spa
              </span>{" "}
              Assisted hygienic personal grooming
            </div>
          </div>
          <div className="lg:col-span-4 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden="true"
                >
                  menu_book
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Recreation &amp; Reading Lounge
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Carrom boards, chess tables, puzzles, and a rich library
                featuring large-print Malayalam daily newspapers, biblical
                commentaries, Christian periodicals, and world classics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-2 text-secondary font-label-sm text-label-sm">
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                visibility
              </span>{" "}
              High-magnification reading lamps installed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NatureAndFarming() {
  return (
    <section
      className="px-margin-mobile md:px-margin py-space-xl scroll-mt-24"
      id="nature"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-xl overflow-hidden shadow-lg h-96 w-full">
              <SiteImage
                className="w-full h-full object-cover"
                data-alt="Panoramic breathtaking aerial perspective of Beth Shalom retirement home in Elakodinji, Pampady, Kerala, surrounded by lush green rubber plantations, tropical palm trees, rolling mist-clad hills, pristine nature, architectural harmony in rustic earth tones under soft golden daylight."
                src="/beth-shalom/assets/design/facilities-b47ea28a844b.webp"
                alt=""
              />
            </div>
            <div className="absolute -bottom-4 right-6 bg-surface-container-lowest shadow-md p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden="true"
                >
                  yard
                </span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-primary font-bold">
                  Pampady Hills
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Clean high-altitude Kerala air
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col gap-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Natural Village Ambience
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
                Kerala Hillside Serenity &amp; Purposeful Engagement
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Unlike congested metropolitan care homes, Beth Shalom is blessed
              with the breathtaking tranquility of Elakodinji. Residents wake up
              to birdsong, gentle valley breezes, and unhurried village sights
              that restore tranquility to mind and heart.
            </p>
            <div className="flex flex-col gap-3">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-[24px] mt-0.5"
                  aria-hidden="true"
                >
                  psychiatry
                </span>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary text-[19px]">
                    Vocational &amp; Horticultural Therapy
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Guided farming activities allowing differently-abled youth
                    and active seniors to cultivate native vegetables, tend to
                    medicinal herbs, and experience therapeutic connection with
                    Mother Earth.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-[24px] mt-0.5"
                  aria-hidden="true"
                >
                  restaurant
                </span>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary text-[19px]">
                    Nutritious Farm-to-Table Kerala Cuisine
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Wholesome traditional Kerala meals prepared with
                    estate-harvested organic produce, tailored with precision
                    for diabetic, renal, hypertensive, and satvik dietary
                    requirements.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary text-[24px] mt-0.5"
                  aria-hidden="true"
                >
                  directions_walk
                </span>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary text-[19px]">
                    Paved Therapeutic Nature Trails
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Gentle, step-free paved pathways with safety handrails
                    meandering through flowering shrubs and shade trees, safely
                    encouraging daily walking exercise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Accessibility() {
  return (
    <section
      className="bg-primary text-on-primary px-margin-mobile md:px-margin py-space-xl scroll-mt-24"
      id="accessibility"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="font-label-sm text-label-sm tracking-widest uppercase text-tertiary-fixed font-bold">
            Uncompromising Safety Standards
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-primary">
            Engineered for Universal Dignity &amp; Security
          </h2>
          <p className="font-body-md text-body-md text-on-primary-container">
            Every corridor, doorway, switchboard, and threshold has been
            purposefully engineered to surpass international geriatric
            barrier-free protocols.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-sm">
          <div className="bg-primary-container p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span
              className="material-symbols-outlined text-tertiary-fixed text-[32px]"
              aria-hidden="true"
            >
              accessible
            </span>
            <p className="font-headline-sm text-headline-sm text-on-primary text-[18px]">
              100% Step-Free
            </p>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Zero floor thresholds with continuous wheelchair ramps
            </p>
          </div>
          <div className="bg-primary-container p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span
              className="material-symbols-outlined text-tertiary-fixed text-[32px]"
              aria-hidden="true"
            >
              elevator
            </span>
            <p className="font-headline-sm text-headline-sm text-on-primary text-[18px]">
              Stretch Lifts
            </p>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Hospital-bed sized automatic rescue elevators
            </p>
          </div>
          <div className="bg-primary-container p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span
              className="material-symbols-outlined text-tertiary-fixed text-[32px]"
              aria-hidden="true"
            >
              bolt
            </span>
            <p className="font-headline-sm text-headline-sm text-on-primary text-[18px]">
              100% Generator
            </p>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Seamless continuous power for all medical concentrators
            </p>
          </div>
          <div className="bg-primary-container p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span
              className="material-symbols-outlined text-tertiary-fixed text-[32px]"
              aria-hidden="true"
            >
              water_drop
            </span>
            <p className="font-headline-sm text-headline-sm text-on-primary text-[18px]">
              RO Water Plant
            </p>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Multi-stage reverse osmosis mineral-tested pure drinking supply
            </p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-primary-container p-space-md rounded-xl flex flex-col items-center text-center gap-2">
            <span
              className="material-symbols-outlined text-tertiary-fixed text-[32px]"
              aria-hidden="true"
            >
              videocam
            </span>
            <p className="font-headline-sm text-headline-sm text-on-primary text-[18px]">
              24/7 Security
            </p>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Complete perimeter monitoring &amp; dedicated security desk
            </p>
          </div>
        </div>
        <div className="bg-primary-container/80 p-space-md rounded-xl flex flex-col lg:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                bathtub
              </span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-primary">
                Geriatric En-Suite Bathrooms
              </h4>
              <p className="font-body-sm text-body-sm text-on-primary-container mt-0.5">
                Anti-skid matte vitrified flooring, stainless steel load-bearing
                grab rails along WC &amp; shower, wall-mounted folding shower
                seats, thermostatic scald-free faucets, and emergency pull
                cords.
              </p>
            </div>
          </div>
          <Link
            className="shrink-0 px-5 py-3 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim font-label-md text-label-md font-bold transition-colors"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            View Room Floorplans
          </Link>
        </div>
      </div>
    </section>
  );
}

function FacilityMatrix() {
  return (
    <section className="px-margin-mobile md:px-margin py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
              Planned Residential Units
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
              Living Space Tier &amp; Facility Matrix
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
            As documented in the official project charter: 16 Single bedrooms,
            14 Double bedrooms, 2 Quadruple suites, plus 2 independent 16-bed
            assisted dormitories.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl shadow-sm bg-surface-container-lowest">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead className="bg-surface-container font-label-md text-label-md text-primary">
              <tr>
                <th className="py-4 px-space-md" scope="col">
                  Suite / Unit Category
                </th>
                <th className="py-4 px-space-md" scope="col">
                  Floor Level
                </th>
                <th className="py-4 px-space-md" scope="col">
                  Bathroom Setup
                </th>
                <th className="py-4 px-space-md" scope="col">
                  Balcony &amp; Kitchen
                </th>
                <th className="py-4 px-space-md" scope="col">
                  Total Inventory
                </th>
                <th className="py-4 px-space-md text-right" scope="col">
                  Enquiry
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-space-md font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                    Nest Suite (Studio)
                  </div>
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  3rd Floor
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  En-suite Geriatric Bath
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Private Balcony
                </td>
                <td className="py-4 px-space-md font-semibold text-secondary">
                  16 Units Available
                </td>
                <td className="py-4 px-space-md text-right">
                  <Link
                    className="inline-flex items-center gap-1 text-secondary font-label-sm font-bold hover:text-primary"
                    data-path="p-07-admission-inquiry"
                    href="/facilities"
                    prefetch={false}
                  >
                    Details{" "}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-space-md font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                    Heaven Residence (Studio+)
                  </div>
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  2nd Floor
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  En-suite Geriatric Bath
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Balcony + Open Kitchenette
                </td>
                <td className="py-4 px-space-md font-semibold text-secondary">
                  4 Units Available
                </td>
                <td className="py-4 px-space-md text-right">
                  <Link
                    className="inline-flex items-center gap-1 text-secondary font-label-sm font-bold hover:text-primary"
                    data-path="p-07-admission-inquiry"
                    href="/facilities"
                    prefetch={false}
                  >
                    Details{" "}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-space-md font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                    Aura Sanctuary (1 Bed Living)
                  </div>
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  1st &amp; 2nd Floors
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  En-suite Geriatric Bath
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Balcony + Kitchen + Living Area
                </td>
                <td className="py-4 px-space-md font-semibold text-secondary">
                  2 Units Available
                </td>
                <td className="py-4 px-space-md text-right">
                  <Link
                    className="inline-flex items-center gap-1 text-secondary font-label-sm font-bold hover:text-primary"
                    data-path="p-07-admission-inquiry"
                    href="/facilities"
                    prefetch={false}
                  >
                    Details{" "}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-space-md font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                    Vista Living (1 Bed Deluxe)
                  </div>
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  1st Floor
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  En-suite Geriatric Bath
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Scenic Balcony + Open Kitchen + Hall
                </td>
                <td className="py-4 px-space-md font-semibold text-secondary">
                  4 Units Available
                </td>
                <td className="py-4 px-space-md text-right">
                  <Link
                    className="inline-flex items-center gap-1 text-secondary font-label-sm font-bold hover:text-primary"
                    data-path="p-07-admission-inquiry"
                    href="/facilities"
                    prefetch={false}
                  >
                    Details{" "}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-space-md font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                    Harmony Retreat (Family Suite)
                  </div>
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  1st &amp; 2nd Floors
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  2 Full Geriatric Baths
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Dual Balconies + Open Kitchen + Living
                </td>
                <td className="py-4 px-space-md font-semibold text-secondary">
                  4 Units Available
                </td>
                <td className="py-4 px-space-md text-right">
                  <Link
                    className="inline-flex items-center gap-1 text-secondary font-label-sm font-bold hover:text-primary"
                    data-path="p-07-admission-inquiry"
                    href="/facilities"
                    prefetch={false}
                  >
                    Details{" "}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-space-md font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>{" "}
                    Grenada Apartment
                  </div>
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  1st Floor
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  2 Full Geriatric Baths
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Expansive Living + Kitchen + 2 Balconies
                </td>
                <td className="py-4 px-space-md font-semibold text-secondary">
                  2 Units Available
                </td>
                <td className="py-4 px-space-md text-right">
                  <Link
                    className="inline-flex items-center gap-1 text-secondary font-label-sm font-bold hover:text-primary"
                    data-path="p-07-admission-inquiry"
                    href="/facilities"
                    prefetch={false}
                  >
                    Details{" "}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors bg-secondary-container/20">
                <td className="py-4 px-space-md font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>{" "}
                    Supportive Care Dormitories
                  </div>
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Dedicated Wings
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  Multi-cubicle Assisted Facilities
                </td>
                <td className="py-4 px-space-md text-on-surface-variant">
                  24/7 Ward Nurse Attendant Station
                </td>
                <td className="py-4 px-space-md font-semibold text-secondary">
                  32 Beds (16 Men / 16 Women)
                </td>
                <td className="py-4 px-space-md text-right">
                  <Link
                    className="inline-flex items-center gap-1 text-secondary font-label-sm font-bold hover:text-primary"
                    data-path="p-07-admission-inquiry"
                    href="/facilities"
                    prefetch={false}
                  >
                    Details{" "}
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function FacilityFloorPlan() {
  return (
    <section className="px-margin-mobile md:px-margin py-space-lg bg-surface-container-low">
      <div className="max-w-7xl mx-auto bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col lg:flex-row items-center gap-space-lg">
        <div className="w-full lg:w-1/2 flex flex-col gap-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
            Thoughtful Spatial Design
          </span>
          <h3 className="font-headline-lg text-headline-lg text-primary">
            Typical Furniture &amp; Suite Ergonomics
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Each private and companion suite is carefully planned according to
            the architectural blueprints shown in the official Beth Shalom
            project dossier. Wide circulation corridors, anti-glare window
            placements, low-threshold sliding balcony partitions, and intuitive
            reach zones ensure senior freedom and zero domestic hazards.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 font-label-sm text-label-sm">
            <span className="px-3 py-1.5 rounded-lg bg-surface-container text-primary flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                straighten
              </span>{" "}
              1200mm Door Clearances
            </span>{" "}
            <span className="px-3 py-1.5 rounded-lg bg-surface-container text-primary flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                power
              </span>{" "}
              Waist-Level Electrical Points
            </span>{" "}
            <span className="px-3 py-1.5 rounded-lg bg-surface-container text-primary flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                wb_sunny
              </span>{" "}
              Cross-Ventilated Natural Light
            </span>
          </div>
        </div>
        <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md">
          <SiteImage
            className="w-full h-80 object-cover"
            data-alt="Clear top-down architectural layout and interior furniture schematic plan of a luxury geriatric suite in Beth Shalom retirement home showing master bedroom, barrier free washroom with safety grab handles, kitchenette, wide balcony with planters and wheelchair turning radius."
            src="/beth-shalom/assets/design/facilities-a4046f1c20aa.webp"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}

function FacilityVisit() {
  return (
    <section className="px-margin-mobile md:px-margin py-space-xl bg-surface">
      <div className="max-w-7xl mx-auto bg-primary-container text-on-primary rounded-xl p-space-lg md:p-space-xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-sm max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-tertiary-fixed text-[24px]"
                aria-hidden="true"
              >
                church
              </span>{" "}
              <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase font-bold tracking-wider">
                PMGM Abhayabhavan Charitable Society
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-primary tracking-tight">
              Experience Beth Shalom in Person
            </h2>
            <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
              We welcome families, sponsors, and prospective residents to walk
              our tranquil grounds at Elakodinji, Pampady. Meet our dedicated
              medical attendants, inspect our suite rooms, and feel the sacred
              peace of this sanctuary.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-on-primary font-label-sm text-label-sm pt-2">
              <span className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-secondary-fixed text-[18px]"
                  aria-hidden="true"
                >
                  place
                </span>{" "}
                Elakodinji, Pampady, Kottayam
              </span>{" "}
              <span className="opacity-40">|</span>{" "}
              <span className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-secondary-fixed text-[18px]"
                  aria-hidden="true"
                >
                  calendar_month
                </span>{" "}
                Tours available 7 days a week
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <RequestAction
              type="button"
              data-request-kind="walkthrough"
              aria-haspopup="dialog"
              className="inline-flex items-center justify-center min-h-[52px] px-space-lg py-3 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim font-label-lg text-label-lg font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-tertiary-fixed"
              kind="walkthrough"
            >
              <span
                className="material-symbols-outlined text-[20px] mr-2"
                aria-hidden="true"
              >
                schedule
              </span>{" "}
              Schedule Campus Walkthrough
            </RequestAction>
            <RequestAction
              kind="facilities"
              className="inline-flex items-center justify-center min-h-[52px] px-space-lg py-3 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-container font-label-lg text-label-lg font-semibold transition-all"
            >
              Enquire About Facilities
            </RequestAction>
            <Link
              className="inline-flex items-center justify-center min-h-[52px] px-space-lg py-3 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-container font-label-lg text-label-lg font-semibold transition-all"
              data-path="p-07-admission-inquiry"
              href="/admission-enquiry"
              prefetch={false}
            >
              <span
                className="material-symbols-outlined text-[20px] mr-2"
                aria-hidden="true"
              >
                description
              </span>{" "}
              Submit Admission Enquiry
            </Link>{" "}
            <a
              className="inline-flex items-center justify-center min-h-[48px] px-space-md py-2.5 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-all text-center"
              href="tel:+918289838745"
            >
              <span
                className="material-symbols-outlined text-[18px] mr-2 text-secondary-fixed"
                aria-hidden="true"
              >
                call
              </span>{" "}
              Call Desk: +91 8289838745
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FacilitiesContent() {
  return (
    <main className="w-full bg-surface">
      <div className="flex flex-col w-full">
        <FacilitiesIntro />
        <Healthcare />
        <SpiritualAndCommunityLife />
        <NatureAndFarming />
        <Accessibility />
        <FacilityMatrix />
        <FacilityFloorPlan />
        <FacilityVisit />
      </div>
    </main>
  );
}
