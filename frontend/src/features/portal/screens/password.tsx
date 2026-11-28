"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { errorMessage, fetchApiJson, jsonRequest } from "@/lib/api";
import { PortalFrame } from "../portal-frame";
import { PortalLogo } from "../portal-logo";
import { usePortal } from "../portal-session";
import { dashboardRoute } from "../models";

const field =
  "block w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-on-surface focus-visible:ring-2 focus-visible:ring-primary";
export function PasswordScreen({ mode }: { mode: "change" | "reset" }) {
  const change = mode === "change";
  const { session, endSession } = usePortal();
  const router = useRouter();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  useEffect(() => {
    if (change) return;
    const frame = requestAnimationFrame(() => {
      const value = new URLSearchParams(window.location.hash.slice(1)).get(
        "token",
      );
      setToken(value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : "");
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search,
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [change]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    if (password !== data.get("confirm")) {
      setError("Passwords must match.");
      return;
    }
    busy.current = true;
    setPending(true);
    setError("");
    try {
      if (change)
        await fetchApiJson(
          "/auth/change-password",
          jsonRequest("POST", {
            currentPassword: data.get("current"),
            password,
          }),
        );
      else
        await fetchApiJson(
          "/auth/reset-password",
          jsonRequest("POST", { token, password }),
        );
      endSession();
      router.replace("/portal/login?passwordChanged=1");
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <PortalFrame auth>
      <header className="portal-auth-header w-full border-b">
        <div className="portal-auth-brand">
          <PortalLogo
            width={1254}
            height={1254}
            alt="Beth Shalom GMI Retirement Home"
          />
        </div>
      </header>
      <main className="portal-auth-main flex-1 flex items-center">
        <div className="portal-auth-card w-full max-w-lg">
          <h1 className="font-headline text-headline-md text-on-surface">
            {change ? "Change Password" : "Reset Password"}
          </h1>
          {!change && token === undefined && (
            <p role="status">Reading the reset link…</p>
          )}
          {!change && token === "" && (
            <p role="alert" className="mt-3 text-error">
              This reset link is incomplete. Request a new link from the sign-in
              page.
            </p>
          )}
          {(change || token) && (
            <form
              onSubmit={submit}
              className="mt-4 space-y-4"
              aria-busy={pending}
            >
              {change && (
                <label className="block">
                  Current password
                  <input
                    className={field}
                    name="current"
                    type="password"
                    autoComplete="current-password"
                    required
                    maxLength={128}
                  />
                </label>
              )}
              <label className="block">
                New password
                <input
                  className={field}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={128}
                />
              </label>
              <label className="block">
                Confirm new password
                <input
                  className={field}
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={12}
                  maxLength={128}
                />
              </label>
              <p className="text-body-sm">
                Use at least 12 characters. You will be asked to sign in again
                after saving.
              </p>
              {error && (
                <p role="alert" className="text-error">
                  {error}
                </p>
              )}
              <button
                disabled={pending}
                className="rounded-lg bg-primary px-4 py-2 text-on-primary"
                type="submit"
              >
                {pending ? "Saving…" : "Save Password"}
              </button>
            </form>
          )}
          <Link
            className="mt-4 inline-block text-primary underline"
            href={
              change && session ? dashboardRoute(session.role) : "/portal/login"
            }
          >
            {change ? "Return to dashboard" : "Back to sign in"}
          </Link>
        </div>
      </main>
    </PortalFrame>
  );
}
