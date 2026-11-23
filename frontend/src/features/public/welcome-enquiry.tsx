import { PreviewForm } from "./preview-form";
import { WelcomeModal, CloseWelcomeButton } from "./welcome-interactions";
export function WelcomeEnquiry() {
  return (
    <WelcomeModal
      id="enquiry-welcome-modal"
      className="enquiry-backdrop fixed inset-0 z-[110] items-center justify-center p-3 sm:p-6"
    >
      <div className="enquiry-dialog-panel relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_28px_80px_rgba(14,48,37,0.28)] backdrop-blur-2xl">
        <CloseWelcomeButton
          type="button"
          id="enquiry-close"
          aria-label="Close enquiry form"
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 text-primary shadow-md backdrop-blur-xl transition hover:rotate-90 hover:bg-white focus:outline-none focus:ring-2 focus:ring-secondary sm:right-5 sm:top-5"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </CloseWelcomeButton>
        <div className="relative overflow-hidden rounded-t-[1.7rem] bg-gradient-to-br from-[#d8ecdf] via-[#eaf4ed] to-[#cfe5d6] px-6 pb-7 pt-8 text-primary sm:px-9 sm:pb-8 sm:pt-9">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed mb-2">
            A warm welcome to Beth Shalom
          </p>
          <h2
            id="enquiry-title"
            className="font-headline-lg text-headline-lg text-primary pr-10"
          >
            How can we help your family?
          </h2>
          <p
            id="enquiry-intro"
            className="font-body-sm text-body-sm text-primary-fixed-dim mt-2"
          >
            Share a few details and explore care, living spaces or a campus
            visit.
          </p>
        </div>
        <PreviewForm
          id="welcome-enquiry-form"
          className="grid grid-cols-1 gap-x-4 gap-y-4 rounded-b-[1.7rem] bg-gradient-to-b from-[#f7fbf8] to-white p-5 sm:grid-cols-2 sm:gap-y-5 sm:p-8"
          noValidate
          hideAfterValidation
        >
          <label className="flex flex-col gap-1.5 font-label-sm text-label-sm font-semibold text-primary">
            <span className="mb-1 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                person
              </span>
              Full name
            </span>
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              className="min-h-12 w-full rounded-xl border border-[#d8e6de] bg-white/85 px-4 font-body-md text-body-md font-normal text-on-surface shadow-sm transition placeholder:text-on-surface-variant/60 hover:border-secondary/60 focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15"
            />
          </label>
          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface">
            <span className="mb-1 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                call
              </span>
              Phone number
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              pattern={"[0-9+\\(\\)\\s\\-]{8,20}"}
              required
              className="min-h-12 rounded-lg border border-outline-variant bg-white px-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </label>
          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface sm:col-span-2">
            <span className="mb-1 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                mail
              </span>
              Email address
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-h-12 rounded-lg border border-outline-variant bg-white px-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </label>
          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface sm:col-span-2">
            <span className="mb-1 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                subject
              </span>
              Enquiry type
            </span>
            <select
              name="type"
              required
              className="min-h-12 rounded-lg border border-outline-variant bg-white px-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Choose a topic</option>
              <option>Admissions and living spaces</option>
              <option>Care and facilities</option>
              <option>Campus visit</option>
              <option>Other</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface sm:col-span-2">
            <span className="mb-1 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[18px] text-secondary"
                aria-hidden="true"
              >
                chat
              </span>
              Message
            </span>
            <textarea
              name="message"
              required
              minLength={10}
              rows={3}
              className="w-full rounded-xl border border-[#d8e6de] bg-white/85 px-4 py-3 font-body-md text-body-md font-normal text-on-surface shadow-sm transition placeholder:text-on-surface-variant/60 hover:border-secondary/60 focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/15"
            ></textarea>
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c7e4d0] to-[#e1f1e5] px-7 font-label-md text-primary shadow-[0_8px_20px_rgba(30,58,47,0.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(30,58,47,0.3)] focus:outline-none focus:ring-4 focus:ring-secondary/30 active:translate-y-0"
            >
              <span
                className="material-symbols-outlined text-[19px] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                send
              </span>
              Send enquiry
            </button>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Or call{" "}
              <a
                href="tel:+918289838745"
                className="font-semibold text-secondary underline"
              >
                +91 8289838745
              </a>
              .
            </p>
          </div>
        </PreviewForm>
      </div>
    </WelcomeModal>
  );
}
