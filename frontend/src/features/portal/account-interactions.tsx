"use client";

import { useRef, useState, type FormEvent } from "react";
import { errorMessage } from "@/lib/api";
import { writeApi } from "@/lib/api-hooks";
import { usePortal } from "./portal-session";
import { staffRecord } from "./portal-api";
import { useServerGrid } from "./server-grid";
import { type StaffAccount, staffDesignations } from "./models";

const blank = {
  name: "",
  username: "",
  email: "",
  phone: "",
  designation: staffDesignations[0],
  status: "Active",
} as const;

export function useStaffManagement() {
  const { accounts, summary, saveStaff } = usePortal();
  const [editing, setEditing] = useState<StaffAccount | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const [confirmation, setConfirmation] = useState<{
    action: "toggle" | "reset";
    account: StaffAccount;
  } | null>(null);
  const grid = useServerGrid(
    "/staff",
    4,
    staffRecord,
    ({ search, category, status, sort }) => ({
      search,
      designation: category === "ALL" ? undefined : category,
      status: status === "ALL" ? undefined : status.toUpperCase(),
      sortBy: sort === "newest" ? "created_at" : "full_name",
      sortOrder: sort === "az" ? "asc" : "desc",
    }),
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmationField = form.elements.namedItem("confirmation");
    if (
      password !== String(data.get("confirmation") ?? "") &&
      confirmationField instanceof HTMLInputElement
    ) {
      confirmationField.setCustomValidity("Passwords must match.");
      confirmationField.reportValidity();
      return;
    }
    busy.current = true;
    setPending(true);
    setError("");
    try {
      await saveStaff(
        {
          id: editing?.id ?? "",
          name: value("name"),
          username: value("username"),
          email: value("email"),
          phone: value("phone"),
          designation:
            staffDesignations.find((item) => item === value("designation")) ??
            staffDesignations[0],
          status: value("status") === "Inactive" ? "Inactive" : "Active",
          avatarClass: "",
        },
        password,
        Boolean(editing),
      );
      setOpen(false);
      setMessage(editing ? "Staff account updated." : "Staff account created.");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return {
    counts: {
      total: summary?.total_staff ?? accounts.length,
      active: summary?.active_staff ?? 0,
      inactive:
        (summary?.total_staff ?? accounts.length) -
        (summary?.active_staff ?? 0),
      admins: accounts.filter((row) => row.designation.endsWith("(Admin)"))
        .length,
    },
    editing,
    open,
    grid,
    values: editing ?? blank,
    confirmation,
    message,
    error,
    pending,
    submit,
    onInput(event: FormEvent<HTMLFormElement>) {
      if (event.target instanceof HTMLInputElement) {
        event.target.setCustomValidity("");
        const field = event.currentTarget.elements.namedItem("confirmation");
        if (field instanceof HTMLInputElement) field.setCustomValidity("");
      }
    },
    create() {
      setEditing(null);
      setOpen(true);
      setMessage("");
      setError("");
    },
    edit(record: StaffAccount) {
      setEditing(record);
      setOpen(true);
      setMessage("");
      setError("");
    },
    dismiss() {
      if (!busy.current) setOpen(false);
    },
    toggle: (account: StaffAccount) => {
      setError("");
      setConfirmation({ action: "toggle", account });
    },
    reset: (account: StaffAccount) => {
      setError("");
      setConfirmation({ action: "reset", account });
    },
    cancelConfirmation() {
      if (!busy.current) setConfirmation(null);
    },
    async confirm() {
      if (!confirmation || busy.current) return;
      const { account, action } = confirmation;
      busy.current = true;
      setPending(true);
      try {
        if (action === "toggle") {
          const route = account.status === "Active" ? "deactivate" : "activate";
          await writeApi(`/staff/${account.id}/${route}`, "POST");
          setMessage("Staff account status updated.");
        } else {
          await writeApi(`/staff/${account.id}/password-reset`,"POST");
          setMessage("A password reset link was requested.");
        }
        setConfirmation(null);
      } catch (failure) {
        setError(errorMessage(failure));
        setMessage("");
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
  };
}
