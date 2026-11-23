"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useModal } from "./modal";

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

export function RequestAction({
  kind,
  category = "",
  children,
  ...props
}: ComponentProps<"button"> & {
  kind: "room" | "walkthrough";
  category?: string;
}) {
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [minDate, setMinDate] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const room = kind === "room";
  const titleId = `${kind}-request-title`;
  const noteId = `${kind}-request-note`;
  const dismiss = () => setOpen(false);
  const dialog = useModal(open, dismiss, 'input[name="full-name"]');

  useEffect(() => {
    if (validated) resultHeading.current?.focus();
  }, [validated]);

  return (
    <>
      <button
        {...props}
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setMinDate(currentIndiaDateTime().date);
          setValidated(false);
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
              onClick={dismiss}
            >
              ×
            </button>
            <h2 id={titleId} className="font-headline-lg text-headline-lg">
              {room
                ? "Apply for This Room Category"
                : "Schedule the Campus Walkthrough"}
            </h2>
            <p id={noteId} className="request-dialog-note">
              Preview only. Details are cleared when you close or submit this
              form.
            </p>
            {validated ? (
              <div className="request-dialog-result">
                <h3 ref={resultHeading} tabIndex={-1}>
                  {room
                    ? "Preview application validated"
                    : "Preview visit request validated"}
                </h3>
                <p>
                  No details were sent or saved. No application or booking was
                  created.
                </p>
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
                onInput={(event) => {
                  if (event.target instanceof HTMLInputElement)
                    event.target.setCustomValidity("");
                  validateWalkthroughTime(event.currentTarget);
                }}
                onSubmit={(event) => {
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
                  if (form.reportValidity()) setValidated(true);
                }}
              >
                <div className="request-dialog-fields">
                  <RequestInput
                    label="Full Name"
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
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern={phonePattern}
                    minLength={7}
                    maxLength={22}
                    required
                  />
                  {room ? (
                    <RoomFields category={category} />
                  ) : (
                    <WalkthroughFields minDate={minDate} />
                  )}
                </div>
                <div className="request-dialog-actions">
                  <button type="button" onClick={dismiss}>
                    Cancel
                  </button>
                  <button type="submit" className="request-dialog-primary">
                    {room ? "Submit Application" : "Submit Request"}
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
