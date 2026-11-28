"use client";
import { PortalFrame } from "../portal-frame";
import { LogoutButton, PortalLink } from "../navigation";
import { PortalSidebar } from "../portal-sidebar";
import { RecordFeedback } from "../record-actions";
import { usePortal } from "../portal-session";
import { EnquiryWorkspace } from "../enquiry-workspace";

export function StaffDashboard() {
  const { summary, session } = usePortal();
  const total = summary?.total_enquiries ?? 0;
  const submitted = summary?.completed_enquiries ?? 0;
  const pending = summary?.pending_enquiries ?? 0;
  const admitted = summary?.admitted_residents ?? 0;
  const submittedPercent = total ? Math.round((submitted / total) * 100) : 0;
  return (
    <PortalFrame>
      <PortalSidebar screen="staff" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-outline-variant px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-headline text-headline-sm text-on-surface">
              Staff Operations Portal
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              {session?.name} • Resident and Enquiry Management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-semibold bg-surface-variant text-on-surface border border-outline-variant/60">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Role:
              Staff
            </span>
            <div className="h-8 w-px bg-outline-variant mx-1"></div>
            <LogoutButton
              type="button"
              title="Sign out of Staff Portal"
              aria-label="Secure Logout"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-variant/40 text-on-surface hover:text-error hover:bg-error-container/40 hover:border-error/30 font-label text-label-sm transition-all focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <span
                className="material-symbols-outlined text-[18px] text-error"
                aria-hidden
              >
                logout
              </span>
              <span className="font-semibold">Logout</span>
            </LogoutButton>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          <RecordFeedback />
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline text-headline-sm text-on-surface">
                  Care &amp; Enquiries Overview
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Monitoring resident occupancy and incoming admission
                  consultations
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-secondary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Admitted Residents
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      {admitted}
                    </span>
                  </div>
                  <span className="p-2 rounded-lg bg-primary-container text-primary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      elderly
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-body-sm">
                  <span className="text-on-surface-variant">
                    Read-only Profiles
                  </span>
                  <PortalLink
                    href="/portal/staff/residents"
                    className="text-secondary hover:underline text-label-sm font-semibold"
                  >
                    Inspect List
                  </PortalLink>
                </div>
              </article>
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-secondary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Total Enquiries
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      {total}
                    </span>
                  </div>
                  <span className="p-2 rounded-lg bg-info-container text-info">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      mark_email_unread
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-body-sm">
                  <span className="text-info font-medium">
                    All 5 Categories
                  </span>
                  <PortalLink
                    href="/portal/staff#staff-enquiries-section"
                    className="text-secondary hover:underline text-label-sm font-semibold"
                  >
                    View All
                  </PortalLink>
                </div>
              </article>
              <article className="bg-white border border-warning/40 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-warning-container block font-semibold">
                      Pending Enquiries
                    </span>
                    <span className="font-headline text-headline-md text-warning tabular-nums mt-1 block">
                      {pending}
                    </span>
                  </div>
                  <span className="p-2 rounded-lg bg-warning-container text-warning">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      pending_actions
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-body-sm">
                  <span className="text-on-warning-container text-label-sm font-semibold">
                    Staff Action Required
                  </span>
                  <PortalLink
                    href="/portal/staff#staff-enquiries-section"
                    className="text-warning hover:underline text-label-sm font-bold"
                  >
                    Follow Up
                  </PortalLink>
                </div>
              </article>
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-secondary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Submitted Enquiries
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      {submitted}
                    </span>
                  </div>
                  <span className="p-2 rounded-lg bg-success-container text-success">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      task_alt
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-body-sm">
                  <span className="text-success font-medium">
                    Finalized &amp; Archived
                  </span>
                  <span className="text-on-surface-variant text-label-sm font-medium">
                    {submittedPercent}% Done
                  </span>
                </div>
              </article>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PortalLink
              href="/portal/staff/residents"
              className="p-4 rounded-xl bg-white border border-outline-variant hover:border-secondary transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden
                >
                  elderly
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-headline-sm text-on-surface group-hover:text-primary transition-colors text-balance">
                    Resident Directory
                  </h3>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  View resident profiles, room suites, emergency contacts, and
                  care instructions
                </p>
              </div>
            </PortalLink>
            <PortalLink
              href="/portal/staff#staff-enquiries-section"
              className="p-4 rounded-xl bg-white border border-outline-variant hover:border-secondary transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden
                >
                  contact_mail
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-headline-sm text-on-surface group-hover:text-secondary transition-colors text-balance">
                    Enquiry Management
                  </h3>
                  <span className="text-label-sm px-2 py-0.5 rounded bg-success-container text-success font-semibold">
                    Active Access
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  Inspect website queries, update status, add follow-up notes,
                  and schedule tours
                </p>
              </div>
            </PortalLink>
          </section>
          <EnquiryWorkspace id="staff-enquiries-section" />
        </main>
      </div>
    </PortalFrame>
  );
}
