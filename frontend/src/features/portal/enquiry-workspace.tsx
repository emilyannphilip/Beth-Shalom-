"use client";

import { EnquiryActions } from "./record-actions";
import { EnquiryCategories } from "./enquiry-categories";
import { EnquiryHistory } from "./enquiry-history";
import { PortalDataStatus, usePortal } from "./portal-session";
import {
  PortalTable,
  TableRows,
  Pagination,
  GridSearch,
  GridSelect,
} from "./grid";
import { PortalDialog } from "./portal-dialog";
import { EnquiryRow } from "./table-rows";
import { useEnquiryWorkspace } from "./enquiry-interactions";
import { badges } from "./status-badge";
import type { EnquiryStatus } from "./models";
import { categoryLabel } from "../public/enquiry-api";

export function EnquiryWorkspace({ id }: { id: string }) {
  const ui = useEnquiryWorkspace();
  const { grid } = ui;
  const { categories, assignees } = usePortal();
  return (
    <>
      <section
        id={id}
        className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-outline-variant space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-headline-md text-on-surface">
                  Enquiry Management
                </h2>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                Filter, inspect details, append internal remarks, and submit
                finalized enquiry records.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <EnquiryActions />
              <EnquiryCategories />
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
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {categoryLabel(category.name)}
                  </option>
                ))}
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
          <PortalDataStatus
            loading={grid.loading}
            error={grid.error}
            retry={grid.retry}
          />
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
              id={
                id === "staff-enquiries-section"
                  ? "staff-enquiries-tbody"
                  : "enquiries-tbody"
              }
              className="divide-y divide-outline-variant/60 text-body-sm"
              rows={grid.visible}
              columns={8}
              render={(record) => (
                <EnquiryRow key={record.id} record={record} open={ui.show} />
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
                {grid.total}
              </span>{" "}
              enquiries
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
                  {ui.selected?.number}
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
                className="p-3 bg-surface rounded-lg border border-outline-variant/60 text-on-surface-variant whitespace-pre-line"
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
                  value={
                    assignees.find(
                      (person) => person.id === ui.selected?.assignedId,
                    )?.name ??
                    (ui.selected?.assignedId
                      ? "Previous assignee"
                      : "Unassigned")
                  }
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
          <EnquiryHistory
            record={ui.selected}
            loading={ui.detailLoading}
            error={ui.error}
          />
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
                disabled={ui.pending || ui.detailLoading}
                onClick={ui.save}
              >
                Save &amp; Finalize Status
              </button>
            </div>
          </div>
        </div>
      </PortalDialog>
    </>
  );
}
