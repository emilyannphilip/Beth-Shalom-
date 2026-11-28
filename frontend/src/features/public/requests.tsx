"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useModal } from "./modal";
import { errorMessage } from "@/lib/api";
import {
  childrenSupportSource,
  submitEnquiry,
  type Receipt,
  type Source,
} from "./enquiry-api";

const INDIA_TIME_ZONE = "Asia/Kolkata";
const phonePattern = "[+]?[0-9](?:[0-9 .\\-]*[0-9])?";

const indiaClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: INDIA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function currentIndiaDateTime() {
  const { year, month, day, hour, minute } = Object.fromEntries(
    indiaClock.formatToParts().map(({ type, value }) => [type, value]),
  );
  return { date: `${year}-${month}-${day}`, time: `${hour}:${minute}` };
}

function validateWalkthroughTime(form: HTMLFormElement) {
  const date = form.elements.namedItem("visit-date");
  const time = form.elements.namedItem("visit-time");
  if (
    !(date instanceof HTMLInputElement) ||
    !(time instanceof HTMLInputElement)
  )
    return;
  const now = currentIndiaDateTime();
  date.min = now.date;
  time.setCustomValidity(
    date.value === now.date && time.value && time.value <= now.time
      ? "Choose a future visit time in India Standard Time."
      : "",
  );
}

function RequestInput({
  label,
  optional,
  ...props
}: ComponentProps<"input"> & { label: string; optional?: boolean }) {
  return (
    <label>
      <span>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
        {optional && <small> (optional)</small>}
      </span>
      <input {...props} />
    </label>
  );
}

function RequestNotes({
  label,
  required,
  ...props
}: ComponentProps<"textarea"> & { label: string }) {
  return (
    <label className="request-dialog-wide">
      <span>
        {label}
        {required ? (
          <span aria-hidden="true"> *</span>
        ) : (
          <small> (optional)</small>
        )}
      </span>
      <textarea {...props} required={required} />
    </label>
  );
}

