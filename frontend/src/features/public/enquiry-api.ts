import { fetchApiJson, jsonRequest } from "@/lib/api";
import { enquiryCategories } from "../portal/models";
import type { AvailabilityRow } from "../accommodation/availability";
export type { AvailabilityRow } from "../accommodation/availability";

export const childrenSupportSource = "HOME_CHILDREN_SUPPORT";
export const childrenSupportTopic =
  "Care & Support for Differently-Abled Children";

export type Source =
  | "WELCOME_ENQUIRY"
  | "ROOM_APPLICATION"
  | "DORMITORY_ENQUIRY"
  | "HARMONY_SUITE_APPLICATION"
  | "ADMISSION_ENQUIRY"
  | "FACILITIES_ENQUIRY"
  | "CAMPUS_WALKTHROUGH"
  | "CONTACT_ENQUIRY"
  | typeof childrenSupportSource;
type Category = { id: string; name: string; public_topic: string | null };
export type Receipt = { id: string; enquiry_number: string; status: string };
export const categoryLabel = (name: string) =>
  name === "Differently-Abled Support Living"
    ? enquiryCategories[1]
    : name === "Facilities"
      ? enquiryCategories[3]
      : name;

export async function submitEnquiry(form: HTMLFormElement, source: Source) {
  const data = new FormData(form);
  const value = (...names: string[]) =>
    names.map((name) => String(data.get(name) ?? "").trim()).find(Boolean);
  const label = (name: string) => {
    const input = form.elements.namedItem(name);
    return input instanceof HTMLSelectElement && input.value
      ? input.selectedOptions[0]?.textContent?.trim()
      : value(name);
  };
  const topic =
    value("type", "purpose") ??
    label("visitPurpose") ??
    label("accommodationType") ??
    label("selectedCategory") ??
    value("room-category") ??
    {
      WELCOME_ENQUIRY: "Welcome enquiry",
      ROOM_APPLICATION: "Room application",
      DORMITORY_ENQUIRY: "Dormitory enquiry",
      HARMONY_SUITE_APPLICATION: "Harmony Suite application",
      ADMISSION_ENQUIRY: "Admission enquiry",
      FACILITIES_ENQUIRY: "Facilities enquiry",
      CAMPUS_WALKTHROUGH: "Campus walkthrough",
      CONTACT_ENQUIRY: "Contact enquiry",
      HOME_CHILDREN_SUPPORT: childrenSupportTopic,
    }[source];
  const contactTopic = value("visitPurpose");
  const care = value("careRequirement");
  const categoryIndex =
    source === "HARMONY_SUITE_APPLICATION" ||
    contactTopic === "suite-visualizer"
      ? 2
      : source === "CAMPUS_WALKTHROUGH" ||
          topic === "Campus visit" ||
          contactTopic === "general-inquiry"
        ? 4
        : source === childrenSupportSource ||
            contactTopic === "differently-abled" ||
            (source === "ADMISSION_ENQUIRY" &&
              care?.startsWith("Special Needs"))
          ? 1
          : source === "FACILITIES_ENQUIRY" ||
              topic === "Care and facilities" ||
              contactTopic === "spiritual-dayara"
            ? 3
            : 0;
  const chosenRoom = value(
    "room-category",
    "selectedCategory",
    "accommodationType",
  );
  const accommodationId = value("accommodation-category-id");
  const needsAccommodation = Boolean(
    accommodationId || chosenRoom || source === "HARMONY_SUITE_APPLICATION",
  );
  const [categories, rooms] = await Promise.all([
    fetchApiJson<Category[]>("/public/enquiry-categories"),
    needsAccommodation
      ? fetchApiJson<AvailabilityRow[]>("/public/availability")
      : [],
  ]);
  const category = categories.find(
    (row) => categoryLabel(row.public_topic ?? "") === enquiryCategories[categoryIndex],
  );
  if (!category)
    throw Error(
      "This enquiry category is temporarily unavailable. Please try again later.",
    );
  const roomCode =
    source === "HARMONY_SUITE_APPLICATION"
      ? "HARMONY"
      : chosenRoom?.split(/[ (]/)[0].toUpperCase();
  const room = rooms.find((row) =>
    accommodationId
      ? row.category_id === accommodationId
      : row.category_code === roomCode ||
        row.category_name.toLowerCase() === chosenRoom?.toLowerCase(),
  );
  if (accommodationId && !room)
    throw Error(
      "This accommodation category has changed. Reopen the form and select it again.",
    );
  const date = value("visit-date", "tourDate", "visitDate");
  const notes = value(
    "message",
    "additional-information",
    "specialNotes",
    "notes",
    "specialNeeds",
    "additionalNotes",
  );
  const age = value("age");
  const selectedLabel =
    label("accommodationType") ??
    label("selectedCategory") ??
    value("room-category");
  const childAge = value("child-age");
  return fetchApiJson<Receipt>(
    "/public/enquiries",
    jsonRequest("POST", {
      category_id: category.id,
      source_form: source,
      original_topic: topic,
      applicant_name: value("name", "full-name", "fullName", "applicantName"),
      phone: (
        (value("countryCode") ?? "") +
        (value("phone", "phoneNumber", "applicantPhone") ?? "")
      ).replace(/[().\s-]/g, ""),
      email: value("email", "emailAddress", "applicantEmail"),
      whatsapp_available: data.has("whatsappAvailable"),
      message: notes,
      child_support:
        source === childrenSupportSource
          ? {
              child_name: value("child-name"),
              child_age: childAge ? Number(childAge) : undefined,
              accommodation_requirements: value("accommodation-requirements"),
              care_requirements: value("care-requirements"),
            }
          : undefined,
      details: {
        ...(age ? { age: Number(age) } : {}),
        gender: value("gender"),
        address: value("address"),
        accommodation_category_id: room?.category_id,
        care_requirement: care,
        residence_type: value("residenceStatus"),
        expected_move_in: value("timeline"),
        medical_notes:
          source === "HARMONY_SUITE_APPLICATION" ? notes : undefined,
        contact_consent:
          data.has("consent") ||
          data.has("privacyConsent") ||
          data.has("consentAgree"),
      },
      visit: date
        ? {
            preferred_date: date,
            preferred_time: value("visit-time"),
            preferred_time_slot: value("visitSlot"),
            visitor_count: value("visitors")
              ? Number(value("visitors"))
              : undefined,
            purpose:
              value("purpose") ??
              (source === "CONTACT_ENQUIRY" ? topic : selectedLabel),
            remarks: value("notes", "specialNeeds"),
          }
        : undefined,
    }),
  );
}
