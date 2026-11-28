"use client";
import { PortalLogo } from "../portal-logo";
import { PortalFrame } from "../portal-frame";
import { PortalDialog } from "../portal-dialog";
import { PortalLink } from "../navigation";
import { useLogin } from "../auth-interactions";
import { PortalRoute } from "../portal-session";
export function PortalLogin({
  expired = false,
  passwordChanged = false,
}: {
  expired?: boolean;
  passwordChanged?: boolean;
}) {
  const ui = useLogin();
  return (
    <PortalRoute role="guest">
      <PortalFrame auth>
        <header className="portal-auth-header w-full border-b flex items-center justify-between">
          <div className="portal-auth-brand">
            <PortalLogo
              width={1254}
              height={1254}
              alt="Beth Shalom GMI Retirement Home"
            />
          </div>
          <PortalLink
            href="/"
            className="inline-flex items-center gap-1.5 text-body-sm font-label text-primary hover:text-tertiary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden>
              arrow_back
            </span>
            <span>Back to Public Website</span>
          </PortalLink>
        </header>
        <main className="portal-auth-main flex-1 flex items-center">
          <div className="portal-auth-card w-full max-w-md">
            <div className="portal-auth-intro text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant text-primary mb-3">
                <span
                  className="material-symbols-outlined text-[26px]"
                  aria-hidden
                >
                  admin_panel_settings
                </span>
              </div>
              <h1 className="font-headline text-headline-md text-on-surface">
                Staff &amp; Admin Portal
              </h1>
              <p className="text-body-sm text-on-surface-variant mt-1.5">
                Sign in with your Beth Shalom portal account.
              </p>
            </div>
            {expired && (
              <p role="status" className="portal-reset-message">
                Your session has expired. Sign in to continue.
              </p>
            )}
            {passwordChanged && (
              <p role="status" className="portal-reset-message">
                Password updated. Sign in with your new password.
              </p>
            )}
            <form
              id="portal-login-form"
              className="space-y-5"
              onSubmit={ui.submit}
              method="dialog"
            >
              <div
                id="login-error-alert"
                className="p-3 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-start gap-2 border border-error/20"
                hidden={!ui.error}
                role="alert"
              >
                <span
                  className="material-symbols-outlined text-[18px] text-error flex-shrink-0 mt-0.5"
                  aria-hidden
                >
                  error
                </span>
                <span id="login-error-text">{ui.error}</span>
              </div>
              <div
                id="login-success-alert"
                className="p-3 rounded-lg bg-success-container text-on-success-container text-body-sm flex items-center gap-2 border border-success/20"
                hidden={!ui.success}
                role="status"
              >
                <span
                  className="material-symbols-outlined text-[18px] text-success"
                  aria-hidden
                >
                  check_circle
                </span>
                <span id="login-success-text">{ui.success}</span>
              </div>
              <div>
                <label
                  htmlFor="username-input"
                  className="block text-label-md font-label text-on-surface mb-1.5"
                >
                  Username / Staff ID
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-outline"
                    aria-hidden
                  >
                    person
                  </span>
                  <input
                    id="username-input"
                    type="text"
                    required
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-2.5 text-body-md bg-surface/50 border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    value={ui.username}
                    onChange={(event) =>
                      ui.setUsername(event.currentTarget.value)
                    }
                    name="username"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password-input"
                    className="block text-label-md font-label text-on-surface"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-label-sm font-label text-primary hover:text-tertiary transition-colors"
                    onClick={() => ui.setResetOpen(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-outline"
                    aria-hidden
                  >
                    lock
                  </span>
                  <input
                    id="password-input"
                    type={ui.showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 text-body-md bg-surface/50 border border-outline-variant rounded-lg text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-mono"
                    value={ui.password}
                    onChange={(event) =>
                      ui.setPassword(event.currentTarget.value)
                    }
                    name="password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    id="toggle-password-btn"
                    aria-label={
                      ui.showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-2.5 text-outline hover:text-on-surface p-0.5 rounded transition-colors"
                    onClick={() => ui.setShowPassword(!ui.showPassword)}
                  >
                    <span
                      id="password-toggle-icon"
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      {ui.showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-body-sm text-on-surface-variant pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  <span className="text-body-sm text-outline">
                    Authorized portal accounts
                  </span>
                </div>
              </div>
              <button
                type="submit"
                id="login-submit-btn"
                disabled={ui.pending}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-on-primary rounded-lg font-label text-label-lg shadow-sm hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-state-change"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden
                >
                  login
                </span>
                <span>Sign In to Portal</span>
              </button>
            </form>
            <p
              className="portal-reset-message"
              role="status"
              hidden={!ui.resetMessage}
            >
              {ui.resetMessage}
            </p>
            <div className="portal-auth-note mt-8 pt-6 border-t border-outline-variant/60 text-center">
              <p className="text-body-sm text-outline">
                Sign out when using a shared device.
              </p>
            </div>
          </div>
        </main>
        <PortalDialog
          id="forgot-password-modal"
          className="p-0 rounded-2xl border border-outline-variant bg-white backdrop:bg-on-surface/40 shadow-xl max-w-md w-full"
          open={ui.resetOpen}
          dismiss={() => ui.setResetOpen(false)}
          aria-labelledby="reset-password-title"
        >
          <form method="dialog" onSubmit={ui.submitReset}>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-secondary-container text-secondary">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden
                    >
                      lock_reset
                    </span>
                  </span>
                  <h2
                    className="font-headline text-headline-sm text-on-surface"
                    id="reset-password-title"
                  >
                    Reset Staff Password
                  </h2>
                </div>
                <button
                  type="button"
                  className="text-outline hover:text-on-surface"
                  onClick={() => ui.setResetOpen(false)}
                  aria-label="Close dialog"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden
                  >
                    close
                  </span>
                </button>
              </div>
              <div className="py-4 space-y-3">
                <p className="text-body-md text-on-surface-variant">
                  Enter the email address registered to your portal account to
                  request a password reset link.
                </p>
                <label className="block">
                  <span className="text-label-md font-label text-on-surface mb-1 block">
                    Institutional Email
                  </span>
                  <input
                    type="email"
                    placeholder="staff.name@bethshalom.org"
                    className="w-full px-3 py-2 text-body-sm border border-outline-variant rounded-md text-on-surface focus:ring-1 focus:ring-primary focus:outline-none"
                    required
                    id="reset-email"
                    name="email"
                    aria-label="Institutional email"
                  />
                </label>
                {ui.resetError && (
                  <p role="alert" className="text-error">
                    {ui.resetError}
                  </p>
                )}
                <p className="text-body-sm text-outline">
                  Need immediate assistance? Contact Administration Desk at{" "}
                  <span className="font-semibold text-primary">ext. 4010</span>.
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-outline-variant rounded-md text-label-md text-on-surface-variant hover:bg-surface-variant font-label"
                  onClick={() => ui.setResetOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ui.resetPending}
                  className="px-4 py-2 bg-primary text-on-primary rounded-md text-label-md font-label hover:bg-tertiary"
                >
                  {ui.resetPending ? "Sending…" : "Send Reset Instructions"}
                </button>
              </div>
            </div>
          </form>
        </PortalDialog>
        <footer className="portal-auth-footer py-4 text-center text-body-sm text-outline border-t">
          Beth Shalom Retirement Home • Staff &amp; Admin Portal
        </footer>
      </PortalFrame>
    </PortalRoute>
  );
}
