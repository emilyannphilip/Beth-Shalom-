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
import { AdminEnquiryRow } from "../table-rows";
import { PortalSidebar } from "../portal-sidebar";
import { useEnquiryWorkspace } from "../enquiry-interactions";
import { badges } from "../status-badge";
import type { EnquiryStatus } from "../models";
export function AdminDashboard() {
  const ui = useEnquiryWorkspace("admin");
  const { grid } = ui;
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
              <DemoNotice />
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
                      34
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
                    32 Active Accounts
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
          <section
            id="enquiries-section"
            className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-outline-variant space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline text-headline-md text-on-surface">
                      Enquiry Management
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-primary-container text-primary">
                      All 5 Categories
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    Filter, inspect details, append internal remarks, and submit
                    finalized enquiry records.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-md text-label-md text-on-surface hover:bg-surface-variant font-label transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={ui.download}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden
                    >
                      download
                    </span>
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline"
                    aria-hidden
                  >
                    search
                  </span>
                  <GridSearch
                    id="enquiry-search"
                    type="search"
                    placeholder="Search applicant or ID..."
                    className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Search enquiries"
                    value={grid.search}
                    onValueChange={grid.setSearch}
                  />
                </div>
                <div>
                  <GridSelect
                    id="category-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Enquiry category"
                    value={grid.category}
                    onValueChange={grid.setCategory}
                  >
                    <option value="ALL">All Categories</option>
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
                    id="status-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Enquiry status"
                    value={grid.status}
                    onValueChange={grid.setStatus}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Closed">Closed</option>
                  </GridSelect>
                </div>
                <div>
                  <GridSelect
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-primary"
                    id="enquiry-sort"
                    aria-label="Sort enquiries"
                    value={grid.sort}
                    onValueChange={grid.setSort}
                  >
                    <option value="newest">Sort: Newest Enquiry Date</option>
                    <option value="visit">Sort: Preferred Visit Date</option>
                    <option value="priority">Sort: Priority Level</option>
                  </GridSelect>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <PortalTable
                id="enquiries-table"
                className="w-full text-left border-collapse"
              >
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
                      Enquiry Date
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
                  id="enquiries-tbody"
                  className="divide-y divide-outline-variant/60 text-body-sm"
                  rows={grid.visible}
                  columns={8}
                  render={(record) => (
                    <AdminEnquiryRow
                      key={record.id}
                      record={record}
                      open={ui.show}
                    />
                  )}
                />
              </PortalTable>
            </div>
            <div className="p-4 border-t border-outline-variant/70 bg-surface/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span>
                  Showing{" "}
                  <span className="font-semibold text-on-surface">
                    {grid.range}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-on-surface">
                    {grid.matched.length}
                  </span>{" "}
                  enquiries
                </span>
                <span className="text-outline">
                  | Sample records pagination
                </span>
              </div>
              <Pagination
                grid={grid}
                design={{
                  className: "flex items-center gap-1.5",
                  previous: {
                    label: "Previous",
                    className:
                      "px-3 py-1 rounded border border-outline-variant bg-white text-outline disabled:opacity-50 cursor-not-allowed",
                  },
                  next: {
                    label: "Next",
                    className:
                      "px-3 py-1 rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-primary",
                  },
                  active:
                    "px-3 py-1 rounded bg-primary text-on-primary font-semibold text-label-sm",
                  ordinary:
                    "px-3 py-1 rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-primary",
                  slots: [1, 2, 3, "ellipsis", 14],
                }}
              />
            </div>
          </section>
        </main>
      </div>
      <PortalDialog
        id="enquiry-modal"
        className="p-0 rounded-2xl border border-outline-variant bg-white backdrop:bg-on-surface/40 shadow-2xl max-w-2xl w-full"
        open={!!ui.selected}
        dismiss={ui.dismiss}
        aria-labelledby="modal-enq-name"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between pb-4 border-b border-outline-variant">
            <div>
              <div className="flex items-center gap-2">
                <span
                  id="modal-enq-id"
                  className="font-code text-code-md px-2.5 py-0.5 rounded bg-primary-container text-primary font-bold"
                >
                  {ui.selected?.id}
                </span>
                <span
                  id="modal-enq-status-badge"
                  className={badges(
                    ui.selected?.status ?? "",
                    "px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-warning-container text-warning",
                  )}
                >
                  {ui.selected?.status}
                </span>
              </div>
              <h2
                id="modal-enq-name"
                className="font-headline text-headline-sm text-on-surface mt-1.5"
              >
                {ui.selected?.name}
              </h2>
              <p
                id="modal-enq-category"
                className="text-body-sm text-on-surface-variant font-medium"
              >
                {ui.selected?.category}
              </p>
            </div>
            <button
              type="button"
              className="text-outline hover:text-on-surface p-1 rounded focus-visible:ring-2 focus-visible:ring-primary"
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
          <div className="py-5 space-y-4 text-body-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3.5 bg-surface-variant/40 rounded-xl border border-outline-variant/60">
              <div>
                <span className="text-label-sm text-outline block">Phone</span>
                <span
                  id="modal-enq-phone"
                  className="font-semibold text-on-surface tabular-nums"
                >
                  {ui.selected?.phone}
                </span>
              </div>
              <div>
                <span className="text-label-sm text-outline block">Email</span>
                <span
                  id="modal-enq-email"
                  className="font-semibold text-on-surface break-all"
                >
                  {ui.selected?.email}
                </span>
              </div>
              <div>
                <span className="text-label-sm text-outline block">
                  Submitted On
                </span>
                <span
                  id="modal-enq-date"
                  className="font-semibold text-on-surface"
                >
                  {ui.selected?.date}
                </span>
              </div>
              <div>
                <span className="text-label-sm text-outline block">
                  Preferred Visit
                </span>
                <span
                  id="modal-enq-visit"
                  className="font-semibold text-primary"
                >
                  {ui.selected?.visit}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-label-md font-label text-on-surface mb-1">
                Applicant Query Message
              </label>
              <div
                id="modal-enq-notes"
                className="p-3 bg-surface rounded-lg border border-outline-variant/60 text-on-surface-variant"
              >
                {ui.detailNotes}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Update Status
                </label>
                <select
                  id="modal-status-select"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
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
                  Responsible Staff / Handler
                </label>
                <input
                  type="text"
                  defaultValue="Admin Director (You)"
                  readOnly
                  className="w-full px-3 py-2 text-body-sm bg-surface-variant border border-outline-variant rounded-md text-on-surface-variant"
                />
              </div>
            </div>
            <div>
              <label className="block text-label-md font-label text-on-surface mb-1">
                Internal Administrative Remarks
              </label>
              <textarea
                id="modal-enq-remarks"
                rows={3}
                placeholder="Add follow-up notes, room tour schedule, or resident suitability findings..."
                className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
                value={ui.remarks}
                onChange={(event) => ui.setRemarks(event.currentTarget.value)}
                aria-label="Follow-up remarks"
              ></textarea>
            </div>
          </div>
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <span className="text-body-sm text-outline flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden
              >
                history
              </span>{" "}
              Auto-timestamped audit trail
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant rounded-md text-label-md text-on-surface-variant hover:bg-surface-variant font-label focus-visible:ring-2 focus-visible:ring-primary"
                onClick={ui.dismiss}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-on-primary rounded-md text-label-md font-label hover:bg-tertiary focus-visible:ring-2 focus-visible:ring-primary"
                onClick={ui.save}
              >
                Save &amp; Finalize Status
              </button>
            </div>
          </div>
        </div>
      </PortalDialog>
    </PortalFrame>
  );
}
