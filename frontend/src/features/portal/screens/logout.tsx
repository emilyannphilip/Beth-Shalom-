"use client";
import { PortalLogo } from "../portal-logo";
import { PortalFrame } from "../portal-frame";
import { useLogout } from "../auth-interactions";
import { PortalRoute } from "../portal-session";
export function PortalLogout() {
  const ui = useLogout();
  return (
    <PortalRoute role="signed-in">
      <PortalFrame auth>
        <header className="portal-auth-header w-full border-b flex items-center justify-between">
          <div className="portal-auth-brand">
            <PortalLogo
              width={1254}
              height={1254}
              alt="Beth Shalom GMI Retirement Home"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-variant font-label text-label-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              onClick={ui.cancel}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                aria-hidden
              >
                arrow_back
              </span>
              <span id="nav-return-text">
                {ui.staff
                  ? "Return to Staff Dashboard"
                  : "Return to Admin Dashboard"}
              </span>
            </button>
          </div>
        </header>
        <main className="portal-auth-main flex-1 flex items-center">
          <div className="portal-auth-card w-full max-w-lg text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-container text-error mb-4 shadow-sm">
              <span
                className="material-symbols-outlined text-[32px]"
                aria-hidden
              >
                logout
              </span>
            </div>
            <h1 className="font-headline text-headline-md text-on-surface">
              Confirm Portal Sign Out
            </h1>
            <p className="text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
              Are you sure you want to end your active session? You will need to
              sign in again to access patient records and enquiry management.
            </p>
            <div className="portal-auth-panel my-6 p-4 rounded-xl border text-left text-body-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-outline">
                  Active Account:
                </span>
                <span
                  id="user-display-name"
                  className="font-semibold text-on-surface font-label"
                >
                  {ui.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-outline">
                  Role Privilege:
                </span>
                <span
                  id="user-role-badge"
                  className={
                    "px-2 py-0.5 rounded text-label-sm font-semibold " +
                    (ui.staff
                      ? "bg-secondary-container text-secondary"
                      : "bg-primary-container text-primary")
                  }
                >
                  {ui.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-outline">
                  Session Mode:
                </span>
                <span className="text-success font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>{" "}
                  Signed-in Session
                </span>
              </div>
            </div>
            {ui.error && (
              <p role="alert" className="text-error">
                {ui.error}
              </p>
            )}
            <div className="portal-auth-actions pt-2">
              <button
                type="button"
                className="py-2.5 px-4 rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-variant font-label text-label-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                onClick={ui.cancel}
              >
                Cancel &amp; Stay
              </button>
              <button
                type="button"
                id="confirm-logout-btn"
                className="py-2.5 px-4 rounded-lg bg-error text-on-error hover:opacity-90 font-label text-label-lg transition-all focus-visible:ring-2 focus-visible:ring-error shadow-sm flex items-center justify-center gap-2"
                onClick={ui.confirm}
                disabled={ui.busy}
              >
                {ui.busy ? (
                  <>
                    <span
                      className="material-symbols-outlined text-[20px] animate-spin"
                      aria-hidden="true"
                    >
                      refresh
                    </span>
                    <span>Signing out…</span>
                  </>
                ) : (
                  <>
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      power_settings_new
                    </span>
                    <span>Sign Out Now</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-body-sm text-outline mt-6">
              Signing out ends your current portal session.
            </p>
          </div>
        </main>
        <footer className="portal-auth-footer py-4 text-center text-body-sm text-on-surface-variant border-t">
          Beth Shalom Retirement Home • Portal Session Manager
        </footer>
      </PortalFrame>
    </PortalRoute>
  );
}
