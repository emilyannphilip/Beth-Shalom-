"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { demoCredentials, useDemo } from "./demo-session";
import { dashboardRoute, type DemoRole } from "./models";

export function useLogin() {
  const { signIn, setSession } = useDemo();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  function fill(role: DemoRole) {
    setUsername(demoCredentials[role].username);
    setPassword(demoCredentials[role].password);
    setError("");
    setResetMessage("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (timer.current !== null) return;
    setResetMessage("");
    const next = signIn(username, password);
    if (!next) {
      setError(
        "These demo credentials did not match an active sample account.",
      );
      return;
    }
    setError("");
    setSuccess(
      next.role === "admin"
        ? "Opening the Admin demo dashboard…"
        : "Opening the Staff demo dashboard…",
    );
    timer.current = setTimeout(() => setSession(next), 450);
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    success,
    resetOpen,
    setResetOpen,
    resetMessage,
    fill,
    submit,
    submitReset(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      event.currentTarget.reset();
      setResetOpen(false);
      setResetMessage("Demo password reset only. No email was sent.");
    },
  };
}

export function useLogout() {
  const { session, setSession } = useDemo();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  const staff = session?.role === "staff";
  return {
    busy,
    staff,
    name: session?.name,
    role: staff ? "Staff Access (Restricted)" : "Admin Privilege (RBAC)",
    cancel: () => router.push(dashboardRoute(staff ? "staff" : "admin")),
    confirm() {
      if (timer.current !== null) return;
      setBusy(true);
      timer.current = setTimeout(() => setSession(null), 500);
    },
  };
}
