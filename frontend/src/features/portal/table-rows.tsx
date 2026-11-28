import {
  ArchiveResidentAction,
  EnquiryActions,
  StaffRecordActions,
} from "./record-actions";
import { RecordAction } from "./management-ui";
import { floorLabel } from "../accommodation/availability";
import type { Enquiry, StaffAccount, Resident } from "./models";
import { StatusBadge, badges, statusStyle } from "./status-badge";
export function EnquiryRow({
  record,
  open,
}: {
  record: Enquiry;
  open: (record: Enquiry) => void;
}) {
  return (
    <tr
      className="hover:bg-primary-container/20 transition-colors"
      data-category={record.category}
      data-status={record.status}
    >
      <td className="py-3.5 px-4 font-code text-code-md text-primary font-medium whitespace-nowrap">
        {record.number || record.id}
      </td>
      <td className="py-3.5 px-4">
        <div className="font-medium text-on-surface">{record.name}</div>
        <span className="text-body-sm text-on-surface-variant">
          {record.relationship}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <div className="tabular-nums text-on-surface">{record.phone}</div>
        <div className="text-body-sm text-on-surface-variant">
          {record.email}
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className={record.categoryClass}>{record.category}</span>
      </td>
      <td className="py-3.5 px-4 tabular-nums text-on-surface-variant whitespace-nowrap">
        {record.date}
      </td>
      <td className="py-3.5 px-4 tabular-nums font-medium text-primary whitespace-nowrap">
        {record.visit}
      </td>
      <td className="py-3.5 px-4">
        <StatusBadge
          status={record.status}
          className={
            record.audit?.length
              ? badges(record.status, record.badgeClass)
              : record.badgeClass
          }
          dot={
            record.audit?.length && record.badgeDot
              ? "w-1.5 h-1.5 rounded-full " + statusStyle(record.status)[1]
              : record.badgeDot
          }
        />
      </td>
      <td className="py-3.5 px-4 text-right min-w-[130px]">
        <button
          type="button"
          className="px-3 py-1.5 text-label-sm font-semibold rounded bg-primary-container text-primary hover:bg-primary hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
          onClick={() => open(record)}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            aria-hidden="true"
          >
            visibility
          </span>{" "}
          View
        </button>
        <EnquiryActions record={record} />
      </td>
    </tr>
  );
}

export function StaffAccountRow({
  record,
  edit,
  toggle,
  reset,
}: {
  record: StaffAccount;
  edit: (record: StaffAccount) => void;
  toggle: (record: StaffAccount) => void;
  reset: (record: StaffAccount) => void;
}) {
  return (
    <tr
      className="hover:bg-primary-container/20 transition-colors"
      data-status={record.status}
      data-designation={record.designation}
    >
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={record.avatarClass}>
            {record.name
              .split(/\s+/)
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-on-surface">{record.name}</div>
            <span className="font-code text-code-md text-on-surface-variant">
              {"@" + record.username}
            </span>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className="font-medium text-on-surface">
          {record.designation}
        </span>
        <span className="block text-label-sm text-on-surface-variant">
          {record.designation.endsWith("(Admin)")
            ? "Admin Portal Access"
            : "Staff Portal Access"}
        </span>
      </td>
      <td className="py-3.5 px-4 text-on-surface-variant">{record.email}</td>
      <td className="py-3.5 px-4 tabular-nums text-on-surface whitespace-nowrap">
        {record.phone}
      </td>
      <td className="py-3.5 px-4 whitespace-nowrap">
        <button
          type="button"
          className={badges(
            record.status,
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-semibold bg-success-container text-success hover:ring-1 hover:ring-success transition-all focus-visible:ring-2 focus-visible:ring-primary",
          )}
          aria-label={record.status + " — change status for " + record.name}
          onClick={() => toggle(record)}
        >
          <span
            className={
              "w-1.5 h-1.5 rounded-full " + statusStyle(record.status)[1]
            }
          ></span>
          <span>{record.status}</span>
        </button>
      </td>
      <td className="py-3.5 px-4 text-right min-w-[120px]">
        <div className="inline-flex items-center gap-1">
          <StaffRecordActions record={record} />
          <button
            type="button"
            title="Edit Staff Record"
            className="p-1.5 rounded text-outline hover:text-primary hover:bg-primary-container transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Edit Staff Record"
            onClick={() => edit(record)}
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              edit
            </span>
          </button>
          <button
            type="button"
            title="Reset Password"
            className="p-1.5 rounded text-outline hover:text-secondary hover:bg-secondary-container transition-colors focus-visible:ring-2 focus-visible:ring-secondary"
            aria-label="Reset Password"
            onClick={() => reset(record)}
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              lock_reset
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ResidentRow({
  record,
  open,
  edit,
}: {
  record: Resident;
  open: (record: Resident) => void;
  edit: (record: Resident) => void;
}) {
  return (
    <tr
      className="hover:bg-primary-container/20 transition-colors"
      data-category={record.category}
      data-status={record.status}
    >
      <td className="py-3.5 px-4 font-code text-code-md text-primary font-bold whitespace-nowrap">
        {record.number || record.id}
      </td>
      <td className="py-3.5 px-4">
        <div className="font-medium text-on-surface">{record.name}</div>
        <span className="text-body-sm text-on-surface-variant">
          {"Adm: " + record.admitted}
        </span>
      </td>
      <td className="py-3.5 px-4 text-on-surface-variant whitespace-nowrap">
        {[record.ageLabel, record.gender].filter(Boolean).join(" • ")}
      </td>
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className={record.roomClass}>
          {record.accommodation?.room || record.accommodation?.bed || "—"}
        </span>
        <div>
          {record.accommodation?.type ?? "Unallocated"}
          {record.accommodation?.category
            ? " · " + record.accommodation.category
            : ""}
        </div>
        {record.accommodation && (
          <div>{floorLabel(record.accommodation.floor)}</div>
        )}
        {record.accommodation?.dormitory && (
          <div>
            {record.accommodation.dormitory} · {record.accommodation.bed}
          </div>
        )}
      </td>
      <td className="py-3.5 px-4">
        <span className="text-on-surface font-medium block">
          {record.category}
        </span>
        <span className="text-body-sm text-on-surface-variant">
          {record.categoryDetail}
        </span>
      </td>
      <td className="py-3.5 px-4 whitespace-nowrap">{record.phone || "—"}</td>
      <td className="py-3.5 px-4">
        <div className="text-on-surface font-medium">{record.contactLabel}</div>
        <div className="text-body-sm text-on-surface-variant tabular-nums">
          {record.contactPhone}
        </div>
      </td>
      <td className="py-3.5 px-4 whitespace-nowrap">
        {record.admitted || "—"}
      </td>
      <td className="py-3.5 px-4">
        <StatusBadge
          status={record.status}
          className={record.badgeClass}
          dot={record.badgeDot}
        />
      </td>
      <td className="py-3.5 px-4 text-right min-w-[130px]">
        <button
          type="button"
          className="px-3 py-1.5 rounded-md bg-primary-container text-primary font-semibold text-label-sm hover:bg-primary hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
          onClick={() => open(record)}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            aria-hidden="true"
          >
            visibility
          </span>{" "}
          Profile
        </button>
        <RecordAction
          action="edit"
          label="Edit resident"
          onClick={() => edit(record)}
        />
        <ArchiveResidentAction record={record} />
      </td>
    </tr>
  );
}
