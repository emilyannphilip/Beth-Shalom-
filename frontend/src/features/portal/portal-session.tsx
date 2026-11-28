"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  allRecords,
  errorMessage,
  fetchApiJson,
  jsonRequest,
  readPortalSession,
  sessionExpiredEvent,
} from "@/lib/api";
import {
  invalidateApi,
  useApiResource,
  availabilityRefreshMs,
  writeApi,
} from "@/lib/api-hooks";
import type { ApiInventoryCommand, Target } from "../accommodation/inventory";
import {
  dashboardRoute,
  type PortalRole,
  type PortalSession,
  type Enquiry,
  type EnquiryStatus,
  type Resident,
  type StaffAccount,
} from "./models";
import {
  emptyInventory,
  enquiryRecord,
  enquiryState,
  inventoryRecords,
  inventoryWrite,
  residentRecord,
  residentState,
  s,
  staffRecord,
  targetBody,
  type CategoryOption,
  type EnquiryCategoryRecord,
  type Row,
  type Summary,
} from "./portal-api";

const loadCategories = (signal: AbortSignal) =>
  allRecords<EnquiryCategoryRecord>("/enquiry-categories", { sortBy: "name", sortOrder: "asc" }, signal);
const loadAssignees = (signal: AbortSignal) =>
  fetchApiJson<CategoryOption[]>("/enquiries/assignees", { signal });
const loadAccounts = async (signal: AbortSignal) =>
  (await allRecords<Row>("/staff", {}, signal)).map(staffRecord);
const loadSummary = (signal: AbortSignal) =>
  fetchApiJson<Summary>("/dashboard/summary", { signal });
const loadResidents = async (signal: AbortSignal) =>
  (await allRecords<Row>("/residents", {}, signal)).map(residentRecord);

