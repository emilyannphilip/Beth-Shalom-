export const enquiryCategories = [
  "Senior Admission & Room Tour",
  "Differently-Abled Supported Living",
  "Detailed Suite & Floor Plan Inspection",
  "Facilities Enquiry",
  "General Institutional Walkthrough",
] as const;

export const enquiryStatuses = [
  "New",
  "Pending",
  "In Progress",
  "Submitted",
  "Closed",
] as const;

export const staffDesignations = [
  "Registered Nurse (Care Staff)",
  "Care Coordinator (Staff)",
  "Physical Therapist (Staff)",
  "Occupational Health Specialist (Staff)",
  "Executive Admin Director (Admin)",
] as const;

export const residentCategories = [
  "Senior Living & Residential Care",
  "Supported Living (Differently-Abled)",
  "Memory & Cognitive Wellness Care",
  "Restorative Palliative Suite",
] as const;

export const residentStatuses = [
  "Admitted (Active)",
  "Hospitalized / Temporary Leave",
  "Discharged",
] as const;

export type DemoRole = "admin" | "staff";
export type EnquiryCategory = (typeof enquiryCategories)[number];
export type EnquiryStatus = (typeof enquiryStatuses)[number];
export type StaffDesignation = (typeof staffDesignations)[number];
export type ResidentCategory = (typeof residentCategories)[number];
export type ResidentStatus = (typeof residentStatuses)[number];

export interface DemoSession {
  role: DemoRole;
  name: string;
}

export interface Enquiry {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  category: EnquiryCategory;
  date: string;
  visit: string;
  status: EnquiryStatus;
  notes: string;
  remarks: string;
  badgeClass: string;
  badgeDot: string;
  categoryClass: string;
  staff?: {
    notes: string;
    remarks: string;
    badgeClass: string;
    badgeDot: string;
  };
  audit?: ReadonlyArray<{
    role: DemoRole;
    time: string;
    status: EnquiryStatus;
    remarks: string;
  }>;
}

export interface StaffAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  designation: StaffDesignation;
  status: "Active" | "Inactive";
  avatarClass: string;
  demoPassword?: string;
}

export interface Resident {
  id: string;
  name: string;
  dob: string;
  ageLabel: string;
  gender: string;
  admitted: string;
  room: string;
  roomClass: string;
  staffRoomClass?: string;
  staffSummary?: string;
  category: ResidentCategory;
  categoryDetail: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactLabel: string;
  guardian: string;
  care: string;
  remarks: string;
  status: ResidentStatus;
  badgeClass: string;
  badgeDot: string;
}

export type StaffResident = Pick<
  Resident,
  | "id"
  | "name"
  | "room"
  | "staffRoomClass"
  | "category"
  | "status"
  | "care"
  | "contactLabel"
  | "contactPhone"
> & { summary: string };

export function dashboardRoute(role: DemoRole) {
  return role === "admin" ? "/portal/admin" : "/portal/staff";
}
