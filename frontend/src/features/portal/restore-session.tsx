"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage, readPortalSession } from "@/lib/api";

export function RestoreSession({ retry = false }: { retry?: boolean }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(retry ? 0 : 1);
  const [error, setError] = useState(
    retry ? "The portal could not verify your session." : "",
  );
  useEffect(() => {
    if (!attempt) return;
    let active = true;
    readPortalSession().then(
      (session) => {
        if (!active) return;
        if (session) router.refresh();
        else router.replace("/portal/login?expired=1");
      },
      (failure) => {
        if (active) setError(errorMessage(failure));
      },
    );
    return () => {
      active = false;
    };
  }, [attempt, router]);
  return (
    <div className="portal-route-status">
      {error ? (
        <>
          <p role="alert">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError("");
              setAttempt((value) => value + 1);
            }}
          >
            Try again
          </button>
        </>
      ) : (
        <p role="status">Restoring your portal session…</p>
      )}
    </div>
  );
}
