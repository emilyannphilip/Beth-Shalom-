"use client";
import { fieldClass } from "../management-ui";
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
import { PortalDialog, ConfirmDialog } from "../portal-dialog";
import { LogoutButton } from "../navigation";
import { StaffAccountRow } from "../table-rows";
import { PortalSidebar } from "../portal-sidebar";
import { DashboardCard } from "../status-badge";
import { useStaffManagement } from "../account-interactions";
export function StaffManagement() {
  const ui = useStaffManagement();
  const { grid } = ui;
  return (
    <PortalFrame>
      <PortalSidebar screen="staff-management" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-outline-variant px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="font-headline text-headline-sm text-on-surface">
              Staff Directory &amp; RBAC Management
            </h1>
            <RecordFeedback />
            <p className="text-body-sm text-on-surface-variant">
              Admin Privilege • Create Accounts, Manage Designations, Reset
              Passwords &amp; Toggles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label text-label-md hover:bg-tertiary transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
              onClick={ui.create}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                person_add
              </span>
              <span>+ Add Staff Account</span>
            </button>
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
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-label text-on-surface-variant">
                  Total Registered Staff
                </span>
                <span
                  className="p-1.5 rounded bg-surface-variant text-primary material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  groups
                </span>
              </div>
              <div className="font-headline text-headline-md text-on-surface mt-1 tabular-nums">
                {ui.counts.total}
              </div>
              <span className="text-body-sm text-success font-medium">
                Sample accounts
              </span>
            </DashboardCard>
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-label text-on-surface-variant">
                  Active Accounts
                </span>
                <span
                  className="p-1.5 rounded bg-success-container text-success material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  check_circle
                </span>
              </div>
              <div className="font-headline text-headline-md text-success mt-1 tabular-nums">
                {ui.counts.active}
              </div>
              <span className="text-body-sm text-on-surface-variant">
                Immediate operational access
              </span>
            </DashboardCard>
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-label text-on-surface-variant">
                  Inactive / Suspended
                </span>
                <span
                  className="p-1.5 rounded bg-warning-container text-warning material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  pause_circle
                </span>
              </div>
              <div className="font-headline text-headline-md text-warning mt-1 tabular-nums">
                {ui.counts.inactive}
              </div>
              <span className="text-body-sm text-on-surface-variant">
                On medical leave or re-vetting
              </span>
            </DashboardCard>
            <DashboardCard className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-label text-on-surface-variant">
                  Admin Privilege Level
                </span>
                <span
                  className="p-1.5 rounded bg-secondary-container text-secondary material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  security
                </span>
              </div>
              <div className="font-headline text-headline-md text-secondary mt-1 tabular-nums">
                {ui.counts.admins}
              </div>
              <span className="text-body-sm text-on-surface-variant">
                Executive directors only
              </span>
            </DashboardCard>
          </section>
          <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-outline-variant space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="font-headline text-headline-sm text-on-surface">
                    Registered Staff Accounts
                  </h2>
                  <p className="text-body-sm text-on-surface-variant">
                    Only Administrators hold authorization to provision, modify,
                    or deactivate staff credentials.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-md text-label-sm font-semibold hover:bg-tertiary transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={ui.create}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      aria-hidden
                    >
                      add
                    </span>
                    <span>+ Add</span>
                  </button>
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
                    id="staff-search-input"
                    type="search"
                    placeholder="Search staff name, email, or designation..."
                    className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Search staff accounts"
                    value={grid.search}
                    onValueChange={grid.setSearch}
                  />
                </div>
                <div>
                  <GridSelect
                    id="staff-designation-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Staff designation"
                    value={grid.category}
                    onValueChange={grid.setCategory}
                  >
                    <option value="ALL">All Designations</option>
                    <option value="Registered Nurse (Care Staff)">
                      Registered Nurse (Care Staff)
                    </option>
                    <option value="Care Coordinator (Staff)">
                      Care Coordinator (Staff)
                    </option>
                    <option value="Physical Therapist (Staff)">
                      Physical Therapist (Staff)
                    </option>
                    <option value="Occupational Health Specialist (Staff)">
                      Occupational Health Specialist (Staff)
                    </option>
                    <option value="Executive Admin Director (Admin)">
                      Executive Admin Director (Admin)
                    </option>
                  </GridSelect>
                </div>
                <div>
                  <GridSelect
                    id="staff-status-filter"
                    className="w-full px-3 py-1.5 text-body-sm bg-surface/50 border border-outline-variant rounded-md text-on-surface focus:bg-white focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Staff account status"
                    value={grid.status}
                    onValueChange={grid.setStatus}
                  >
                    <option value="ALL">All Account Statuses</option>
                    <option value="Active">Active Accounts</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </GridSelect>
                </div>
              </div>
            </div>
            <div className="px-4 pb-3">
              <label>
                Sort staff
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
              aria-label="Staff accounts table"
              tabIndex={0}
            >
              <PortalDataStatus
                loading={grid.loading}
                error={grid.error}
                retry={grid.retry}
              />
              <PortalTable className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-variant/70 text-on-surface-variant border-b border-outline-variant font-label text-label-md">
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Staff Name &amp; Username
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Designation &amp; Role
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Contact Email
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold whitespace-nowrap"
                    >
                      Phone Number
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Account Status
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-4 font-semibold text-right min-w-[120px]"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <TableRows
                  id="staff-table-tbody"
                  className="divide-y divide-outline-variant/60 text-body-sm"
                  rows={grid.visible}
                  columns={6}
                  render={(record) => (
                    <StaffAccountRow
                      key={record.id}
                      record={record}
                      edit={ui.edit}
                      toggle={ui.toggle}
                      reset={ui.reset}
                    />
                  )}
                />
              </PortalTable>
            </div>
            <p role="status" className="px-4 text-body-sm" hidden={!ui.message}>
              {ui.message}
            </p>
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
                registered staff accounts
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
                  slots: [1, 2, 3],
                }}
              />
            </div>
          </section>
        </main>
      </div>
      <PortalDialog
        id="create-staff-modal"
        className="p-0 rounded-2xl border border-outline-variant bg-white backdrop:bg-on-surface/40 shadow-2xl max-w-xl w-full"
        open={ui.open}
        dismiss={ui.dismiss}
        aria-labelledby="staff-modal-title"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary-container text-primary">
                <span
                  className="material-symbols-outlined text-[22px]"
                  aria-hidden
                >
                  person_add
                </span>
              </div>
              <div>
                <h2
                  id="staff-modal-title"
                  className="font-headline text-headline-sm text-on-surface"
                >
                  {ui.editing
                    ? "Edit Staff Member: " + ui.editing.name
                    : "Create New Staff Account"}
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Admin Authorization • Provide personnel identity and
                  credential set
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-outline hover:text-on-surface p-1 focus-visible:ring-2 focus-visible:ring-primary"
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
          <form
            id="create-staff-form"
            className="py-5 space-y-4"
            onSubmit={ui.submit}
            method="dialog"
            key={ui.open ? (ui.editing?.id ?? "new") : "closed"}
            onInput={ui.onInput}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Staff Full Name
                </label>
                <input
                  id="form-staff-name"
                  type="text"
                  required
                  placeholder="e.g. Dr. Maya Lin"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                  name="name"
                  defaultValue={ui.values.name}
                />
              </div>
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Username
                </label>
                <input
                  id="form-staff-username"
                  type="text"
                  required
                  placeholder="e.g. staff.mlin"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none font-mono"
                  name="username"
                  defaultValue={ui.values.username}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Password
                </label>
                <input
                  id="form-staff-password"
                  type="password"
                  required={!ui.editing}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none font-mono"
                  name="password"
                />
              </div>
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Confirm Password
                </label>
                <input
                  id="form-staff-confirm"
                  type="password"
                  required={!ui.editing}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none font-mono"
                  name="confirmation"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Institutional Email
                </label>
                <input
                  id="form-staff-email"
                  type="email"
                  required
                  placeholder="m.lin@bethshalom.org"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                  name="email"
                  defaultValue={ui.values.email}
                />
              </div>
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Phone Number
                </label>
                <input
                  id="form-staff-phone"
                  type="tel"
                  required
                  placeholder="(555) 987-6543"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                  name="phone"
                  defaultValue={ui.values.phone}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Designation
                </label>
                <select
                  id="form-staff-designation"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                  name="designation"
                  defaultValue={ui.values.designation}
                >
                  <option value="Registered Nurse (Care Staff)">
                    Registered Nurse (Care Staff)
                  </option>
                  <option value="Care Coordinator (Staff)">
                    Care Coordinator (Staff)
                  </option>
                  <option value="Physical Therapist (Staff)">
                    Physical Therapist (Staff)
                  </option>
                  <option value="Occupational Health Specialist (Staff)">
                    Occupational Health Specialist (Staff)
                  </option>
                  <option value="Executive Admin Director (Admin)">
                    Executive Admin Director (Admin)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-label-md font-label text-on-surface mb-1">
                  Account Status
                </label>
                <select
                  id="form-staff-status"
                  className="w-full px-3 py-2 text-body-sm bg-white border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
                  name="status"
                  defaultValue={ui.values.status}
                >
                  <option value="Active">
                    Active (Permitted Portal Access)
                  </option>
                  <option value="Inactive">Inactive (Suspended)</option>
                </select>
              </div>
            </div>
            <div className="p-3 bg-surface-variant/50 rounded-lg text-body-sm text-on-surface-variant flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[18px] text-primary"
                aria-hidden
              >
                encrypted
              </span>
              <span>
                Choose a password of at least 12
                characters.
              </span>
            </div>
            {ui.error && (
              <p role="alert" className="text-error">
                {ui.error}
              </p>
            )}
            <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-outline-variant rounded-md text-label-md text-on-surface-variant hover:bg-surface-variant font-label focus-visible:ring-2 focus-visible:ring-primary"
                onClick={ui.dismiss}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={ui.pending}
                className="px-5 py-2 bg-primary text-on-primary rounded-md text-label-md font-label hover:bg-tertiary shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
              >
                {ui.pending
                  ? "Saving…"
                  : ui.editing
                    ? "Update Staff Account"
                    : "Save Staff Account"}
              </button>
            </div>
          </form>
        </div>
      </PortalDialog>
      <ConfirmDialog
        title={
          ui.confirmation
            ? ui.confirmation.action === "toggle"
              ? "Change Account Status"
              : "Send Password Reset"
            : null
        }
        message={
          ui.confirmation
            ? ui.confirmation.action === "toggle"
              ? "Change the account status for " +
                ui.confirmation.account.name +
                "?"
              : "Send a reset link to the registered email for " +
                ui.confirmation.account.name +
                "?"
            : undefined
        }
        error={ui.error}
        pending={ui.pending}
        dismiss={ui.cancelConfirmation}
        accept={ui.confirm}
      />
    </PortalFrame>
  );
}
