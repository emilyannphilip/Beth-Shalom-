"use client";
import { RecordFeedback } from "../record-actions";
import { usePortal } from "../portal-session";
import { PortalFrame } from "../portal-frame";
import { LogoutButton, PortalLink } from "../navigation";
import { PortalSidebar } from "../portal-sidebar";
import { EnquiryWorkspace } from "../enquiry-workspace";

export function AdminDashboard() {
  const { summary } = usePortal();
  return (
    <PortalFrame>
      <PortalSidebar screen="admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-outline-variant px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-headline text-headline-sm text-on-surface">
                Administrative Overview
              </h1>
              <RecordFeedback />
              <p className="text-body-sm text-on-surface-variant">
                Beth Shalom Retirement Home • Real-time Operations &amp; Access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-semibold bg-success-container text-success border border-success/20">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>{" "}
              RBAC Active • Admin Session
            </span>
            <PortalLink
              href="/portal/admin/staff"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-on-primary rounded-md font-label text-label-sm hover:bg-tertiary transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden
              >
                person_add
              </span>
              <span>New Staff</span>
            </PortalLink>
            <PortalLink
              href="/portal/admin/residents"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary text-on-secondary rounded-md font-label text-label-sm hover:opacity-90 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden
              >
                add_circle
              </span>
              <span>New Resident</span>
            </PortalLink>
            <div className="h-8 w-px bg-outline-variant mx-1"></div>
            <LogoutButton
              type="button"
              title="Sign out of Admin Portal"
              aria-label="Secure Logout"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-variant/40 text-on-surface hover:text-error hover:bg-error-container/40 hover:border-error/30 font-label text-label-sm transition-all focus-visible:ring-2 focus-visible:ring-primary"
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
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline text-headline-sm text-on-surface">
                Operations At a Glance
              </h2>
              <span className="text-body-sm text-on-surface-variant">
                Updated today at 09:45 AM
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Total Staff
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      {summary?.total_staff ?? "—"}
                    </span>
                  </div>
                  <span className="p-2 rounded-lg bg-surface-variant text-primary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      badge
                    </span>
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-body-sm">
                  <span className="text-success font-medium">
                    {summary?.active_staff ?? "—"} Active Accounts
                  </span>
                  <PortalLink
                    href="/portal/admin/staff"
                    className="text-primary hover:underline text-label-sm font-semibold"
                  >
                    Manage
                  </PortalLink>
                </div>
              </article>
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Admitted Residents
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      {summary?.admitted_residents ?? "—"}
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
                    150 Suite Capacity
                  </span>
                  <PortalLink
                    href="/portal/admin/residents"
                    className="text-primary hover:underline text-label-sm font-semibold"
                  >
                    View
                  </PortalLink>
                </div>
              </article>
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Total Enquiries
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      {summary?.total_enquiries ?? "—"}
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
                  <span className="text-info font-medium">All categories</span>
                  <PortalLink
                    href="/portal/admin#enquiries-section"
                    className="text-primary hover:underline text-label-sm font-semibold"
                  >
                    Inspect
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
                      {summary?.pending_enquiries ?? "—"}
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
                    Action Required
                  </span>
                  <PortalLink
                    href="/portal/admin#enquiries-section"
                    className="text-warning hover:underline text-label-sm font-bold"
                  >
                    Review
                  </PortalLink>
                </div>
              </article>
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Submitted Enquiries
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      {summary?.completed_enquiries ?? "—"}
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
                    64% Done
                  </span>
                </div>
              </article>
            </div>
          </section>
          <section className="portal-admin-shortcuts grid grid-cols-1 md:grid-cols-3 gap-4">
            <PortalLink
              href="/portal/admin/staff"
              className="p-4 rounded-xl bg-white border border-outline-variant hover:border-primary transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden
                >
                  manage_accounts
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-headline text-headline-sm text-on-surface group-hover:text-primary transition-colors text-balance">
                  Staff Account Control
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Register staff, reset passwords, change RBAC permissions
                </p>
              </div>
            </PortalLink>
            <PortalLink
              href="/portal/admin/residents"
              className="p-4 rounded-xl bg-white border border-outline-variant hover:border-primary transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden
                >
                  clinical_notes
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-headline text-headline-sm text-on-surface group-hover:text-secondary transition-colors text-balance">
                  Resident Dossiers
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Manage care plans, emergency contacts, room allocations
                </p>
              </div>
            </PortalLink>
            <PortalLink
              href="/portal/admin#enquiries-section"
              className="p-4 rounded-xl bg-white border border-outline-variant hover:border-primary transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-variant text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden
                >
                  assignment_turned_in
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-headline text-headline-sm text-on-surface group-hover:text-primary transition-colors text-balance">
                  Enquiry Submissions
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  5 Categories • Senior admissions, tours, supported living
                </p>
              </div>
            </PortalLink>
          </section>
          <EnquiryWorkspace id="enquiries-section" />
        </main>
      </div>
    </PortalFrame>
  );
}
