import type { Enquiry, Resident, StaffAccount } from "./models";
export const enquiries: Enquiry[] = [
  {
    id: "ENQ-2026-084",
    name: "Eleanor Vance",
    relationship: "Daughter: Claire Vance",
    phone: "(555) 234-8901",
    email: "claire.vance@mail.com",
    category: "Senior Admission & Room Tour",
    date: "Nov 17, 2026",
    visit: "Nov 22, 2026",
    status: "Pending",
    notes:
      "Inquiring for suite availability with balcony view. Mother needs mild mobility assistance in morning hours.",
    remarks: "Staff Nurse Robert conducted pre-check call on Nov 18.",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-warning-container text-warning",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-warning",
    categoryClass:
      "inline-flex items-center px-2.5 py-1 rounded-md text-label-sm font-medium bg-surface-variant text-on-surface-variant border border-outline-variant/40",
    staff: {
      notes:
        "Inquiring for suite availability with balcony view. Mother needs mild mobility assistance.",
      remarks: "Karen Lewis (RN) scheduled phone assessment for Nov 19.",
      badgeClass:
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-warning-container text-warning",
      badgeDot: "",
    },
  },
  {
    id: "ENQ-2026-083",
    name: "Arthur Pendelton",
    relationship: "Self Applicant",
    phone: "(555) 345-6712",
    email: "a.pendelton@domain.org",
    category: "Differently-Abled Supported Living",
    date: "Nov 16, 2026",
    visit: "Nov 20, 2026",
    status: "In Progress",
    notes:
      "Wheelchair accessibility required in all dining and garden corridors. Special physical therapy query.",
    remarks: "Tour scheduled with Occupational Therapist Sarah on Friday.",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-info-container text-info",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-info",
    categoryClass:
      "inline-flex items-center px-2.5 py-1 rounded-md text-label-sm font-medium bg-surface-variant text-on-surface-variant border border-outline-variant/40",
    staff: {
      notes: "Wheelchair accessibility required in dining and corridors.",
      remarks: "Physical Therapist Sarah Tanaka tagged for Friday walkthrough.",
      badgeClass:
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-info-container text-info",
      badgeDot: "",
    },
  },
  {
    id: "ENQ-2026-081",
    name: "Margaret & David Ross",
    relationship: "Guardian: Marcus Ross",
    phone: "(555) 892-4112",
    email: "m.ross.corp@outlook.com",
    category: "Detailed Suite & Floor Plan Inspection",
    date: "Nov 14, 2026",
    visit: "Nov 19, 2026",
    status: "Submitted",
    notes: "Couple inspection for Magnolia Deluxe Suite with kitchenette.",
    remarks:
      "Inspection completed on Nov 19. Signed application dossier transferred to Admissions Desk.",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-success-container text-success",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-success",
    categoryClass:
      "inline-flex items-center px-2.5 py-1 rounded-md text-label-sm font-medium bg-surface-variant text-on-surface-variant border border-outline-variant/40",
    staff: {
      notes: "Couple inspection for Magnolia Suite.",
      remarks: "Application completed and submitted.",
      badgeClass:
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-success-container text-success",
      badgeDot: "",
    },
  },
  {
    id: "ENQ-2026-080",
    name: "Grace Hopper-Bell",
    relationship: "Self Applicant",
    phone: "(555) 901-2244",
    email: "grace.bell@edu.net",
    category: "Facilities Enquiry",
    date: "Nov 18, 2026",
    visit: "Nov 25, 2026",
    status: "New",
    notes:
      "Requests information on hydrotherapy pool schedules and memory care garden access hours.",
    remarks: "New web submission received via Beth Shalom contact portal.",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-primary-container text-primary",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-primary",
    categoryClass:
      "inline-flex items-center px-2.5 py-1 rounded-md text-label-sm font-medium bg-surface-variant text-on-surface-variant border border-outline-variant/40",
  },
  {
    id: "ENQ-2026-076",
    name: "Dr. Simon Thorne",
    relationship: "Senior Fellowship Observer",
    phone: "(555) 761-0023",
    email: "sthorne@meduniv.ac",
    category: "General Institutional Walkthrough",
    date: "Nov 10, 2026",
    visit: "Nov 14, 2026",
    status: "Closed",
    notes:
      "Institutional benchmark walkthrough of Beth Shalom palliative amenities.",
    remarks:
      "Completed walkthrough with Resident Director. No further administrative action needed.",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-surface-variant text-on-surface-variant",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-outline",
    categoryClass:
      "inline-flex items-center px-2.5 py-1 rounded-md text-label-sm font-medium bg-surface-variant text-on-surface-variant border border-outline-variant/40",
  },
];
export const staff: StaffAccount[] = [
  {
    id: "staff.karen",
    name: "Karen Lewis",
    username: "staff.karen",
    email: "karen.lewis@bethshalom.org",
    phone: "(555) 432-8819",
    designation: "Registered Nurse (Care Staff)",
    status: "Active",
    avatarClass:
      "w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-label-sm",
  },
  {
    id: "staff.robert",
    name: "Robert Morales",
    username: "staff.robert",
    email: "r.morales@bethshalom.org",
    phone: "(555) 765-1102",
    designation: "Care Coordinator (Staff)",
    status: "Active",
    avatarClass:
      "w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center text-label-sm",
  },
  {
    id: "staff.stanaka",
    name: "Sarah Tanaka",
    username: "staff.stanaka",
    email: "s.tanaka@bethshalom.org",
    phone: "(555) 890-4431",
    designation: "Physical Therapist (Staff)",
    status: "Active",
    avatarClass:
      "w-8 h-8 rounded-full bg-info/20 text-info font-bold flex items-center justify-center text-label-sm",
  },
  {
    id: "staff.dwarner",
    name: "David Warner",
    username: "staff.dwarner",
    email: "d.warner@bethshalom.org",
    phone: "(555) 321-9944",
    designation: "Occupational Health Specialist (Staff)",
    status: "Inactive",
    avatarClass:
      "w-8 h-8 rounded-full bg-outline-variant text-on-surface-variant font-bold flex items-center justify-center text-label-sm",
  },
];
export const residents: Resident[] = [
  {
    id: "RES-2026-012",
    name: "Miriam Goldstein",
    dob: "May 14, 1944 (82 yrs)",
    ageLabel: "82 yrs",
    gender: "Female",
    admitted: "Jan 12, 2024",
    room: "Suite 204-B",
    category: "Senior Living & Residential Care",
    address: "742 Evergreen Way, Oakridge District",
    contactName: "David Goldstein",
    contactPhone: "(555) 302-8891",
    guardian: "Son & Primary Legal Healthcare Proxy (david.gold@mail.com)",
    care: "Mild arthritis in knees; requires assistance with morning physiotherapy; low-sodium diet; daily blood pressure monitoring.",
    status: "Admitted (Active)",
    remarks:
      "Resident enjoys afternoon classical music recitals in the courtyard library.",
    roomClass:
      "inline-flex items-center px-2.5 py-0.5 rounded bg-primary-container text-primary font-semibold font-code text-code-md",
    categoryDetail: "Garden Terrace Wing",
    contactLabel: "David Goldstein (Son)",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-success-container text-success",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-success",
    staffRoomClass:
      "py-3.5 px-4 font-code font-semibold text-primary whitespace-nowrap",
    staffSummary:
      "Mild arthritis in knees; assistance with morning physiotherapy; low-sodium diet.",
  },
  {
    id: "RES-2026-038",
    name: "Julian Sterling",
    dob: "Mar 28, 1952 (74 yrs)",
    ageLabel: "74 yrs",
    gender: "Male",
    admitted: "Aug 05, 2025",
    room: "Suite 112-A",
    category: "Supported Living (Differently-Abled)",
    address: "18 Pine Crest Boulevard",
    contactName: "Elena Sterling",
    contactPhone: "(555) 819-2044",
    guardian: "Daughter & Power of Attorney (elena.s@sterling.law)",
    care: "Full motorized wheelchair clearance required; bilateral grip support; routine speech and physical therapy thrice weekly.",
    status: "Admitted (Active)",
    remarks: "Prefers ground floor patio access during sunny mornings.",
    roomClass:
      "inline-flex items-center px-2.5 py-0.5 rounded bg-secondary-container text-secondary font-semibold font-code text-code-md",
    categoryDetail: "Ground Floor Accessible",
    contactLabel: "Elena Sterling (Daughter)",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-success-container text-success",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-success",
    staffRoomClass:
      "py-3.5 px-4 font-code font-semibold text-secondary whitespace-nowrap",
    staffSummary:
      "Full motorized wheelchair clearance; bilateral grip support; routine speech therapy.",
  },
  {
    id: "RES-2026-055",
    name: "Hannah Braverman",
    dob: "Oct 02, 1938 (88 yrs)",
    ageLabel: "88 yrs",
    gender: "Female",
    admitted: "Feb 20, 2026",
    room: "Suite 305-C",
    category: "Memory & Cognitive Wellness Care",
    address: "302 Birchwood Avenue",
    contactName: "Samuel Braverman",
    contactPhone: "(555) 674-0012",
    guardian: "Brother & Family Representative",
    care: "Early-to-moderate dementia; wander-alert sensor bracelet; sensory stimulation garden schedule; diabetic diet regimen.",
    status: "Admitted (Active)",
    remarks:
      "Responds warmly to botanical scent therapy and watercolor painting sessions.",
    roomClass:
      "inline-flex items-center px-2.5 py-0.5 rounded bg-tertiary/15 text-tertiary font-semibold font-code text-code-md",
    categoryDetail: "Serenity Wing",
    contactLabel: "Samuel Braverman (Brother)",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-success-container text-success",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-success",
  },
  {
    id: "RES-2026-079",
    name: "Albert Fincher",
    dob: "Jun 19, 1947 (79 yrs)",
    ageLabel: "79 yrs",
    gender: "Male",
    admitted: "Nov 01, 2025",
    room: "Suite 108-B",
    category: "Restorative Palliative Suite",
    address: "88 Maple Ridge Road",
    contactName: "Ruth Fincher",
    contactPhone: "(555) 438-9902",
    guardian: "Spouse (ruth.fincher@home.net)",
    care: "Temporary admission to St. Jude Cardiac Pavilion for valve checkup; bed held under Beth Shalom reservation agreement.",
    status: "Hospitalized / Temporary Leave",
    remarks: "Expected to return to Beth Shalom care suite on Monday.",
    roomClass:
      "inline-flex items-center px-2.5 py-0.5 rounded bg-surface-variant text-on-surface-variant font-semibold font-code text-code-md",
    categoryDetail: "Meadowview Wing",
    contactLabel: "Ruth Fincher (Spouse)",
    badgeClass:
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold bg-warning-container text-warning",
    badgeDot: "w-1.5 h-1.5 rounded-full bg-warning",
  },
];
