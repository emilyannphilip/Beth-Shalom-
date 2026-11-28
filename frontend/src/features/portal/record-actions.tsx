"use client";

import { useState } from "react";
import { errorMessage } from "@/lib/api";
import { PortalDataStatus, usePortal } from "./portal-session";
import {
  enquiryStatuses,
  type Enquiry,
  type EnquiryStatus,
  type StaffAccount,
  type Resident,
} from "./models";
import {
  ConfirmAction,
  FormFields,
  formText,
  ManagementForm,
  optionsOf,
  primaryButton,
  managementButton,
  RecordAction,
  RecordDetails,
  type FieldSpec,
  type FormValues,
} from "./management-ui";
import { categoryLabel } from "../public/enquiry-api";

const enquiryFields: FieldSpec[] = [
  { name: "name", label: "Applicant name", required: true },
  { name: "relationship", label: "Contact relationship" },
  { name: "phone", label: "Telephone", type: "tel", required: true },
  { name: "email", label: "Email", type: "email" },
  {
    name: "status",
    label: "Enquiry status",
    options: optionsOf(enquiryStatuses),
    required: true,
  },
  { name: "date", label: "Enquiry date", type: "date", readOnly: true },
  { name: "visit", label: "Preferred visit date", type: "date" },
  {
    name: "notes",
    label: "Applicant message",
    type: "textarea",
  },
  { name: "remarks", label: "Internal remarks", type: "textarea" },
];
const iso = (value: string) => {
  const date = Date.parse(value);
  return Number.isFinite(date) ? new Date(date).toISOString().slice(0, 10) : "";
};

export function EnquiryActions({ record }: { record?: Enquiry }) {
  const { assignees, categories, enquiryDetail, saveEnquiryRecord, archiveEnquiry } =
    usePortal();
  const [full, setFull] = useState<Enquiry>();
  const [issue, setIssue] = useState("");
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  async function save(data: FormData) {
    const get = (field: string) => formText(data, field);
    const name = get("name"),
      email = get("email"),
      date = get("date");
    const categoryId = get("category");
    const status = enquiryStatuses.find(
      (value): value is EnquiryStatus => value === get("status"),
    );
    if (!name || !get("phone") || !date || !categoryId || !status)
      throw Error("Complete all required enquiry fields.");
    await saveEnquiryRecord(
      {
        id: record?.id ?? "",
        name,
        email,
        categoryId,
        status,
        visit: get("visit"),
        visitId: full?.visitId,
        phone: get("phone"),
        relationship: get("relationship"),
        notes: get("notes"),
        remarks: get("remarks"),
        assignedId: get("assigned"),
      },
      full ?? record,
    );
  }
  const draft = full ?? record;
  const values: FormValues = draft
    ? {
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        relationship: draft.relationship,
        category: draft.categoryId,
        status: draft.status,
        date: iso(draft.date),
        visit: iso(draft.visit),
        notes: draft.notes,
        remarks: "",
        assigned: draft.assignedId,
      }
    : { status: "New", date: iso(new Date().toISOString()) };
  return (
    <>
      {record ? (
        <>
          <RecordAction
            action="edit"
            label="Edit enquiry"
            onClick={async () => {
              setIssue("");
              try {
                setFull(await enquiryDetail(record.id));
                setEditing(true);
              } catch (failure) {
                setIssue(errorMessage(failure));
              }
            }}
          />
          <RecordAction
            action="delete"
            label="Archive enquiry"
            onClick={() => setConfirming(true)}
          />
          <ConfirmAction
            title={confirming ? "Archive enquiry" : null}
            close={() => setConfirming(false)}
            action={() => archiveEnquiry(record.id)}
          />
        </>
      ) : (
        <button
          type="button"
          className={primaryButton}
          onClick={() => setEditing(true)}
        >
          + Add
        </button>
      )}
      {issue && (
        <p role="alert" className="text-error">
          {issue}
        </p>
      )}
      <ManagementForm
        title={editing ? (record ? "Edit enquiry" : "Add enquiry") : null}
        close={() => setEditing(false)}
        save={save}
        updating={!!record}
      >
        <FormFields
          fields={[
            ...enquiryFields.slice(0, 4),
            {
              name: "category",
              label: "Enquiry category",
              required: true,
              options: categories
                .filter((item) => item.is_active || item.id === draft?.categoryId)
                .map((item) => ({ value: item.id, label: categoryLabel(item.name) })),
            },
            ...enquiryFields.slice(4),
            {
              name: "assigned",
              label: "Assign to staff",
              options: [
                ...assignees.map((person) => ({ value: person.id, label: person.name })),
                ...(draft?.assignedId && !assignees.some((person) => person.id === draft.assignedId)
                  ? [{ value: draft.assignedId, label: "Previous assignee" }]
                  : []),
              ],
            },
          ]}
          values={values}
        />
      </ManagementForm>
    </>
  );
}

export function StaffRecordActions({ record }: { record: StaffAccount }) {
  const { deleteAccount } = usePortal();
  const [view, setView] = useState(false);
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <RecordAction
        action="visibility"
        label="View staff record"
        onClick={() => setView(true)}
      />
      <RecordAction
        action="delete"
        label="Delete staff record"
        onClick={() => setConfirming(true)}
      />
      <RecordDetails
        title={view ? record.name : null}
        entries={[
          ["Username", record.username],
          ["Institutional email", record.email],
          ["Phone", record.phone],
          ["Designation", record.designation],
          ["Account status", record.status],
        ]}
        close={() => setView(false)}
      />
      <ConfirmAction
        title={confirming ? "Delete staff record" : null}
        close={() => setConfirming(false)}
        action={() => deleteAccount(record.id)}
      />
    </>
  );
}

export function ArchiveResidentAction({ record }: { record: Resident }) {
  const { saveResident, dischargeResident } = usePortal();
  const [confirming, setConfirming] = useState(false);
  const [discharging, setDischarging] = useState(false);
  return (
    <>
      <RecordAction
        action="delete"
        label={
          record.status === "Discharged"
            ? "Archive resident"
            : "Cancel admission"
        }
        onClick={() => setConfirming(true)}
      />
      {record.status !== "Discharged" && (
        <button
          type="button"
          className={managementButton}
          onClick={() => setDischarging(true)}
        >
          Discharge
        </button>
      )}
      <ConfirmAction
        title={discharging ? "Discharge resident" : null}
        message="Confirm discharge and release the resident’s accommodation? Active reservations will be cancelled and history will be kept."
        close={() => setDischarging(false)}
        action={() => dischargeResident(record.id)}
      />
      <ConfirmAction
        title={confirming ? "Archive resident" : null}
        message="Archive this resident record? Any active admission and reservations will be cancelled, and accommodation history will be kept."
        close={() => setConfirming(false)}
        action={() => saveResident({ ...record, archived: true })}
      />
    </>
  );
}

export function RecordFeedback() {
  const { recordNotice, loading, error, retry } = usePortal();
  return (
    <>
      <PortalDataStatus loading={loading} error={error} retry={retry} />
      {recordNotice && (
        <p role="status" className="px-4 py-2 text-success">
          {recordNotice}
        </p>
      )}
    </>
  );
}
