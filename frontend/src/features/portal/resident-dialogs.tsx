"use client";

import { type ComponentProps, type FormEvent } from "react";
import { PortalDialog, DetailDialog } from "./portal-dialog";
import {
  residentCategories,
  residentStatuses,
  type Resident,
  type StaffResident,
} from "./models";

const field =
  "mt-1 block w-full rounded-md border border-outline-variant px-2 py-1.5 text-body-sm";

function ResidentField({
  label,
  ...props
}: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="block text-label-md">
      {label}
      <input {...props} className={field} />
    </label>
  );
}

export function ResidentEditor({
  editor,
  dismiss,
  submit,
}: {
  editor: { id: string; resident: Resident | null } | null;
  dismiss: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const record = editor?.resident;
  const title = record ? "Edit Resident Profile" : "New Resident Admission";
  return (
    <PortalDialog
      className="w-full max-w-xl rounded-2xl border border-outline-variant bg-white p-6 shadow-xl"
      open={!!editor}
      dismiss={dismiss}
      aria-labelledby="resident-editor-title"
    >
      <h2
        id="resident-editor-title"
        className="font-headline text-headline-md mb-4"
      >
        {title}
      </h2>
      {editor && (
        <form
          method="dialog"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          onSubmit={submit}
        >
          <ResidentField
            label="Resident ID"
            name="id"
            value={editor.id}
            readOnly
          />
          <ResidentField
            label="Resident name"
            name="name"
            defaultValue={record?.name}
            required
          />
          <ResidentField
            label="Date of birth"
            name="dob"
            defaultValue={record?.dob}
            required
          />
          <ResidentField
            label="Gender"
            name="gender"
            defaultValue={record?.gender}
            required
          />
          <ResidentField
            label="Admission date"
            name="admitted"
            defaultValue={record?.admitted}
            required
          />
          <ResidentField
            label="Room / suite"
            name="room"
            defaultValue={record?.room}
            required
          />
          <label className="block text-label-md">
            Admission category
            <select
              className={field}
              name="category"
              defaultValue={record?.category}
              required
            >
              {residentCategories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <ResidentField
            label="Address"
            name="address"
            defaultValue={record?.address}
          />
          <ResidentField
            label="Emergency contact name"
            name="contactName"
            defaultValue={record?.contactName}
          />
          <ResidentField
            label="Emergency contact phone"
            name="contactPhone"
            type="tel"
            defaultValue={record?.contactPhone}
          />
          <ResidentField
            label="Legal guardian / proxy"
            name="guardian"
            defaultValue={record?.guardian}
          />
          <label className="block text-label-md">
            Care directives
            <textarea
              className={field}
              name="care"
              defaultValue={record?.care}
            />
          </label>
          <label className="block text-label-md">
            Admission status
            <select
              className={field}
              name="status"
              defaultValue={record?.status}
              required
            >
              {residentStatuses.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="block text-label-md">
            Remarks
            <textarea
              className={field}
              name="remarks"
              defaultValue={record?.remarks}
            />
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-on-primary text-label-md"
            >
              Save Resident
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-md border border-outline-variant px-4 py-2 text-label-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </PortalDialog>
  );
}

export function StaffResidentDialog({
  resident,
  dismiss,
}: {
  resident: StaffResident | null;
  dismiss: () => void;
}) {
  return (
    <DetailDialog title={resident?.name ?? null} dismiss={dismiss}>
      {resident && (
        <dl className="space-y-2 text-body-md">
          {[
            ["Room / suite", resident.room],
            ["Admission category", resident.category],
            ["Admission status", resident.status],
            ["Care directives", resident.care],
            [
              "Emergency contact",
              [resident.contactLabel, resident.contactPhone]
                .filter(Boolean)
                .join(" · "),
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="font-semibold">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </DetailDialog>
  );
}