function usePortalState() {
  const [session, applySession] = useState<PortalSession | null>();
  const [sessionError, setSessionError] = useState("");
  const [recordNotice, setRecordNotice] = useState("");
  const sessionRevision = useRef(0);
  const pathname = usePathname();
  const isLogin = pathname === "/portal/login";
  useEffect(() => {
    if (!isLogin) return;
    let active = true;
    const revision = sessionRevision.current;
    readPortalSession().then(
      (current) => {
        if (active && revision === sessionRevision.current)
          applySession(current);
      },
      (error) => {
        if (active && revision === sessionRevision.current) {
          setSessionError(errorMessage(error));
          applySession(null);
        }
      },
    );
    return () => {
      active = false;
    };
  }, [isLogin]);
  const receiveSession = useCallback((actor: PortalSession) => {
    sessionRevision.current++;
    setSessionError("");
    applySession((current) =>
      current?.id === actor.id && current.role === actor.role ? current : actor,
    );
  }, []);
  const router = useRouter();
  const currentId = session?.id;
  useEffect(() => {
    if (!currentId) return;
    const revision = sessionRevision.current;
    let active = true;
    const expired = () => {
      if (!active || revision !== sessionRevision.current) return;
      sessionRevision.current++;
      applySession(null);
      invalidateApi();
      router.replace("/portal/login?expired=1");
    };
    const verify = () => {
      void readPortalSession().then(
        (current) => {
          if (!current) expired();
        },
        () => {
          // Leave the current screen available during an unrelated service interruption.
        },
      );
    };
    let lastVerified = Date.now();
    const checkWhenVisible = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastVerified >= 60_000
      ) {
        lastVerified = Date.now();
        verify();
      }
    };
    const timer = window.setInterval(checkWhenVisible, 60000);
    window.addEventListener(sessionExpiredEvent, expired);
    window.addEventListener("focus", checkWhenVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener(sessionExpiredEvent, expired);
      window.removeEventListener("focus", checkWhenVisible);
    };
  }, [currentId, router]);
  const sessionKey = session ? session.role + ":" + session.id : null;
  const dashboard =
    pathname === "/portal/admin" || pathname === "/portal/staff";
  const accountsPage = pathname === "/portal/admin/staff";
  const needsHousing =
    pathname.endsWith("/rooms") || pathname.endsWith("/residents");
  const role = session?.role ?? "staff";
  const summary = useApiResource(
    dashboard || needsHousing || accountsPage ? sessionKey : null,
    loadSummary,
    dashboard || needsHousing ? availabilityRefreshMs : 0,
  );
  const categoryData = useApiResource(
    dashboard ? sessionKey : null,
    loadCategories,
  );
  const assigneeData = useApiResource(dashboard ? sessionKey : null, loadAssignees);
  const accountData = useApiResource(
    role === "admin" && accountsPage ? sessionKey : null,
    loadAccounts,
  );
  const profiles = useApiResource(
    needsHousing ? sessionKey : null,
    loadResidents,
    availabilityRefreshMs,
  );
  const housing = useApiResource(
    needsHousing ? sessionKey : null,
    inventoryRecords,
    availabilityRefreshMs,
  );
  const accounts = accountData.data ?? [];
  const residents = profiles.data ?? [];
  const categories = categoryData.data ?? [];
  const inventory = housing.data?.inventory ?? emptyInventory;
  const buildings = housing.data?.buildings ?? [];
  const lookup = housing.data?.housingResidents ?? [];

  async function signIn(input: { username: string; password: string }) {
    const next = await fetchApiJson<PortalSession>(
      "/auth/login",
      jsonRequest("POST", input),
    );
    sessionRevision.current++;
    setSessionError("");
    applySession(next);
  }
  async function signOut() {
    await fetchApiJson("/auth/logout", jsonRequest("POST"));
    endSession();
  }

  function endSession() {
    sessionRevision.current++;
    applySession(null);
    invalidateApi();
  }

  async function saveStaff(
    record: StaffAccount,
    password: string,
    editing: boolean,
  ) {
    const knownRoles = await fetchApiJson<CategoryOption[]>("/roles");
    const role = knownRoles.find(
      (item) =>
        item.name ===
        (record.designation.endsWith("(Admin)") ? "ADMIN" : "STAFF"),
    );
    if (!role) throw Error("The staff roles could not be loaded.");
    await writeApi(
      editing ? `/staff/${record.id}` : "/staff",
      editing ? "PATCH" : "POST",
      {
        full_name: record.name,
        username: record.username,
        email: record.email,
        phone: record.phone || null,
        designation: record.designation,
        role_id: role.id,
        status: record.status.toUpperCase(),
        password: password || undefined,
      },
    );
  }

  async function saveEnquiryRecord(record: Pick<Enquiry, "id" | "categoryId" | "name" | "phone" | "email" | "notes" | "relationship" | "status" | "assignedId" | "remarks" | "visitId" | "visit">, previous?: Enquiry) {
    const editing = Boolean(previous);
    const data = {
      category_id: !previous || record.categoryId !== previous.categoryId
        ? record.categoryId
        : undefined,
      applicant_name: record.name,
      phone: record.phone,
      email: record.email || null,
      message: record.notes,
      details: { applicant_relationship: record.relationship },
      status: record.status !== (previous?.status ?? "New") ? enquiryState(record.status) : undefined,
      assigned_user_id: record.assignedId !== (previous?.assignedId ?? "") ? record.assignedId || null : undefined,
      followup_remarks: record.remarks || undefined,
      version: previous?.version,
      visit: record.visit !== (previous?.visit ?? "")
        ? { preferred_date: record.visit || null }
        : undefined,
      visit_id: record.visit !== previous?.visit ? record.visitId : undefined,
    };
    await writeApi(
      editing ? `/enquiries/${record.id}` : "/enquiries",
      editing ? "PATCH" : "POST",
      data,
    );
    setRecordNotice("Enquiry saved.");
  }

  async function saveResident(
    record: Resident,
    target?: Target,
    editing = true,
  ) {
    if (record.archived) {
      await writeApi(`/residents/${record.id}`, "DELETE");
      setRecordNotice("Resident archived and accommodation released.");
      return;
    }
    const previous = residents.find((row) => row.id === record.id);
    const data = {
      full_name: record.name,
      date_of_birth: record.dob,
      gender: record.gender,
      admission_date: record.admitted,
      phone: record.phone || null,
      email: record.email || null,
      expected_discharge_date: record.expectedDischarge || null,
      admission_category: record.category,
      address: record.address,
      remarks: record.remarks,
      accommodation: target ? targetBody(target) : undefined,
      emergency_contact: record.contactName
        ? {
            contact_type: "EMERGENCY",
            ...record.emergencyDetails,
            email: record.emergencyDetails?.email || null,
            contact_name: record.contactName,
            phone: record.contactPhone || null,
          }
        : null,
      guardian_contact: record.guardian
        ? {
            ...record.guardianDetails,
            email: record.guardianDetails?.email || null,
            phone: record.guardianDetails?.phone || null,
            contact_type: "GUARDIAN",
            contact_name: record.guardian,
          }
        : null,
      care: { ...record.medical, care_requirements: record.care },
    };
    const saved = await writeApi<Row>(
      editing ? `/residents/${record.id}` : "/residents",
      editing ? "PATCH" : "POST",
      editing && record.status !== "Discharged"
        ? { ...data, admission_status: residentState(record.status) }
        : data,
    );
    const id = s(saved, "id");
    if (record.status === "Discharged" && previous?.status !== "Discharged")
      await writeApi(`/residents/${id}/discharge`, "POST", {});
    else if (!editing && record.status !== "Admitted (Active)")
      await writeApi(`/residents/${id}`, "PATCH", {
        admission_status: residentState(record.status),
      });
    setRecordNotice("Resident saved.");
  }

  return {
    session,
    receiveSession,
    sessionError,
    signIn,
    signOut,
    endSession,
    recordNotice,
    accounts,
    residents,
    categories,
    assignees: assigneeData.data ?? [],
    inventory,
    buildings,
    housingResidents: lookup.map((row) => ({
      id: s(row, "id"),
      name: s(row, "full_name"),
      number: s(row, "resident_number"),
    })),
    summary: summary.data,
    loading: summary.loading || housing.loading || profiles.loading,
    error:
      summary.error ||
      housing.error ||
      profiles.error ||
      accountData.error ||
      categoryData.error ||
      assigneeData.error,
    retry: invalidateApi,
    residentName: (id: string) =>
      residents.find((row) => row.id === id)?.name ??
      s(lookup.find((row) => s(row, "id") === id) ?? {}, "full_name"),
    async dischargeResident(id: string) {
      await writeApi(`/residents/${id}/discharge`, "POST", {});
      setRecordNotice("Resident discharged and accommodation released.");
    },
    inventoryAction: (command: ApiInventoryCommand) =>
      inventoryWrite(command, inventory, buildings),
    saveStaff,
    saveResident,
    saveEnquiryRecord,
    saveEnquiry: async (id: string, status: EnquiryStatus, remarks: string) => {
      await writeApi(`/enquiries/${id}/followups`, "POST", {
        status: enquiryState(status),
        remarks: remarks || undefined,
      });
      setRecordNotice("Enquiry follow-up saved.");
    },
    enquiryDetail: async (id: string) =>
      enquiryRecord(await fetchApiJson<Row>(`/enquiries/${id}`), categories),
    deleteAccount: async (id: string) => {
      await writeApi(`/staff/${id}`, "DELETE");
      setRecordNotice("Staff account archived.");
    },
    archiveEnquiry: async (id: string) => {
      await writeApi(`/enquiries/${id}`, "DELETE");
      setRecordNotice("Enquiry archived.");
    },
  };
}

