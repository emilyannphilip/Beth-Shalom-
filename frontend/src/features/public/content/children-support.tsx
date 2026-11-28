import { childrenSupportTopic } from "../enquiry-api";
import { RequestAction } from "../requests";
import { SiteImage } from "../site-image";

export function ChildrenSupportSection() {
  return (
    <section
      id="home-children-support"
      className="home-refresh bg-surface"
      aria-labelledby="home-children-support-title"
    >
      <div className="home-refresh-inner">
        <div className="grid items-center gap-7 rounded-[1.75rem] border border-outline-variant/50 bg-surface-container-low p-5 shadow-sm sm:gap-9 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div className="min-w-0">
            <h2
              id="home-children-support-title"
              className="font-headline-lg text-headline-lg-mobile text-primary md:text-headline-lg"
            >
              {childrenSupportTopic}
            </h2>
            <p className="mt-4 font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Beth Shalom is committed to a safe, inclusive living environment
              where differently-abled children and their parents feel welcome
              and supported. We discuss each child’s individual requirements
              with their family so that care can be shaped around their needs.
            </p>
            <dl className="mt-6 space-y-4 border-l-2 border-secondary-container pl-4">
              <div>
                <dt className="font-label-md text-label-md font-semibold text-primary">
                  Independent dormitories
                </dt>
                <dd className="mt-1 font-body-md text-body-md text-on-surface-variant">
                  Explore Beth Shalom’s independent dormitory accommodation and
                  discuss living arrangements for your family.
                </dd>
              </div>
              <div>
                <dt className="font-label-md text-label-md font-semibold text-primary">
                  Transparent admissions
                </dt>
                <dd className="mt-1 font-body-md text-body-md text-on-surface-variant">
                  A consultation helps families understand admission and discuss
                  personalized monthly care contributions based on care needs
                  and the family’s economic background.
                </dd>
              </div>
            </dl>
            <RequestAction
              kind="children-support"
              className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-full bg-primary px-7 font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
            >
              Enquire Now
            </RequestAction>
          </div>
          {/* Keep the image alignment and section spacing after removing the caption. */}
          <figure className="min-w-0 pb-[2.05rem] lg:order-first">
            <SiteImage
              src="/beth-shalom/assets/home-children-support-collage.webp"
              alt="Four scenes of children playing, painting, and receiving mobility support indoors and outdoors"
              width={1278}
              height={1230}
              sizes="(min-width: 1280px) 540px, (min-width: 1024px) 45vw, 90vw"
              className="h-auto w-full rounded-[1.25rem]"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