function RoomFields({ category }: { category: string }) {
  return (
    <>
      <RequestInput
        label="Age of Applicant"
        name="age"
        type="number"
        min={0}
        max={125}
        step={1}
        inputMode="numeric"
        required
      />
      <label>
        <span>
          Gender <span aria-hidden="true">*</span>
        </span>
        <select name="gender" required defaultValue="">
          <option value="">Select an option</option>
          {[
            "Female",
            "Male",
            "Non-binary",
            "Another gender",
            "Prefer not to say",
          ].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <RequestInput
        label="Room Category"
        name="room-category"
        type="text"
        value={category}
        readOnly
      />
      <RequestNotes
        label="Address"
        name="address"
        autoComplete="street-address"
        maxLength={500}
        required
      />
      <RequestNotes
        label="Additional Information / Special Requirements"
        name="additional-information"
        maxLength={1500}
      />
    </>
  );
}

function WalkthroughFields({ minDate }: { minDate: string }) {
  return (
    <>
      <RequestInput
        label="Number of Visitors"
        name="visitors"
        type="number"
        min={1}
        step={1}
        inputMode="numeric"
        required
      />
      <RequestInput
        label="Preferred Visit Date"
        name="visit-date"
        type="date"
        min={minDate}
        required
      />
      <RequestInput
        label="Preferred Visit Time (IST)"
        name="visit-time"
        type="time"
        required
      />
      <RequestInput
        label="Purpose of Visit"
        name="purpose"
        type="text"
        maxLength={240}
        required
      />
      <RequestNotes
        label="Additional Notes / Special Requirements"
        name="notes"
        maxLength={1500}
      />
    </>
  );
}

function ChildrenSupportFields() {
  return (
    <>
      <RequestInput
        label="Child’s Name"
        name="child-name"
        type="text"
        maxLength={150}
        optional
      />
      <RequestInput
        label="Child’s Age"
        name="child-age"
        type="number"
        inputMode="numeric"
        min={0}
        max={130}
        step={1}
        optional
      />
      <RequestNotes
        label="Accommodation Requirements"
        name="accommodation-requirements"
        rows={2}
        maxLength={1500}
        required
      />
      <RequestNotes
        label="Care and Support Requirements"
        name="care-requirements"
        rows={2}
        maxLength={1500}
        aria-describedby="children-support-privacy"
      />
      <small id="children-support-privacy" className="request-dialog-wide">
        Share practical support needs only. Please leave out diagnoses and
        medical records.
      </small>
      <RequestNotes
        label="Additional Message"
        name="message"
        rows={2}
        maxLength={1500}
        required
      />
    </>
  );
}

const requestTypes = {
  room: {
    title: "Apply for This Room Category",
    result: "Application received",
    submit: "Submit Application",
    source: "ROOM_APPLICATION",
  },
  dormitory: {
    title: "Enquire About Dormitory Accommodation",
    result: "Enquiry received",
    submit: "Submit Enquiry",
    source: "DORMITORY_ENQUIRY",
  },
  facilities: {
    title: "Enquire About Facilities",
    result: "Enquiry received",
    submit: "Submit Request",
    source: "FACILITIES_ENQUIRY",
  },
  walkthrough: {
    title: "Schedule the Campus Walkthrough",
    result: "Visit request received",
    submit: "Submit Request",
    source: "CAMPUS_WALKTHROUGH",
  },
  "children-support": {
    title: "Enquire About Care & Support",
    result: "Enquiry received",
    submit: "Submit Enquiry",
    source: childrenSupportSource,
  },
} satisfies Record<
  string,
  { title: string; result: string; submit: string; source: Source }
>;

export function RequestAction({
  kind,
  category = "",
  categoryId,
  children,
  ...props
}: ComponentProps<"button"> & {
  kind: keyof typeof requestTypes;
  category?: string;
  categoryId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const [minDate, setMinDate] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const request = requestTypes[kind];
  const childSupport = kind === "children-support";
  const titleId = `${kind}-request-title`;
  const noteId = `${kind}-request-note`;
  const dismiss = () => {
    if (!busy.current) setOpen(false);
  };
  const dialog = useModal(open, dismiss, 'input[name="full-name"]');

  useEffect(() => {
    if (receipt) resultHeading.current?.focus();
  }, [receipt]);

  return (
    <>
      <button
        {...props}
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          if (kind === "walkthrough") setMinDate(currentIndiaDateTime().date);
          setReceipt(null);
          setError("");
          setOpen(true);
        }}
      >
        {children}
      </button>
      <dialog
        {...dialog}
        className="request-dialog"
        aria-labelledby={titleId}
        aria-describedby={noteId}
        onClick={(event) => {
          if (event.target === event.currentTarget) dismiss();
        }}
      >
        {open && (
          <div className="request-dialog-panel">
            <button
              className="request-dialog-close"
              type="button"
              aria-label="Close form"
              disabled={pending}
              onClick={dismiss}
            >
              ×
            </button>
            <h2 id={titleId} className="font-headline-lg text-headline-lg">
              {request.title}
            </h2>
            <p id={noteId} className="request-dialog-note">
              We will use these details to respond to your request.
            </p>
            {receipt ? (
              <div className="request-dialog-result">
                <h3 ref={resultHeading} tabIndex={-1}>
                  {request.result}
                </h3>
                <p>Reference {receipt.enquiry_number}.</p>
                <div className="request-dialog-actions">
                  <button
                    type="button"
                    className="request-dialog-primary"
                    onClick={dismiss}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form
                noValidate
                aria-busy={pending}
                onInput={(event) => {
                  if (event.target instanceof HTMLInputElement)
                    event.target.setCustomValidity("");
                  validateWalkthroughTime(event.currentTarget);
                }}
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  for (const field of form.querySelectorAll<
                    HTMLInputElement | HTMLTextAreaElement
                  >("[required]")) {
                    if (
                      field instanceof HTMLTextAreaElement ||
                      ["text", "email", "tel"].includes(field.type)
                    ) {
                      field.value = field.value.trim();
                    }
                  }
                  const phone = form.elements.namedItem("phone");
                  if (
                    phone instanceof HTMLInputElement &&
                    phone.value.replace(/\D/g, "").length < 7
                  ) {
                    phone.setCustomValidity(
                      "Enter a phone number with at least seven digits.",
                    );
                  }
                  validateWalkthroughTime(form);
                  if (!form.reportValidity() || busy.current) return;
                  busy.current = true;
                  setPending(true);
                  setError("");
                  try {
                    setReceipt(await submitEnquiry(form, request.source));
                  } catch (failure) {
                    setError(errorMessage(failure));
                  } finally {
                    setPending(false);
                    busy.current = false;
                  }
                }}
              >
                {categoryId && (
                  <input
                    type="hidden"
                    name="accommodation-category-id"
                    value={categoryId}
                  />
                )}
                <div className="request-dialog-fields">
                  <RequestInput
                    label={
                      childSupport ? "Parent / Guardian Name" : "Full Name"
                    }
                    name="full-name"
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    required
                  />
                  <RequestInput
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                  <RequestInput
                    label={childSupport ? "Contact Number" : "Phone Number"}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern={phonePattern}
                    minLength={7}
                    maxLength={22}
                    required
                  />
                  {kind === "room" && <RoomFields category={category} />}
                  {kind === "facilities" && (
                    <RequestNotes
                      label="Facilities question"
                      name="message"
                      maxLength={1500}
                      required
                    />
                  )}
                  {kind === "dormitory" && (
                    <>
                      <RequestInput
                        label="Accommodation category"
                        name="room-category"
                        value={category}
                        readOnly
                      />
                      <RequestNotes
                        label="Enquiry details"
                        name="message"
                        maxLength={1500}
                        required
                      />
                    </>
                  )}
                  {kind === "walkthrough" && (
                    <WalkthroughFields minDate={minDate} />
                  )}
                  {childSupport && <ChildrenSupportFields />}
                </div>
                {childSupport && (
                  <label className="mt-4 flex items-start gap-2">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <span>I consent to be contacted about this enquiry.</span>
                  </label>
                )}
                {pending && (
                  <p role="status" className="mt-3">
                    Sending your request…
                  </p>
                )}
                {error && (
                  <p role="alert" className="mt-3 text-error">
                    {error}
                  </p>
                )}
                <div className="request-dialog-actions">
                  <button type="button" disabled={pending} onClick={dismiss}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="request-dialog-primary"
                  >
                    {pending ? "Sending…" : request.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
