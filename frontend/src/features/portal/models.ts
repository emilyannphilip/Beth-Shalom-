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

export type PortalRole = "admin" | "staff";
export type EnquiryStatus = (typeof enquiryStatuses)[number];
export type StaffDesignation = (typeof staffDesignations)[number];
export type ResidentCategory = (typeof residentCategories)[number];
export type ResidentStatus = (typeof residentStatuses)[number];

export interface PortalSession {
  id: string;
  role: PortalRole;
  name: string;
}

export interface Enquiry {
  number?: string;
  categoryId?: string;
  version?: number;
  source?: string;
  originalTopic?: string;
  childAge?: number;
  supportRequirements?: string;
  assignedId?: string;
  visitId?: string;
  archived?: boolean;
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  category: string;
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
    role: PortalRole;
    time: string;
    status: EnquiryStatus;
    remarks: string;
  }>;
}

export interface StaffAccount {
  number?: string;
  roleId?: string;
  archived?: boolean;
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  designation: StaffDesignation;
  status: "Active" | "Inactive";
  avatarClass: string;
}

export const medicalFields = {
  medical_conditions: "Medical conditions",
  allergies: "Allergies",
  dietary_requirements: "Dietary requirements",
  mobility_requirements: "Mobility requirements",
  special_instructions: "Special instructions",
};

export const contactFields = {
  relationship: "relationship",
  email: "email",
  address: "address",
};

export interface Resident {
  email?: string;
  medical?: Record<string, string>;
  emergencyDetails?: Record<string, string>;
  guardianDetails?: Record<string, string>;
  number?: string;
  history?: { action: string; date: string; target?: string }[];
  archived?: boolean;
  accommodation?: {
    type: "Room" | "Dormitory";
    category: string;
    categoryId: string;
    room: string;
    dormitory: string;
    bed: string;
    floor?: number | null;
  };
  id: string;
  name: string;
  dob: string;
  ageLabel: string;
  gender: string;
  admitted: string;
  phone?: string;
  expectedDischarge?: string;
  discharged?: string;
  room: string;
  roomClass: string;
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

export function dashboardRoute(role: PortalRole) {
  return role === "admin" ? "/portal/admin" : "/portal/staff";
}
