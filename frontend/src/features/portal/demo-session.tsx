"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  enquiries as enquiryFixtures,
  residents as residentFixtures,
  staff as staffFixtures,
} from "./fixtures";
import {
  dashboardRoute,
  type DemoRole,
  type DemoSession,
  type Enquiry,
  type EnquiryStatus,
  type Resident,
  type StaffAccount,
} from "./models";

export const demoCredentials = {
  admin: {
    username: "admin.bethshalom",
    password: "AdminPassSecure2026!",
    name: "Admin Director",
  },
  staff: {
    username: "staff.karen",
    password: "CareStaff2026!",
    name: "Karen Lewis, RN",
  },
} as const;

const sessionKey = "beth-shalom-portal-demo";
type PortalState = {
  session: DemoSession | null | undefined;
  accounts: StaffAccount[];
  enquiries: Enquiry[];
  residents: Resident[];
  signIn: (username: string, password: string) => DemoSession | null;
  setSession: (session: DemoSession | null) => void;
  saveEnquiry: (id: string, status: EnquiryStatus, remarks: string) => void;
  saveAccount: (account: StaffAccount) => void;
  saveResident: (resident: Resident) => void;
};
const Context = createContext<PortalState | null>(null);

function restoreDemoSession(): DemoSession | null {
  try {
    const raw = sessionStorage.getItem(sessionKey);
    if (!raw) return null;
    const session: unknown = JSON.parse(raw);
    if (
      typeof session === "object" &&
      session &&
      "role" in session &&
      "name" in session &&
      (session.role === "admin" || session.role === "staff") &&
      typeof session.name === "string"
    ) {
      return { role: session.role, name: session.name };
    }
  } catch {
    // Storage can be disabled. A demo session can still run in memory.
  }
  return null;
}

function upsert<T extends { id: string }>(items: T[], record: T): T[] {
  return items.some(({ id }) => id === record.id)
    ? items.map((item) => (item.id === record.id ? record : item))
    : [...items, record];
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [session, applySession] = useState<DemoSession | null>();
  const [accounts, setAccounts] = useState(staffFixtures);
  const [enquiries, setEnquiries] = useState(enquiryFixtures);
  const [residents, setResidents] = useState(residentFixtures);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      applySession(restoreDemoSession()),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  function setSession(next: DemoSession | null) {
    applySession(next);
    try {
      if (next) sessionStorage.setItem(sessionKey, JSON.stringify(next));
      else sessionStorage.removeItem(sessionKey);
    } catch {
      /* The in-memory session still works. */
    }
  }

  function signIn(username: string, password: string): DemoSession | null {
    const identity = username.trim().toLowerCase();
    const account = accounts.find(
      (row) => row.username.toLowerCase() === identity,
    );
    if (account?.status === "Inactive") return null;
    if (account?.demoPassword) {
      if (account.demoPassword !== password) return null;
      return {
        name: account.name,
        role:
          account.designation === "Executive Admin Director (Admin)"
            ? "admin"
            : "staff",
      };
    }
    const role = (Object.keys(demoCredentials) as DemoRole[]).find(
      (key) =>
        demoCredentials[key].username === identity &&
        demoCredentials[key].password === password,
    );
    return role ? { role, name: demoCredentials[role].name } : null;
  }

  function saveEnquiry(id: string, status: EnquiryStatus, remarks: string) {
    if (!session) return;
    const audit = {
      role: session.role,
      time: new Date().toISOString(),
      status,
      remarks,
    };
    setEnquiries((rows) =>
      rows.map((row) =>
        row.id === id && (session.role === "admin" || row.staff)
          ? { ...row, status, remarks, audit: [...(row.audit ?? []), audit] }
          : row,
      ),
    );
  }

  return (
    <Context.Provider
      value={{
        session,
        accounts,
        enquiries,
        residents,
        signIn,
        setSession,
        saveEnquiry,
        saveAccount: (record) => {
          if (session?.role === "admin")
            setAccounts((rows) => upsert(rows, record));
        },
        saveResident: (record) => {
          if (session?.role === "admin")
            setResidents((rows) => upsert(rows, record));
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useDemo() {
  const state = useContext(Context);
  if (!state) throw new Error("The demo portal state is missing.");
  return state;
}

/** Controls demo navigation only. Real authorization belongs to the server in a later phase. */
export function DemoRoute({
  role,
  children,
}: {
  role: DemoRole | "signed-in" | "guest";
  children: ReactNode;
}) {
  const { session } = useDemo();
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

  if (destination || (session === undefined && role !== "guest")) {
    return (
      <p className="portal-route-status" role="status">
        Opening the demo portal…
      </p>
    );
  }
  return children;
}