const Context = createContext<ReturnType<typeof usePortalState> | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  return (
    <Context.Provider value={usePortalState()}>{children}</Context.Provider>
  );
}
export function PortalSessionSeed({
  actor,
  children,
}: {
  actor: PortalSession;
  children: ReactNode;
}) {
  const { receiveSession } = usePortal();
  useEffect(() => receiveSession(actor), [actor, receiveSession]);
  return children;
}

export function usePortal() {
  const context = useContext(Context);
  if (!context) throw Error("The portal context is missing.");
  return context;
}

export function PortalRoute({
  role,
  children,
}: {
  role: PortalRole | "signed-in" | "guest";
  children: ReactNode;
}) {
  const { session, sessionError } = usePortal();
  const router = useRouter();
  const destination =
    session === undefined
      ? null
      : session
        ? role === "guest" || (role !== "signed-in" && role !== session.role)
          ? dashboardRoute(session.role)
          : null
        : role === "guest"
          ? null
          : "/portal/login";
  useEffect(() => {
    if (destination) router.replace(destination);
  }, [destination, router]);
  if (destination || (session === undefined && role !== "guest"))
    return (
      <p className="portal-route-status" role="status">
        Opening the portal…
      </p>
    );
  return (
    <>
      {sessionError && role === "guest" && (
        <p className="portal-route-status" role="alert">
          {sessionError}
        </p>
      )}
      {children}
    </>
  );
}

export function PortalDataStatus({
  loading,
  error,
  retry,
}: {
  loading?: boolean;
  error?: string;
  retry?: () => void;
}) {
  return (
    <>
      {loading && (
        <p role="status" className="px-4 py-2 text-on-surface-variant">
          Loading records…
        </p>
      )}
      {error && (
        <p role="alert" className="px-4 py-2 text-error">
          {error}{" "}
          {retry && (
            <button type="button" onClick={retry} className="underline">
              Try again
            </button>
          )}
        </p>
      )}
    </>
  );
}
