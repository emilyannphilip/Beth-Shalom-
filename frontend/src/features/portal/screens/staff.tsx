"use client";
import {
  PortalTable,
  TableRows,
  Pagination,
  GridSearch,
  GridSelect,
} from "../grid";
import { PortalFrame, DemoNotice } from "../portal-frame";
import { PortalDialog } from "../portal-dialog";
import { LogoutButton, PortalLink } from "../navigation";
import { StaffEnquiryRow, StaffResidentRow } from "../table-rows";
import { PortalSidebar } from "../portal-sidebar";
import { StaffResidentDialog } from "../resident-dialogs";
import { useEnquiryWorkspace } from "../enquiry-interactions";
import { useStaffResidents } from "../resident-interactions";
import { badges } from "../status-badge";
import type { EnquiryStatus } from "../models";
export function StaffDashboard() {
  const ui = useEnquiryWorkspace("staff");
  const { grid } = ui;
  const readOnly = useStaffResidents();
  return (
    <PortalFrame>
      <PortalSidebar screen="staff" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-outline-variant px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-headline text-headline-sm text-on-surface">
              Staff Operations Portal
            </h1>
            <DemoNotice />
            <p className="text-body-sm text-on-surface-variant">
              Shift Coordinator: Karen Lewis, RN • Read-Only Resident Dossiers
              &amp; Enquiry Submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-semibold bg-surface-variant text-on-surface border border-outline-variant/60">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Role:
              Staff Access (Restricted)
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
              <span className="text-body-sm text-on-surface-variant">
                Shift: 07:00 – 19:00
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <article className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm hover:border-secondary/50 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-md font-label text-on-surface-variant block">
                      Admitted Residents
                    </span>
                    <span className="font-headline text-headline-md text-on-surface tabular-nums mt-1 block">
                      148
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
                    href="/portal/staff#staff-residents-section"
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
                      67
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
                      12
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
                      43
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
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PortalLink
              href="/portal/staff#staff-residents-section"
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
                  <span className="text-label-sm px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-semibold">
                    Read-Only
                  </span>
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
                    Enquiry Follow-ups
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
          <section
            id="staff-enquiries-section"
            className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-outline-variant space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline text-headline-sm text-on-surface">
                      Enquiry Management
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-secondary-container text-secondary">
                      Staff Processing Desk
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    Submit follow-up details, finalize enquiry notes, or adjust
                    status as you consult prospective residents.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline"
                    aria-hidden
                  >
                    search
                  </span>
                  <GridSearch
                    id="staff-enq-search"
                    type="search"
                    placeholder="Search applicant name, phone, or ID..."
                    className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus:ring-1 focus:ring-secondary focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label="Search enquiries"
                    value={grid.search}
                    onValueChange={grid.setSearch}
                  />
                </div>
                <div>
                  <GridSelect
                    id="staff-cat-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label="Enquiry category"
                    value={grid.category}
                    onValueChange={grid.setCategory}
                  >
                    <option value="ALL">All 5 Enquiry Categories</option>
                    <option value="Senior Admission &amp; Room Tour">
                      Senior Admission &amp; Room Tour
                    </option>
                    <option value="Differently-Abled Supported Living">
                      Differently-Abled Supported Living
                    </option>
                    <option value="Detailed Suite &amp; Floor Plan Inspection">
                      Detailed Suite &amp; Floor Plan Inspection
                    </option>
                    <option value="Facilities Enquiry">
                      Facilities Enquiry
                    </option>
                    <option value="General Institutional Walkthrough">
                      General Institutional Walkthrough
                    </option>
                  </GridSelect>
                </div>
                <div>
                  <GridSelect
                    id="staff-stat-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-secondary"
                    aria-label="Enquiry status"
                    value={grid.status}
                    onValueChange={grid.setStatus}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted (Finalized)</option>
                    <option value="Closed">Closed</option>
                  </GridSelect>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <PortalTable className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/70 text-on-surface-variant border-b border-outline-variant font-label text-label-md">
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Enquiry ID
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Applicant Name
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Contact Info
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Category
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Preferred Visit
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold text-right min-w-[130px]"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <TableRows
                  id="staff-enquiries-tbody"
                  className="divide-y divide-outline-variant/60 text-body-sm"
                  rows={grid.visible}
                  columns={7}
                  render={(record) => (
                    <StaffEnquiryRow
                      key={record.id}
                      record={record}
                      open={ui.show}
                    />
                  )}
                />
              </PortalTable>
            </div>
            <div className="p-3.5 border-t border-outline-variant/70 bg-surface/30 flex items-center justify-between text-body-sm text-on-surface-variant">
              <span>
                Showing {grid.range} of {grid.matched.length} enquiries (Staff
                View)
              </span>
              <Pagination
                grid={grid}
                design={{
                  className: "flex items-center gap-1",
                  previous: {
                    label: "Prev",
                    className:
                      "px-2.5 py-1 rounded border border-outline-variant bg-white text-outline disabled:opacity-50",
                  },
                  next: {
                    label: "Next",
                    className:
                      "px-2.5 py-1 rounded border border-outline-variant bg-white hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-secondary",
                  },
                  active:
                    "px-3 py-1 bg-secondary text-white rounded text-label-sm font-semibold",
                  ordinary:
                    "px-2.5 py-1 rounded border border-outline-variant bg-white hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-secondary",
                  slots: [1, 2],
                }}
              />
            </div>
          </section>
          <section
            id="staff-residents-section"
            className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline text-headline-sm text-on-surface">
                    Admitted Residents (Read-Only)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-label-sm font-semibold bg-surface-variant text-on-surface-variant">
                    RBAC: View Only
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  Staff members have read-only access to resident records to
                  consult care plans and emergency details.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-variant/60 text-label-sm text-on-surface-variant flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden
                >
                  lock
                </span>{" "}
                Record creation and profile editing restricted to Administrators
              </div>
            </div>
            <div className="overflow-x-auto">
              <PortalTable className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/70 text-on-surface-variant border-b border-outline-variant font-label text-label-md">
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Resident ID
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Resident Name
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Room / Suite
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Care Requirement Overview
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Emergency Contact
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold text-right min-w-[130px]"
                    >
                      Dossier
                    </th>
                  </tr>
                </thead>
                <TableRows
                  className="divide-y divide-outline-variant/60 text-body-sm"
                  rows={readOnly.rows}
                  columns={6}
                  render={(record) => (
                    <StaffResidentRow
                      key={record.id}
                      record={record}
                      open={readOnly.inspect}
                    />
                  )}
                />
              </PortalTable>
            </div>
          </section>
        </main>
      </div>
      <PortalDialog
        id="staff-enquiry-modal"
        className="p-0 rounded-2xl border border-outline-variant bg-white backdrop:bg-on-surface/40 shadow-2xl max-w-xl w-full"
        open={!!ui.selected}
        dismiss={ui.dismiss}
        aria-labelledby="staff-modal-name"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between pb-4 border-b border-outline-variant">
            <div>
              <div className="flex items-center gap-2">
                <span
                  id="staff-modal-enq-id"
                  className="font-code text-code-md px-2.5 py-0.5 rounded bg-secondary-container text-secondary font-bold"
                >
                  {ui.selected?.id}
                </span>
                <span
                  id="staff-modal-status-badge"
                  className={badges(
                    ui.selected?.status ?? "",
                    "px-2 py-0.5 rounded-full text-label-sm font-semibold bg-warning-container text-warning",
                  )}
                >
                  {ui.selected?.status}
                </span>
              </div>
              <h2
                id="staff-modal-name"
                className="font-headline text-headline-sm text-on-surface mt-1.5"
              >
                {ui.selected?.name}
              </h2>
              <p
                id="staff-modal-category"
                className="text-body-sm text-secondary font-medium"
              >
                {ui.selected?.category}
              </p>
            </div>
            <button
              type="button"
              className="text-outline hover:text-on-surface p-1 focus-visible:ring-2 focus-visible:ring-secondary"
              onClick={ui.dismiss}
              aria-label="Close dialog"
            >
              <span
                className="material-symbols-outlined text-[22px]"
                aria-hidden
              >
                close
              </span>
            </button>
          </div>
          <div className="py-4 space-y-4 text-body-sm">
            <div className="p-3 bg-surface-variant/40 rounded-lg">
              <span className="text-label-sm text-outline block">
                Applicant Note:
              </span>
              <p id="staff-modal-notes" className="text-on-surface mt-0.5">
                {ui.detailNotes}
              </p>
            </div>
            <div>
              <label className="block text-label-md font-label text-on-surface mb-1">
                Update Status
              </label>
              <select
                id="staff-modal-status-select"
                className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-secondary focus-visible:ring-2 focus-visible:ring-secondary"
                value={ui.status}
                onChange={(event) =>
                  ui.setStatus(event.currentTarget.value as EnquiryStatus)
                }
                aria-label="Update enquiry status"
              >
                <option value="New">New</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Submitted">Submitted (Finalized)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-label-md font-label text-on-surface mb-1">
                Staff Remarks &amp; Follow-up Log
              </label>
              <textarea
                id="staff-modal-remarks"
                rows={3}
                placeholder="Enter follow-up notes, consultation summary, or room tour observations..."
                className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-secondary focus-visible:ring-2 focus-visible:ring-secondary"
                value={ui.remarks}
                onChange={(event) => ui.setRemarks(event.currentTarget.value)}
                aria-label="Follow-up remarks"
              ></textarea>
            </div>
          </div>
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <span className="text-body-sm text-outline">
              Logged under Staff Nurse ID: KL-409
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant rounded-md text-label-md text-on-surface-variant hover:bg-surface-variant font-label focus-visible:ring-2 focus-visible:ring-secondary"
                onClick={ui.dismiss}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-secondary text-on-secondary rounded-md text-label-md font-label hover:opacity-90 focus-visible:ring-2 focus-visible:ring-secondary"
                onClick={ui.save}
              >
                Submit Updates
              </button>
            </div>
          </div>
        </div>
      </PortalDialog>
      <StaffResidentDialog
        resident={readOnly.resident}
        dismiss={readOnly.dismiss}
      />
    </PortalFrame>
  );
}
