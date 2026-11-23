"use client";

import { useState, type FormEvent } from "react";
import { demoCredentials, useDemo } from "./demo-session";
import { useGrid } from "./grid";
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
  const { accounts, saveAccount } = useDemo();
  const [editing, setEditing] = useState<StaffAccount | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState<{
    action: "toggle" | "reset";
    account: StaffAccount;
  } | null>(null);
  const grid = useGrid(accounts, {
    pageSize: 4,
    searchValue: (row) =>
      [
        row.name,
        row.username,
        row.email,
        row.phone,
        row.designation,
        row.status,
      ].join(" "),
    categoryValue: (row) => row.designation,
    statusValue: (row) => row.status,
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const username = value("username");
    const lower = username.toLowerCase();
    const usernameField = form.elements.namedItem("username");
    const passwordField = form.elements.namedItem("confirmation");
    const duplicate =
      lower === demoCredentials.admin.username ||
      accounts.some(
        (account) =>
          account.id !== editing?.id &&
          account.username.toLowerCase() === lower,
      );

    if (duplicate && usernameField instanceof HTMLInputElement) {
      usernameField.setCustomValidity("This username is already in use.");
      usernameField.reportValidity();
      return;
    }

    const password = String(data.get("password") ?? "");
    if (
      password !== data.get("confirmation") &&
      passwordField instanceof HTMLInputElement
    ) {
      passwordField.setCustomValidity("Demo passwords must match.");
      passwordField.reportValidity();
      return;
    }

    const designation =
      staffDesignations.find((item) => item === value("designation")) ??
      staffDesignations[0];
    saveAccount({
      id: editing?.id ?? crypto.randomUUID(),
      name: value("name"),
      username,
      email: value("email"),
      phone: value("phone"),
      designation,
      status: value("status") === "Inactive" ? "Inactive" : "Active",
      avatarClass:
        editing?.avatarClass ??
        "w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-label-sm shrink-0",
      demoPassword:
        password ||
        editing?.demoPassword ||
        (editing?.username === demoCredentials.staff.username
          ? demoCredentials.staff.password
          : undefined),
    });
    setOpen(false);
    setMessage(
      editing
        ? "Sample staff account updated."
        : "Sample staff account created.",
    );
  }

  return {
    editing,
    open,
    grid,
    values: editing ?? blank,
    confirmation,
    message,
    onInput(event: FormEvent<HTMLFormElement>) {
      const form = event.currentTarget;
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      target.setCustomValidity("");
      if (target.name === "password") {
        const field = form.elements.namedItem("confirmation");
        if (field instanceof HTMLInputElement) field.setCustomValidity("");
      }
    },
    create() {
      setEditing(null);
      setOpen(true);
      setMessage("");
    },
    edit(record: StaffAccount) {
      setEditing(record);
      setOpen(true);
      setMessage("");
    },
    dismiss: () => setOpen(false),
    submit,
    toggle: (account: StaffAccount) =>
      setConfirmation({ action: "toggle", account }),
    reset: (account: StaffAccount) =>
      setConfirmation({ action: "reset", account }),
    cancelConfirmation: () => setConfirmation(null),
    confirm() {
      if (!confirmation) return;
      const { account, action } = confirmation;
      if (action === "toggle") {
        const status = account.status === "Active" ? "Inactive" : "Active";
        saveAccount({ ...account, status });
        setMessage(
          `${account.name}'s demo account is now ${status.toLowerCase()}.`,
        );
      } else {
        setMessage("Demo reset only. No reset instructions were sent.");
      }
      setConfirmation(null);
    },
  };
}
