"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, fetchApiJson, jsonRequest } from "@/lib/api";
import { usePortal } from "./portal-session";
import { dashboardRoute } from "./models";

export function useLogin() {
  const { signIn } = usePortal();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetPending, setResetPending] = useState(false);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const recovering = useRef(false);
  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    success,
    pending,
    resetOpen,
    resetMessage,
    resetError,
    resetPending,
    setResetOpen(open: boolean) {
      if (!recovering.current) {
        setResetError("");
        setResetOpen(open);
      }
    },
    async submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (busy.current) return;
      const form = new FormData(event.currentTarget);
      const credentials = {
        username: String(form.get("username") ?? "").trim(),
        password: String(form.get("password") ?? ""),
      };
      busy.current = true;
      setPending(true);
      setError("");
      setSuccess("Signing in…");
      try {
        await signIn(credentials);
      } catch (failure) {
        setError(errorMessage(failure));
        setSuccess("");
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
    async submitReset(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (recovering.current) return;
      const form = event.currentTarget;
      const email = String(new FormData(form).get("email") ?? "").trim();
      recovering.current = true;
      setResetPending(true);
      setResetError("");
      setResetMessage("");
      try {
        const { message } = await fetchApiJson<{ message: string }>(
          "/auth/forgot-password",
          jsonRequest("POST", { email }),
        );
        form.reset();
        setResetOpen(false);
        setResetMessage(message);
      } catch (failure) {
        setResetError(errorMessage(failure));
      } finally {
        recovering.current = false;
        setResetPending(false);
      }
    },
  };
}

export function useLogout() {
  const { session, signOut } = usePortal();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const staff = session?.role === "staff";
  return {
    busy,
    error,
    staff,
    name: session?.name,
    role: staff ? "Staff Access" : "Administrator",
    cancel: () => router.push(dashboardRoute(staff ? "staff" : "admin")),
    async confirm() {
      if (busy) return;
      setBusy(true);
      setError("");
      try {
        await signOut();
      } catch (failure) {
        setError(errorMessage(failure));
      } finally {
        setBusy(false);
      }
    },
  };
}
