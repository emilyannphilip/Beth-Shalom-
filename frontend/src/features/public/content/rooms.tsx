import Link from "next/link";
import {
  AccommodationComparisonRows,
  AccommodationCount,
  RoomCatalogue,
  RoomFilters,
} from "../room-catalogue";
import {
  RoomsProvider,
  RoomPreviewModal,
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
                <AccommodationCount />
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
        <RoomFilters />
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
                  <th className="p-4 font-bold">Total rooms</th>
                  <th className="p-4 font-bold">Vacant rooms</th>
                  <th className="p-4 font-bold">Remaining places</th>
                  <th className="p-4 font-bold">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm text-on-surface">
                <AccommodationComparisonRows />
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
              Unit counts reflect current planned availability. Enquiries and
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
            Reserve an On-Site Tour or File an Admission Enquiry
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
              <span>Begin Admission Enquiry</span>{" "}
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
      <div className="w-full max-w-xl overflow-y-auto bg-surface-container-lowest rounded-xl p-space-lg text-on-surface shadow-xl">
        <h2
          className="font-headline-lg text-headline-lg text-primary mb-2"
          id="modal-title"
        >
          <RoomValue field="title" />
        </h2>
        <p className="text-body-sm text-secondary">
          <RoomValue field="category" />
        </p>
        <p className="my-4 text-body-md leading-relaxed">
          <RoomValue field="description" />
        </p>
        <p className="text-body-sm">
          <RoomValue field="units" />
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <RoomApplicationButton className="min-h-[48px] px-5 rounded-lg bg-primary text-on-primary font-label-md">
            Apply for This Room Category
          </RoomApplicationButton>
          <RoomCloseButton className="min-h-[48px] px-5 rounded-lg bg-surface-container text-primary font-label-md">
            Close Preview
          </RoomCloseButton>
        </div>
      </div>
    </RoomPreviewModal>
  );
}

export function RoomsContent() {
  return (
    <main className="w-full bg-surface">
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
