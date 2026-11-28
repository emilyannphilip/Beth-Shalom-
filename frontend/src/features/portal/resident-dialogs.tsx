"use client";
import { usePortal } from "./portal-session";
import {
  currentAllocation,
  describeTarget,
  targetLabel,
} from "../accommodation/inventory";
import { floorLabel } from "../accommodation/availability";
import { parseTarget, TargetPicker } from "./target-picker";

import { useState, type ComponentProps, type FormEvent } from "react";
import { PortalDialog } from "./portal-dialog";
import {
  contactFields,
  medicalFields,
  residentCategories,
  residentStatuses,
  type Resident,
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
      {props.required && <span aria-hidden="true"> *</span>}
      <input {...props} className={field} />
    </label>
  );
}

export function ResidentEditor({
  editor,
  dismiss,
  submit,
  error,
  pending,
}: {
  editor: { id: string; resident: Resident | null } | null;
  dismiss: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  error: string;
  pending: boolean;
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
        <ResidentAdmissionForm
          key={editor.id}
          editor={editor}
          dismiss={dismiss}
          submit={submit}
          error={error}
          pending={pending}
        />
      )}
    </PortalDialog>
  );
}

function ResidentAdmissionForm({
  editor,
  dismiss,
  submit,
  error,
  pending,
}: {
  editor: { id: string; resident: Resident | null };
  dismiss: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  error: string;
  pending: boolean;
}) {
  const { inventory } = usePortal();
  const record = editor.resident;
  const [review, setReview] = useState<{
    name: string;
    target: string;
    floor: string;
    date: string;
  }>();
  function proceed(event: FormEvent<HTMLFormElement>) {
    if (record || review) {
      submit(event);
      return;
    }
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const target = parseTarget(data);
    if (!target) return;
    setReview({
      name: String(data.get("name")).trim(),
      date: String(data.get("admitted")),
      target: targetLabel(inventory, target),
      floor: floorLabel(describeTarget(inventory, target).floor),
    });
  }
  return (
    <form
      method="dialog"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      onSubmit={proceed}
    >
      <div className={review ? "hidden" : "contents"}>
        <ResidentField
          label="Resident ID"
          name="id"
          value={record?.number ?? "Assigned on save"}
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
          type="date"
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
          type="date"
          defaultValue={record?.admitted}
          required
        />
        <div className="sm:col-span-2">
          <TargetPicker
            key={editor.id}
            inventory={inventory}
            residentId={editor.id}
            prior={currentAllocation(inventory, editor.id)?.target}
            required={!record}
          />
        </div>
        <label className="block text-label-md">
          Admission category <span aria-hidden="true">*</span>
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
          label="Contact number"
          name="phone"
          type="tel"
          defaultValue={record?.phone}
        />
        <ResidentField label="Resident email" name="email" type="email" defaultValue={record?.email} />
        <ResidentField
          label="Expected discharge"
          name="expectedDischarge"
          type="date"
          defaultValue={record?.expectedDischarge}
        />
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
        {Object.entries(contactFields).map(([key, label]) => (
          <ResidentField key={"emergency-" + key} label={"Emergency contact " + label} name={"emergency-" + key} type={key === "email" ? "email" : "text"} defaultValue={record?.emergencyDetails?.[key]} />
        ))}
        <ResidentField label="Guardian phone" name="guardian-phone" type="tel" defaultValue={record?.guardianDetails?.phone} />
        {Object.entries(contactFields).map(([key, label]) => (
          <ResidentField key={"guardian-" + key} label={"Guardian " + label} name={"guardian-" + key} type={key === "email" ? "email" : "text"} defaultValue={record?.guardianDetails?.[key]} />
        ))}
        {Object.entries(medicalFields).map(([key, label]) => (
          <label key={key} className="block text-label-md">
            {label}
            <textarea className={field} name={key} defaultValue={record?.medical?.[key]} />
          </label>
        ))}
        <label className="block text-label-md">
          Care directives
          <textarea className={field} name="care" defaultValue={record?.care} />
        </label>
        <label className="block text-label-md">
          Admission status <span aria-hidden="true">*</span>
          <select
            className={field}
            name="status"
            defaultValue={record?.status}
            required
          >
            {residentStatuses
              .filter((value) =>
                record
                  ? value !== "Discharged" || record.status === "Discharged"
                  : value === "Admitted (Active)",
              )
              .map((value) => (
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
      </div>
      {review && (
        <section
          className="sm:col-span-2 rounded-lg border border-outline-variant bg-surface p-4"
          aria-label="Admission review"
        >
          <h3 className="font-semibold mb-2">
            Review admission and accommodation
          </h3>
          <p>{review.name}</p>
          <p>Admission date {review.date}</p>
          <p>
            {review.target} · {review.floor}
          </p>
        </section>
      )}
      {error && (
        <p role="alert" className="text-error sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 text-on-primary text-label-md"
        >
          {record
            ? "Update Resident"
            : review
              ? "Confirm admission and allocation"
              : "Review admission"}
        </button>
        <button
          type="button"
          onClick={review ? () => setReview(undefined) : dismiss}
          className="rounded-md border border-outline-variant px-4 py-2 text-label-md"
        >
          {review ? "Back to details" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
