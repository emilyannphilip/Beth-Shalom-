import Link from "next/link";
import { PreviewLink } from "../preview-form";
import {
  VisualizerProvider,
  VisualizerButton,
  VisualizerPlan,
  VisualizerClearance,
  VisualizerImage,
  SuiteText,
  VisualizerAvailability,
} from "../visualizer-interactions";
function VisualizerBreadcrumb() {
  return (
    <div className="w-full bg-surface-container-low py-space-sm px-margin-mobile md:px-margin">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-space-sm">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant"
        >
          <Link
            className="hover:text-primary transition-colors flex items-center gap-1"
            data-path="home"
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
          <Link
            className="hover:text-primary transition-colors"
            data-path="rooms"
            href="/rooms"
            prefetch={false}
          >
            Rooms
          </Link>{" "}
          <span className="opacity-40">/</span>{" "}
          <span className="text-primary font-semibold">
            3D Floor Plan Visualizer
          </span>
        </nav>
        <div className="hidden sm:flex items-center gap-space-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>{" "}
            Senior Accessibility Calibrated
          </span>
        </div>
      </div>
    </div>
  );
}

function VisualizerIntro() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-space-lg pb-space-md">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="max-w-3xl flex flex-col gap-space-xs">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm font-semibold tracking-wide uppercase">
            <span
              className="material-symbols-outlined text-[16px]"
              aria-hidden="true"
            >
              architecture
            </span>{" "}
            Architectural Planning &amp; Spatial Ergonomics
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
            Interactive 3D Living Space Visualizer
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Explore senior-friendly layouts, barrier-free clearances, wheelchair
            turning radiuses, and typical furniture arrangements before your
            on-site visit to Beth Shalom.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-space-sm bg-surface-container p-space-sm rounded-xl">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[20px]"
              aria-hidden="true"
            >
              support_agent
            </span>
          </div>
          <div className="flex flex-col font-label-sm text-label-sm">
            <span className="text-on-surface-variant font-medium">
              Assisted Tour Desk
            </span>{" "}
            <a
              className="text-primary font-bold hover:underline"
              href="tel:+918289838745"
            >
              +91 8289838745
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SuiteSelection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pb-space-sm">
      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
          Select Residence Type:
        </span>
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2"
          id="suite-pills-bar"
        >
          <VisualizerButton
            className="suite-pill px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
            data-suite="nest"
            type="button"
            control="nest"
            kind="suite"
          >
            <span>Nest (Studio)</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
              16 Units
            </span>
          </VisualizerButton>
          <VisualizerButton
            className="suite-pill px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
            data-suite="heaven"
            type="button"
            control="heaven"
            kind="suite"
          >
            <span>Heaven (Studio+)</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
              4 Units
            </span>
          </VisualizerButton>
          <VisualizerButton
            className="suite-pill px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
            data-suite="aura"
            type="button"
            control="aura"
            kind="suite"
          >
            <span>Aura (1-Bed)</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
              2 Units
            </span>
          </VisualizerButton>
          <VisualizerButton
            className="suite-pill px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
            data-suite="vista"
            type="button"
            control="vista"
            kind="suite"
          >
            <span>Vista (Garden 1-Bed)</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
              4 Units
            </span>
          </VisualizerButton>
          <VisualizerButton
            className="suite-pill active px-4 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
            data-suite="harmony"
            type="button"
            control="harmony"
            kind="suite"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              aria-hidden="true"
            >
              verified
            </span>{" "}
            <span>Harmony (Suite)</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
              Featured
            </span>
          </VisualizerButton>
          <VisualizerButton
            className="suite-pill px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
            data-suite="grande"
            type="button"
            control="grande"
            kind="suite"
          >
            <span>Grande (Crown Suite)</span>{" "}
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
              2 Units
            </span>
          </VisualizerButton>
        </div>
      </div>
    </section>
  );
}

