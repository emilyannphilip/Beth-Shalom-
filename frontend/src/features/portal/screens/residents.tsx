"use client";
import { primaryButton, fieldClass } from "../management-ui";
import { PortalDataStatus } from "../portal-session";
import { RecordFeedback } from "../record-actions";
import {
  PortalTable,
  TableRows,
  Pagination,
  GridSearch,
  GridSelect,
} from "../grid";
import { PortalFrame } from "../portal-frame";
import { PortalDialog } from "../portal-dialog";
import { LogoutButton } from "../navigation";
import { ResidentRow } from "../table-rows";
import { PortalSidebar } from "../portal-sidebar";
import { ResidentEditor } from "../resident-dialogs";
import { DashboardCard } from "../status-badge";
import { useResidentManagement } from "../resident-interactions";
import { badges } from "../status-badge";
import { contactFields, medicalFields } from "../models";
export function ResidentManagement({ staff = false }: { staff?: boolean }) {
  const ui = useResidentManagement();
  const { grid } = ui;
  return (
    <PortalFrame>
      <PortalSidebar screen={staff ? "staff" : "residents"} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-outline-variant px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-headline text-headline-sm text-on-surface">
              Admitted Residents Management
            </h1>
            <RecordFeedback />
            <p className="text-body-sm text-on-surface-variant">
              Personal Records, Clinical Care Plans, Emergency Contacts &amp;
              Suite Allocations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg font-label text-label-md hover:opacity-90 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-secondary"
              onClick={ui.create}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                person_add
              </span>
              <span>+ Add Resident</span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-1"></div>
            <LogoutButton
              type="button"
              title="Sign out of portal"
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
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <span className="text-label-md font-label text-on-surface-variant">
                Current In-Residence
              </span>
              <div className="font-headline text-headline-md text-on-surface tabular-nums mt-1">
                {ui.counts.total}
              </div>
              <span className="text-body-sm text-success font-medium">
                Sample records
              </span>
            </DashboardCard>
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <span className="text-label-md font-label text-on-surface-variant">
                Supported Living Units
              </span>
              <div className="font-headline text-headline-md text-secondary tabular-nums mt-1">
                {ui.counts.supported}
              </div>
              <span className="text-body-sm text-on-surface-variant">
                Wing B &amp; Garden Terrace
              </span>
            </DashboardCard>
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <span className="text-label-md font-label text-on-surface-variant">
                Memory Care Suite
              </span>
              <div className="font-headline text-headline-md text-tertiary tabular-nums mt-1">
                {ui.counts.memory}
              </div>
              <span className="text-body-sm text-on-surface-variant">
                24/7 Monitored Corridor
              </span>
            </DashboardCard>
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <span className="text-label-md font-label text-on-surface-variant">
                Active Care Directives
              </span>
              <div className="font-headline text-headline-md text-primary tabular-nums mt-1">
                {ui.counts.care}
              </div>
              <span className="text-body-sm text-on-surface-variant">
                Sample care records
              </span>
            </DashboardCard>
          </section>
          <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-outline-variant space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="font-headline text-headline-sm text-on-surface">
                    Resident Directory
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    Complete dossier access. Click &quot;Open Profile&quot; to
                    inspect separated personal, admission, contact, and care
                    information.
                  </p>
                </div>
                <button
                  type="button"
                  className={primaryButton}
                  onClick={ui.create}
                >
                  + Add
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="relative sm:col-span-2">
                  <span
                    className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline"
                    aria-hidden
                  >
                    search
                  </span>
                  <GridSearch
                    id="resident-search-input"
                    type="search"
                    placeholder="Search name, ID, room, dormitory or bed"
                    className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Search residents"
                    value={grid.search}
                    onValueChange={grid.setSearch}
                  />
                </div>
                <div>
                  <GridSelect
                    id="resident-category-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Admission category"
                    value={grid.category}
                    onValueChange={grid.setCategory}
                  >
                    <option value="ALL">All Admission Categories</option>
                    <option value="Senior Living &amp; Residential Care">
                      Senior Living &amp; Residential Care
                    </option>
                    <option value="Supported Living (Differently-Abled)">
                      Supported Living (Differently-Abled)
                    </option>
                    <option value="Memory &amp; Cognitive Wellness Care">
                      Memory &amp; Cognitive Wellness Care
                    </option>
                    <option value="Restorative Palliative Suite">
                      Restorative Palliative Suite
                    </option>
                  </GridSelect>
                </div>
                <div>
                  <GridSelect
                    id="resident-status-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Admission status"
                    value={grid.status}
                    onValueChange={grid.setStatus}
                  >
                    <option value="ALL">All Admission Statuses</option>
                    <option value="Admitted (Active)">Admitted (Active)</option>
                    <option value="Hospitalized / Temporary Leave">
                      Hospitalized / Temporary Leave
                    </option>
                    <option value="Discharged">Discharged</option>
                  </GridSelect>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-wrap gap-3 border-b border-outline-variant">
              <label>
                Accommodation
                <select
                  className={fieldClass}
                  value={ui.accommodation}
                  onChange={(e) => ui.setAccommodation(e.currentTarget.value)}
                >
                  <option value="ALL">All rooms, dormitories and beds</option>
                  {ui.filterOptions.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Sort residents
                <select
                  className={fieldClass}
                  value={grid.sort}
                  onChange={(e) => grid.setSort(e.currentTarget.value)}
                >
                  <option value="newest">Default order</option>
                  <option value="az">Name A–Z</option>
                  <option value="za">Name Z–A</option>
                </select>
              </label>
            </div>
            <div
              className="overflow-x-auto"
              role="region"
              aria-label="Resident directory table"
              tabIndex={0}
            >
              <PortalDataStatus
                loading={grid.loading || ui.detailLoading}
                error={grid.error || ui.detailError}
                retry={grid.retry}
              />
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
                      Resident Full Name
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Age / Gender
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Accommodation and location
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Admission Category
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Contact Number
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Emergency Contact
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Admission Date
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
                  id="residents-tbody"
                  className="divide-y divide-outline-variant/60 text-body-sm"
                  rows={grid.visible}
                  columns={10}
                  render={(record) => (
                    <ResidentRow
                      key={record.id}
                      record={record}
                      open={ui.show}
                      edit={ui.editRecord}
                    />
                  )}
                />
              </PortalTable>
            </div>
            <div className="p-4 border-t border-outline-variant/70 bg-surface/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm text-on-surface-variant">
              <div>
                Showing{" "}
                <span className="font-semibold text-on-surface">
                  {grid.range}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-on-surface">
                  {grid.total}
                </span>{" "}
                admitted residents
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
                  slots: [1, 2, 3, "ellipsis", 37],
                }}
              />
            </div>
          </section>
        </main>
      </div>
      <PortalDialog
        id="resident-profile-modal"
        className="p-0 rounded-2xl border border-outline-variant bg-white backdrop:bg-on-surface/40 shadow-2xl max-w-3xl w-full"
        open={!!ui.profile && !ui.editor}
        dismiss={ui.close}
        aria-labelledby="profile-res-name"
      >
        <div
          className="p-6 md:p-8 max-h-[921px] overflow-y-auto"
          data-stitch-vh="max-h-[921px]===max-h-[90vh]"
        >
          <div className="flex items-start justify-between pb-5 border-b border-outline-variant">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-headline text-headline-sm shadow-sm">
                <span
                  className="material-symbols-outlined text-[32px]"
                  aria-hidden
                >
                  elderly
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    id="profile-res-id"
                    className="font-code text-code-md px-2.5 py-0.5 rounded bg-primary-container text-primary font-bold"
                  >
                    {ui.profile?.number}
                  </span>
                  <span
                    id="profile-res-status-badge"
                    className={badges(
                      ui.profile?.status ?? "",
                      "px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-success-container text-success",
                    )}
                  >
                    {ui.profile?.status}
                  </span>
                </div>
                <h2
                  id="profile-res-name"
                  className="font-headline text-headline-md text-on-surface mt-1"
                >
                  {ui.profile?.name}
                </h2>
                <p
                  id="profile-res-suite"
                  className="text-body-sm text-primary font-semibold"
                >
                  {[ui.profile?.room, ui.profile?.category]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-outline hover:text-on-surface p-1 rounded focus-visible:ring-2 focus-visible:ring-primary"
              onClick={ui.close}
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
          <div className="py-6 space-y-6">
            <div className="p-4 rounded-xl bg-surface-variant/40 border border-outline-variant/60">
              <h3 className="font-headline text-headline-sm text-primary flex items-center gap-2 mb-3">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  badge
                </span>{" "}
                1. Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-sm">
                <div>
                  <span className="text-label-sm text-outline block">
                    Date of Birth / Age
                  </span>
                  <span
                    id="profile-res-dob"
                    className="font-semibold text-on-surface"
                  >
                    {ui.profile?.dob}
                  </span>
                </div>
                <div>
                  <span className="text-label-sm text-outline block">
                    Gender
                  </span>
                  <span
                    id="profile-res-gender"
                    className="font-semibold text-on-surface"
                  >
                    {ui.profile?.gender}
                  </span>
                </div>
                <div>
                  <span className="text-label-sm text-outline block">
                    Permanent Home Address
                  </span>
                  <span
                    id="profile-res-address"
                    className="font-semibold text-on-surface"
                  >
                    {ui.profile?.address}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface-variant/40 border border-outline-variant/60">
              <h3 className="font-headline text-headline-sm text-primary flex items-center gap-2 mb-3">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  meeting_room
                </span>{" "}
                2. Admission &amp; Housing Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-sm">
                <div>
                  <span className="text-label-sm text-outline block">
                    Admission Date
                  </span>
                  <span
                    id="profile-res-adm-date"
                    className="font-semibold text-on-surface"
                  >
                    {ui.profile?.admitted}
                  </span>
                </div>
                <div>
                  <span className="text-label-sm text-outline block">
                    Admission Category
                  </span>
                  <span
                    id="profile-res-adm-cat"
                    className="font-semibold text-on-surface"
                  >
                    {ui.profile?.category}
                  </span>
                </div>
                <div>
                  <span className="text-label-sm text-outline block">
                    Current Room / Suite
                  </span>
                  <span
                    id="profile-res-room-num"
                    className="font-semibold text-primary"
                  >
                    {ui.profile?.room}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-surface-variant/40 border border-outline-variant/60">
              <h3 className="font-headline text-headline-sm text-primary flex items-center gap-2 mb-3">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  contact_emergency
                </span>{" "}
                3. Contact &amp; Guardian Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
                <div>
                  <span className="text-label-sm text-outline block">
                    Emergency Contact Name &amp; Phone
                  </span>
                  <span
                    id="profile-res-em-contact"
                    className="font-semibold text-on-surface"
                  >
                    {[ui.profile?.contactName, ui.profile?.contactPhone]
                      .filter(Boolean)
                      .join(" — ")}
                  </span>
                </div>
                <div>
                  <span className="text-label-sm text-outline block">
                    Guardian / Family Contact Details
                  </span>
                  <span
                    id="profile-res-guardian"
                    className="font-semibold text-on-surface"
                  >
                    {ui.profile?.guardian}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary-container/20 border border-primary/20">
              <h3 className="font-headline text-headline-sm text-primary flex items-center gap-2 mb-3">
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  medical_services
                </span>{" "}
                4. Relevant Care Requirements &amp; Clinical Directives
              </h3>
              <div className="space-y-3 text-body-sm">
                <div>
                  <span className="text-label-sm text-outline block mb-1">
                    Care &amp; Assistance Specifications:
                  </span>
                  <p
                    id="profile-res-care"
                    className="p-3 bg-white rounded-lg border border-outline-variant/60 text-on-surface"
                  >
                    {ui.profile?.care}
                  </p>
                </div>
                <div>
                  <span className="text-label-sm text-outline block mb-1">
                    Additional Resident Remarks:
                  </span>
                  <p
                    id="profile-res-remarks"
                    className="p-3 bg-white rounded-lg border border-outline-variant/60 text-on-surface-variant"
                  >
                    {ui.profile?.remarks}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {ui.profile && (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Resident email", ui.profile.email],
                ["Guardian phone", ui.profile.guardianDetails?.phone],
                ...Object.entries(contactFields).flatMap(([key, label]) => [
                  ["Emergency contact " + label, ui.profile?.emergencyDetails?.[key]],
                  ["Guardian " + label, ui.profile?.guardianDetails?.[key]],
                ]),
                ...Object.entries(medicalFields).map(([key, label]) => [label, ui.profile?.medical?.[key]]),
              ].filter(([, value]) => value).map(([label, value]) => (
                <div key={label}>
                  <dt className="font-semibold">{label}</dt>
                  <dd className="whitespace-pre-wrap">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <section
            aria-label="Accommodation history"
            className="mt-4 mb-4 space-y-2"
          >
            <h3 className="font-semibold">Accommodation history</h3>
            <PortalDataStatus
              loading={ui.detailLoading}
              error={ui.detailError}
            />
            {ui.profile?.history?.length ? (
              <ul className="text-body-sm space-y-1">
                {ui.profile.history.map((event, index) => (
                  <li key={event.date + index}>
                    {event.date.slice(0, 10)} · {event.action}
                    {event.target ? " · " + event.target : ""}
                  </li>
                ))}
              </ul>
            ) : (
              !ui.detailLoading && <p>No history recorded.</p>
            )}
          </section>
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <span className="text-body-sm text-outline flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[16px] text-success"
                aria-hidden
              >
                verified
              </span>{" "}
              Local development record
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant rounded-md text-label-md text-on-surface-variant hover:bg-surface-variant font-label focus-visible:ring-2 focus-visible:ring-primary"
                onClick={ui.close}
              >
                Close
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-on-primary rounded-md text-label-md font-label hover:bg-tertiary focus-visible:ring-2 focus-visible:ring-primary"
                disabled={ui.detailLoading}
                onClick={ui.edit}
              >
                Edit Resident Details
              </button>
            </div>
          </div>
        </div>
      </PortalDialog>
      <ResidentEditor
        editor={ui.editor}
        dismiss={ui.dismissEditor}
        submit={ui.submit}
        error={ui.error}
        pending={ui.pending}
      />
    </PortalFrame>
  );
}