function PlanInspector() {
  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-sm mb-space-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-sm">
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
            <div
              className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-lg"
              id="view-mode-group"
            >
              <VisualizerButton
                className="px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold transition-colors bg-surface-container-lowest text-primary shadow-xs flex items-center gap-1"
                id="btn-mode-3d"
                type="button"
                control="mode-3d"
                kind="mode"
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  view_in_ar
                </span>{" "}
                <span>3D Cutaway</span>
              </VisualizerButton>
              <VisualizerButton
                className="px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold transition-colors text-on-surface-variant hover:text-primary flex items-center gap-1"
                id="btn-mode-blueprint"
                type="button"
                control="mode-blueprint"
                kind="mode"
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  map
                </span>{" "}
                <span>2D Blueprint</span>
              </VisualizerButton>
              <VisualizerButton
                className="px-3 py-1.5 rounded-md font-label-sm text-label-sm font-semibold transition-colors text-on-surface-variant hover:text-primary flex items-center gap-1"
                id="btn-mode-clearance"
                type="button"
                control="mode-clearance"
                kind="mode"
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  aria-hidden="true"
                >
                  accessible_forward
                </span>{" "}
                <span>Wheelchair Clearance</span>
              </VisualizerButton>
            </div>
            <div className="flex items-center gap-1">
              <VisualizerButton
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
                id="btn-zoom-in"
                title="Zoom In"
                type="button"
                control="zoom-in"
                kind="tool"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  zoom_in
                </span>
              </VisualizerButton>
              <VisualizerButton
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
                id="btn-zoom-out"
                title="Zoom Out"
                type="button"
                control="zoom-out"
                kind="tool"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  zoom_out
                </span>
              </VisualizerButton>
              <VisualizerButton
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
                id="btn-rotate"
                title="Rotate View 90°"
                type="button"
                control="rotate"
                kind="tool"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  rotate_right
                </span>
              </VisualizerButton>
              <VisualizerButton
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
                id="btn-contrast-mode"
                title="High Contrast Mode for Low Vision"
                type="button"
                control="contrast-mode"
                kind="tool"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  contrast
                </span>
              </VisualizerButton>
              <VisualizerButton
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-colors"
                id="btn-reset"
                title="Reset View"
                type="button"
                control="reset"
                kind="tool"
              >
                Reset
              </VisualizerButton>
            </div>
          </div>
          <div
            className="relative w-full aspect-[4/3] md:aspect-[16/11] bg-surface-container-high rounded-xl overflow-hidden shadow-md select-none"
            id="visualizer-stage"
          >
            <div className="absolute top-4 left-4 z-20 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span
                  className="material-symbols-outlined text-[14px]"
                  aria-hidden="true"
                >
                  explore
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm font-bold text-primary">
                  Facing East
                </span>{" "}
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Gentle Morning Sun &amp; Hill Views
                </span>
              </div>
            </div>
            <div className="absolute top-4 right-4 z-20 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <span
                className="material-symbols-outlined text-secondary text-[18px]"
                aria-hidden="true"
              >
                stairs
              </span>{" "}
              <span className="font-label-sm text-label-sm font-semibold text-primary">
                Levels 1 &amp; 2 (Elevator Adjacent)
              </span>
            </div>
            <VisualizerPlan
              className="w-full h-full relative transition-transform duration-300 ease-out origin-center flex items-center justify-center p-4"
              id="zoomable-plan-layer"
            >
              <div className="relative w-full max-w-[620px] aspect-[1/1] rounded-xl overflow-hidden bg-surface-container-lowest shadow-lg">
                <VisualizerImage
                  className="w-full h-full object-cover"
                  data-alt="Detailed architectural 3D cutaway floor plan of the Harmony retirement suite with master bedroom, attached ensuite bathroom with grab bars, open kitchenette, dining niche, living room area, and dual panoramic private sit-out balconies surrounded by lush Kerala greenery in soft morning sunlight, rendered with high tactile realism and muted tones"
                  id="active-floor-image"
                  src="/beth-shalom/assets/design/visualizer-f7d06551680f.webp"
                  alt=""
                />
                <VisualizerClearance
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-85 transition-opacity duration-300"
                  fill="none"
                  id="clearance-svg-layer"
                  viewBox="0 0 600 600"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="210"
                    cy="440"
                    fill="#376847"
                    fillOpacity="0.12"
                    r="50"
                    stroke="#376847"
                    strokeDasharray="6 4"
                    strokeWidth="2.5"
                  ></circle>
                  <text
                    fill="#07241a"
                    fontFamily="Source Sans 3"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    x="210"
                    y="445"
                  >
                    150cm Turn Radius
                  </text>
                  <path
                    d="M 210 500 L 210 260 L 380 260"
                    stroke="#376847"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                  <circle cx="210" cy="500" fill="#376847" r="5"></circle>
                  <circle
                    cx="430"
                    cy="220"
                    fill="#376847"
                    fillOpacity="0.12"
                    r="45"
                    stroke="#376847"
                    strokeDasharray="6 4"
                    strokeWidth="2.5"
                  ></circle>
                  <text
                    fill="#07241a"
                    fontFamily="Source Sans 3"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    x="430"
                    y="224"
                  >
                    Transfer Zone
                  </text>
                  <circle
                    cx="160"
                    cy="180"
                    fill="#ffdf98"
                    fillOpacity="0.15"
                    r="40"
                    stroke="#c19823"
                    strokeDasharray="4 4"
                    strokeWidth="2"
                  ></circle>
                  <text
                    fill="#2a1e00"
                    fontFamily="Source Sans 3"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    x="160"
                    y="184"
                  >
                    Roll-in Radius
                  </text>
                </VisualizerClearance>
                <div
                  className="hotspot-pin absolute top-[28%] left-[26%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  data-hotspot="1"
                >
                  <VisualizerButton
                    aria-label="Inspect Ensuite Bathroom"
                    className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110 focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
                    type="button"
                    control="1"
                    kind="pin"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      bathtub
                    </span>
                  </VisualizerButton>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-3 rounded-lg w-56 shadow-xl z-40 pointer-events-none">
                    <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed mb-1">
                      Ensuite Master Bath
                    </span>{" "}
                    <span className="text-xs leading-relaxed">
                      R11 anti-slip textured tile flooring, zero-threshold
                      roll-in entry, multi-point stainless grab bars &amp;
                      emergency panic pull cord.
                    </span>
                  </div>
                </div>
                <div
                  className="hotspot-pin absolute top-[36%] right-[28%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  data-hotspot="2"
                >
                  <VisualizerButton
                    aria-label="Inspect Master Bedroom"
                    className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110 focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
                    type="button"
                    control="2"
                    kind="pin"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      bed
                    </span>
                  </VisualizerButton>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-3 rounded-lg w-56 shadow-xl z-40 pointer-events-none">
                    <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed mb-1">
                      Bedside Call Support
                    </span>{" "}
                    <span className="text-xs leading-relaxed">
                      Direct 2-way nurse intercom at nightstand, oversized
                      3-foot clearance both sides, motorized bed ready.
                    </span>
                  </div>
                </div>
                <div
                  className="hotspot-pin absolute top-[14%] right-[22%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  data-hotspot="3"
                >
                  <VisualizerButton
                    aria-label="Inspect Veranda Balcony"
                    className="w-8 h-8 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110 focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
                    type="button"
                    control="3"
                    kind="pin"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      balcony
                    </span>
                  </VisualizerButton>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-3 rounded-lg w-56 shadow-xl z-40 pointer-events-none">
                    <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed mb-1">
                      Scenic Hill View Balconies
                    </span>{" "}
                    <span className="text-xs leading-relaxed">
                      Dual private verandas with reinforced 42-inch safety
                      railings overlooking serene Pampady green countryside.
                    </span>
                  </div>
                </div>
                <div
                  className="hotspot-pin absolute bottom-[26%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  data-hotspot="4"
                >
                  <VisualizerButton
                    aria-label="Inspect Kitchenette Pantry"
                    className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110 focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
                    type="button"
                    control="4"
                    kind="pin"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      soup_kitchen
                    </span>
                  </VisualizerButton>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-3 rounded-lg w-56 shadow-xl z-40 pointer-events-none">
                    <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed mb-1">
                      Ergonomic Kitchenette
                    </span>{" "}
                    <span className="text-xs leading-relaxed">
                      Low-reach upper cabinets, non-flame induction hotplate,
                      auto-shutoff safety circuits, and accessible sink depth.
                    </span>
                  </div>
                </div>
                <div
                  className="hotspot-pin absolute bottom-[32%] right-[32%] -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  data-hotspot="5"
                >
                  <VisualizerButton
                    aria-label="Inspect Living Corridor"
                    className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110 focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
                    type="button"
                    control="5"
                    kind="pin"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      aria-hidden="true"
                    >
                      chair
                    </span>
                  </VisualizerButton>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface p-3 rounded-lg w-56 shadow-xl z-40 pointer-events-none">
                    <span className="font-label-sm text-label-sm font-bold text-tertiary-fixed mb-1">
                      Dignified Living Sanctuary
                    </span>{" "}
                    <span className="text-xs leading-relaxed">
                      Spacious floor plate designed for simultaneous walker
                      movement and family visits without clutter.
                    </span>
                  </div>
                </div>
              </div>
            </VisualizerPlan>
            <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-sm text-label-sm shadow-xs">
                <span
                  className="material-symbols-outlined text-secondary text-[16px]"
                  aria-hidden="true"
                >
                  touch_app
                </span>{" "}
                Click pins to inspect geriatric safety amenities
              </span>{" "}
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container-lowest/80 backdrop-blur-sm px-2.5 py-1 rounded-md">
                Scale 1:50 | Geriatric Ready
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <VisualizerButton
              className="hotspot-trigger p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-0.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
              data-target="1"
              type="button"
              control="1"
              kind="hotspot"
            >
              <span className="font-label-sm text-label-sm font-bold text-primary flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  aria-hidden="true"
                >
                  bathtub
                </span>{" "}
                Bath Safety
              </span>{" "}
              <span className="text-xs text-on-surface-variant truncate">
                Grab bars &amp; non-slip
              </span>
            </VisualizerButton>
            <VisualizerButton
              className="hotspot-trigger p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-0.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
              data-target="2"
              type="button"
              control="2"
              kind="hotspot"
            >
              <span className="font-label-sm text-label-sm font-bold text-primary flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  aria-hidden="true"
                >
                  notifications_active
                </span>{" "}
                Bedside Bell
              </span>{" "}
              <span className="text-xs text-on-surface-variant truncate">
                24/7 Ward Intercom
              </span>
            </VisualizerButton>
            <VisualizerButton
              className="hotspot-trigger p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-0.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
              data-target="3"
              type="button"
              control="3"
              kind="hotspot"
            >
              <span className="font-label-sm text-label-sm font-bold text-primary flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  aria-hidden="true"
                >
                  balcony
                </span>{" "}
                Dual Verandas
              </span>{" "}
              <span className="text-xs text-on-surface-variant truncate">
                High guardrails
              </span>
            </VisualizerButton>
            <VisualizerButton
              className="hotspot-trigger p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-0.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
              data-target="4"
              type="button"
              control="4"
              kind="hotspot"
            >
              <span className="font-label-sm text-label-sm font-bold text-primary flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  aria-hidden="true"
                >
                  soup_kitchen
                </span>{" "}
                Kitchenette
              </span>{" "}
              <span className="text-xs text-on-surface-variant truncate">
                Induction &amp; low counters
              </span>
            </VisualizerButton>
            <VisualizerButton
              className="hotspot-trigger p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-left transition-colors flex flex-col gap-0.5 focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim col-span-2 sm:col-span-1"
              data-target="5"
              type="button"
              control="5"
              kind="hotspot"
            >
              <span className="font-label-sm text-label-sm font-bold text-primary flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  aria-hidden="true"
                >
                  accessible_forward
                </span>{" "}
                Roll-In Clearance
              </span>{" "}
              <span className="text-xs text-on-surface-variant truncate">
                Zero step barriers
              </span>
            </VisualizerButton>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
            <div className="flex items-start justify-between gap-space-xs pb-space-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Configured Space
                </span>
                <h2
                  className="font-headline-sm text-headline-sm text-primary"
                  id="spec-suite-title"
                >
                  <SuiteText field="title" />
                </h2>
                <span
                  className="font-body-sm text-body-sm text-on-surface-variant"
                  id="spec-suite-desc"
                >
                  <SuiteText field="description" />
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2.5 py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  <VisualizerAvailability />
                </span>{" "}
                <span className="text-xs text-on-surface-variant mt-1">
                  Levels 1 &amp; 2
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-space-sm rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">
                  Carpet Area
                </span>{" "}
                <span className="font-label-md text-label-md text-primary font-bold">
                  680 Sq. Ft.
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">
                  Occupancy
                </span>{" "}
                <span className="font-label-md text-label-md text-primary font-bold">
                  1 - 2 Residents
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">
                  Bathrooms
                </span>{" "}
                <span className="font-label-md text-label-md text-primary font-bold">
                  2 Bath with Toilets
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant">
                  Outdoor Verandas
                </span>{" "}
                <span className="font-label-md text-label-md text-primary font-bold">
                  2 Private Balconies
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-space-xs">
              <h3 className="font-label-sm text-label-sm font-bold text-primary uppercase tracking-wide">
                Included Room Features
              </h3>
              <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
                <li className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary text-[18px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>Open Kitchenette with Induction Safe Hub</span>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary text-[18px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>Spacious Dedicated Living Lounge Area</span>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary text-[18px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>2 Independent Ensuite Bathrooms with Grab Bars</span>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-secondary text-[18px]"
                    aria-hidden="true"
                  >
                    check_circle
                  </span>{" "}
                  <span>Dual Scenic Balconies Facing Kerala Countryside</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2 p-space-sm rounded-lg bg-surface-container">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  aria-hidden="true"
                >
                  health_and_safety
                </span>
                <h4 className="font-label-sm text-label-sm font-bold text-primary">
                  Geriatric Ergonomics Audit
                </h4>
              </div>
              <div className="flex flex-col gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>Threshold Clearance</span>{" "}
                  <span className="text-primary font-semibold">
                    100% Step-free
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Doorway Width</span>{" "}
                  <span className="text-primary font-semibold">
                    36-inch (Roll-in ready)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Floor Slip Rating</span>{" "}
                  <span className="text-primary font-semibold">
                    DIN 51130 R11 Certified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Nurse Intercom</span>{" "}
                  <span className="text-primary font-semibold">
                    Direct to Station
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-space-xs">
              <PreviewLink
                className="w-full min-h-[48px] px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim"
                href="#visualizer-stage"
                message="The architectural PDF is not available in this preview."
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden="true"
                >
                  download_for_offline
                </span>{" "}
                <span>Download Architectural PDF Plan</span>
              </PreviewLink>{" "}
              <span className="text-center font-label-sm text-label-sm text-on-surface-variant">
                Includes CAD dimensions, switch heights &amp; elevation drawings
              </span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-xs">
            <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm font-bold">
              <span
                className="material-symbols-outlined text-secondary text-[20px]"
                aria-hidden="true"
              >
                verified_user
              </span>{" "}
              <span>Diocese of Kottayam Auspices</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Constructed under the guidance of PMGM Abhayabhavan Charitable
              Society (Reg. No. K. 20 of 1967). Specifically engineered for
              peaceful senior life alongside our dedicated supportive home for
              children with special needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualizerAmenities() {
  return (
    <section className="w-full bg-surface-container-lowest py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Built for Total Peace of Mind
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary mt-1">
              Holistic Amenities Just Beyond Your Door
            </h2>
          </div>
          <Link
            className="text-secondary hover:text-primary font-label-md text-label-md font-semibold inline-flex items-center gap-1 transition-colors"
            data-path="facilities"
            href="/facilities"
            prefetch={false}
          >
            <span>Explore all 12 Campus Facilities</span>{" "}
            <span
              className="material-symbols-outlined text-[16px]"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-space-sm">
          <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                church
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold">
              Devotional Chapel
            </span>{" "}
            <span className="text-xs text-on-surface-variant">
              Daily prayers &amp; mass
            </span>
          </div>
          <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                sports_esports
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold">
              Recreation Area
            </span>{" "}
            <span className="text-xs text-on-surface-variant">
              Carrom, library &amp; chess
            </span>
          </div>
          <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                spa
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold">
              Care Room
            </span>{" "}
            <span className="text-xs text-on-surface-variant">
              Doctor &amp; nurse station
            </span>
          </div>
          <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                fitness_center
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold">
              Geriatric Gym
            </span>{" "}
            <span className="text-xs text-on-surface-variant">
              Physiotherapy guided
            </span>
          </div>
          <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                theater_comedy
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold">
              A/V Theater
            </span>{" "}
            <span className="text-xs text-on-surface-variant">
              Movie screenings &amp; events
            </span>
          </div>
          <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                content_cut
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold">
              Grooming Saloon
            </span>{" "}
            <span className="text-xs text-on-surface-variant">
              In-house hair &amp; care
            </span>
          </div>
          <div className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col items-center text-center gap-2 col-span-2 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                park
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold">
              Central Atrium
            </span>{" "}
            <span className="text-xs text-on-surface-variant">
              Lush botanical courtyard
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualizerVisit() {
  return (
    <section className="w-full bg-primary-container text-on-primary py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-2xl text-center lg:text-left">
            <span className="font-label-sm text-label-sm tracking-wider uppercase text-tertiary-fixed font-bold">
              Personalized Walkthrough
            </span>
            <h2 className="font-headline-lg text-headline-lg tracking-tight text-surface-container-lowest">
              Ready to inspect this living space in person?
            </h2>
            <p className="font-body-md text-body-md text-on-primary-container">
              Schedule an accompanied physical tour with our administration at
              Elakodinji, Pampady. Experience the tranquility, meet our
              healthcare caretakers, and choose your preferred floor placement.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full lg:w-auto">
            <Link
              className="w-full sm:w-auto min-h-[52px] px-space-lg py-3 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-surface-container-lowest transition-all focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
              data-path="admission-inquiry"
              href="/admission-enquiry"
              prefetch={false}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                calendar_month
              </span>{" "}
              <span>Book Physical Site Tour</span>
            </Link>{" "}
            <a
              className="w-full sm:w-auto min-h-[52px] px-space-md py-3 rounded-full bg-primary hover:bg-surface-container-lowest hover:text-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-3 focus:ring-tertiary-fixed-dim"
              href="tel:+918289838745"
            >
              <span
                className="material-symbols-outlined text-[20px]"
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
export function VisualizerContent() {
  return (
    <main className="w-full bg-surface">
      <div className="flex flex-col w-full">
        <VisualizerProvider>
          <VisualizerBreadcrumb />
          <VisualizerIntro />
          <SuiteSelection />
          <PlanInspector />
          <VisualizerAmenities />
          <VisualizerVisit />
        </VisualizerProvider>
      </div>
    </main>
  );
}
