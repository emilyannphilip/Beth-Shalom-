"use client";
import { useSidebar } from "./navigation";
import { usePortal } from "./portal-session";
import { PortalLogo } from "./portal-logo";
import { LogoutButton, ProfileButton, PortalLink } from "./navigation";
export function PortalSidebar({
  screen,
}: {
  screen: "admin" | "staff-management" | "residents" | "staff";
}) {
  const sidebar = useSidebar();
  const { session } = usePortal();
  if (screen === "admin")
    return (
      <aside
        id="app-sidebar"
        className={
          "bg-white border-r border-outline-variant flex flex-col justify-between transition-all duration-200 min-h-[1024px] sticky top-0 shrink-0 z-30" +
          (sidebar.collapsed ? " w-20" : " w-64")
        }
        data-stitch-vh="min-h-[1024px]===min-h-screen"
        data-expanded={sidebar.expanded || undefined}
      >
        <div>
          <div className="portal-sidebar-header p-5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <div className="portal-sidebar-brand">
                <PortalLogo
                  width={1254}
                  height={1254}
                  alt="Beth Shalom GMI Retirement Home"
                />
              </div>
              <span
                className={
                  "sidebar-label text-label-sm font-label text-on-surface-variant block text-center mt-1" +
                  (sidebar.collapsed ? " hidden" : "")
                }
              >
                Admin Portal
              </span>
            </div>
            <button
              type="button"
              id="sidebar-toggle-btn"
              aria-label="Toggle sidebar width"
              className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={sidebar.ariaExpanded}
              aria-controls="app-sidebar"
              onClick={sidebar.toggle}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                menu_open
              </span>
            </button>
          </div>
          <nav className="p-3 space-y-1" aria-label="Portal navigation">
            <PortalLink
              href="/portal/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-primary-container text-primary font-label text-label-md transition-colors font-semibold"
              sidebar
              close={sidebar.dismiss}
              aria-label="Dashboard"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                dashboard
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Dashboard
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin#enquiries-section"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Enquiry Management"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                contact_mail
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Enquiry Management
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin/staff"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Staff Management"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                badge
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Staff Management
              </span>
              <span
                className={
                  "ml-auto text-label-sm px-1.5 py-0.2 text-primary bg-primary/10 rounded sidebar-label" +
                  (sidebar.collapsed ? " hidden" : "")
                }
              >
                RBAC
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin/residents"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Admitted Residents"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                elderly
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Admitted Residents
              </span>
            </PortalLink>
            <ProfileButton
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              aria-label="Profile &amp; Security"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                manage_accounts
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Profile &amp; Security
              </span>
            </ProfileButton>
            <PortalLink
              href="/portal/admin/rooms"
              sidebar
              aria-label="Room Management"
              close={sidebar.dismiss}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant font-label text-label-md"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                meeting_room
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Room Management
              </span>
            </PortalLink>
          </nav>
        </div>
        <div className="p-3 border-t border-outline-variant space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-variant/60">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-label-sm shrink-0">
              AD
            </div>
            <div
              className={
                "sidebar-label min-w-0 flex-1" +
                (sidebar.collapsed ? " hidden" : "")
              }
            >
              <p className="text-label-md font-label text-on-surface truncate">
                {session?.name}
              </p>
              <span className="text-label-sm text-secondary block truncate font-medium">
                Super Administrator
              </span>
            </div>
          </div>
          <LogoutButton
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error-container/40 font-label text-label-md transition-colors focus-visible:ring-2 focus-visible:ring-primary text-left"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden>
              logout
            </span>
            <span
              className={"sidebar-label" + (sidebar.collapsed ? " hidden" : "")}
            >
              Logout
            </span>
          </LogoutButton>
        </div>
      </aside>
    );
  if (screen === "staff-management")
    return (
      <aside
        id="app-sidebar"
        className={
          "bg-white border-r border-outline-variant flex flex-col justify-between transition-all duration-200 min-h-[1024px] sticky top-0 shrink-0 z-30" +
          (sidebar.collapsed ? " w-20" : " w-64")
        }
        data-stitch-vh="min-h-[1024px]===min-h-screen"
        data-expanded={sidebar.expanded || undefined}
      >
        <div>
          <div className="portal-sidebar-header p-5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <div className="portal-sidebar-brand">
                <PortalLogo
                  width={1254}
                  height={1254}
                  alt="Beth Shalom GMI Retirement Home"
                />
              </div>
              <span
                className={
                  "sidebar-label text-label-sm font-label text-on-surface-variant block text-center mt-1" +
                  (sidebar.collapsed ? " hidden" : "")
                }
              >
                Admin Portal
              </span>
            </div>
            <button
              type="button"
              aria-label="Toggle sidebar width"
              className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={sidebar.ariaExpanded}
              aria-controls="app-sidebar"
              onClick={sidebar.toggle}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                menu_open
              </span>
            </button>
          </div>
          <nav className="p-3 space-y-1" aria-label="Portal navigation">
            <PortalLink
              href="/portal/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Dashboard"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                dashboard
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Dashboard
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin#enquiries-section"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Enquiry Management"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                contact_mail
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Enquiry Management
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin/staff"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-primary-container text-primary font-label text-label-md transition-colors font-semibold"
              sidebar
              close={sidebar.dismiss}
              aria-label="Staff Management"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                badge
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Staff Management
              </span>
              <span
                className={
                  "ml-auto text-label-sm px-1.5 py-0.2 text-primary bg-primary/10 rounded sidebar-label" +
                  (sidebar.collapsed ? " hidden" : "")
                }
              >
                RBAC
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin/residents"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Admitted Residents"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                elderly
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Admitted Residents
              </span>
            </PortalLink>
            <ProfileButton
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              aria-label="Profile &amp; Security"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                manage_accounts
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Profile &amp; Security
              </span>
            </ProfileButton>
            <PortalLink
              href="/portal/admin/rooms"
              sidebar
              aria-label="Room Management"
              close={sidebar.dismiss}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant font-label text-label-md"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                meeting_room
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Room Management
              </span>
            </PortalLink>
          </nav>
        </div>
        <div className="p-3 border-t border-outline-variant space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-variant/60">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-label-sm shrink-0">
              AD
            </div>
            <div
              className={
                "sidebar-label min-w-0 flex-1" +
                (sidebar.collapsed ? " hidden" : "")
              }
            >
              <p className="text-label-md font-label text-on-surface truncate">
                {session?.name}
              </p>
              <span className="text-label-sm text-secondary block truncate font-medium">
                Super Administrator
              </span>
            </div>
          </div>
          <LogoutButton
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error-container/40 font-label text-label-md transition-colors focus-visible:ring-2 focus-visible:ring-primary text-left"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden>
              logout
            </span>
            <span
              className={"sidebar-label" + (sidebar.collapsed ? " hidden" : "")}
            >
              Logout
            </span>
          </LogoutButton>
        </div>
      </aside>
    );
  if (screen === "residents")
    return (
      <aside
        id="app-sidebar"
        className={
          "bg-white border-r border-outline-variant flex flex-col justify-between transition-all duration-200 min-h-[1024px] sticky top-0 shrink-0 z-30" +
          (sidebar.collapsed ? " w-20" : " w-64")
        }
        data-stitch-vh="min-h-[1024px]===min-h-screen"
        data-expanded={sidebar.expanded || undefined}
      >
        <div>
          <div className="portal-sidebar-header p-5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <div className="portal-sidebar-brand">
                <PortalLogo
                  width={1254}
                  height={1254}
                  alt="Beth Shalom GMI Retirement Home"
                />
              </div>
              <span
                className={
                  "sidebar-label text-label-sm font-label text-on-surface-variant block text-center mt-1" +
                  (sidebar.collapsed ? " hidden" : "")
                }
              >
                Admin Portal
              </span>
            </div>
            <button
              type="button"
              aria-label="Toggle sidebar width"
              className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={sidebar.ariaExpanded}
              aria-controls="app-sidebar"
              onClick={sidebar.toggle}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                menu_open
              </span>
            </button>
          </div>
          <nav className="p-3 space-y-1" aria-label="Portal navigation">
            <PortalLink
              href="/portal/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Dashboard"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                dashboard
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Dashboard
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin#enquiries-section"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Enquiry Management"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                contact_mail
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Enquiry Management
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin/staff"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Staff Management"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                badge
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Staff Management
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/admin/residents"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-primary-container text-primary font-label text-label-md transition-colors font-semibold"
              sidebar
              close={sidebar.dismiss}
              aria-label="Admitted Residents"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                elderly
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Admitted Residents
              </span>
            </PortalLink>
            <ProfileButton
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              aria-label="Profile &amp; Security"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                manage_accounts
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Profile &amp; Security
              </span>
            </ProfileButton>
            <PortalLink
              href="/portal/admin/rooms"
              sidebar
              aria-label="Room Management"
              close={sidebar.dismiss}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant font-label text-label-md"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                meeting_room
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Room Management
              </span>
            </PortalLink>
          </nav>
        </div>
        <div className="p-3 border-t border-outline-variant space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-variant/60">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-label-sm shrink-0">
              AD
            </div>
            <div
              className={
                "sidebar-label min-w-0 flex-1" +
                (sidebar.collapsed ? " hidden" : "")
              }
            >
              <p className="text-label-md font-label text-on-surface truncate">
                {session?.name}
              </p>
              <span className="text-label-sm text-secondary block truncate font-medium">
                Super Administrator
              </span>
            </div>
          </div>
          <LogoutButton
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error-container/40 font-label text-label-md transition-colors focus-visible:ring-2 focus-visible:ring-primary text-left"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden>
              logout
            </span>
            <span
              className={"sidebar-label" + (sidebar.collapsed ? " hidden" : "")}
            >
              Logout
            </span>
          </LogoutButton>
        </div>
      </aside>
    );
  if (screen === "staff")
    return (
      <aside
        id="app-sidebar"
        className={
          "bg-white border-r border-outline-variant flex flex-col justify-between transition-all duration-200 min-h-[1024px] sticky top-0 shrink-0 z-30" +
          (sidebar.collapsed ? " w-20" : " w-64")
        }
        data-stitch-vh="min-h-[1024px]===min-h-screen"
        data-expanded={sidebar.expanded || undefined}
      >
        <div>
          <div className="portal-sidebar-header p-5 border-b border-outline-variant flex items-center justify-between">
            <div>
              <div className="portal-sidebar-brand">
                <PortalLogo
                  width={1254}
                  height={1254}
                  alt="Beth Shalom GMI Retirement Home"
                />
              </div>
              <span
                className={
                  "sidebar-label text-label-sm font-label text-on-surface-variant block text-center mt-1" +
                  (sidebar.collapsed ? " hidden" : "")
                }
              >
                Staff Care Portal
              </span>
            </div>
            <button
              type="button"
              aria-label="Toggle sidebar width"
              className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-secondary"
              aria-expanded={sidebar.ariaExpanded}
              aria-controls="app-sidebar"
              onClick={sidebar.toggle}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                menu_open
              </span>
            </button>
          </div>
          <nav className="p-3 space-y-1" aria-label="Portal navigation">
            <PortalLink
              href="/portal/staff"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-secondary-container text-secondary font-label text-label-md transition-colors font-semibold"
              sidebar
              close={sidebar.dismiss}
              aria-label="Dashboard"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                dashboard
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Dashboard
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/staff#staff-enquiries-section"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Enquiry Management"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                contact_mail
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Enquiry Management
              </span>
            </PortalLink>
            <PortalLink
              href="/portal/staff/residents"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              sidebar
              close={sidebar.dismiss}
              aria-label="Admitted Residents"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                elderly
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Admitted Residents
              </span>
            </PortalLink>
            <ProfileButton
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface font-label text-label-md transition-colors"
              aria-label="My Profile"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                account_circle
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                My Profile
              </span>
            </ProfileButton>
            <PortalLink
              href="/portal/staff/rooms"
              sidebar
              aria-label="Room Management"
              close={sidebar.dismiss}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-variant font-label text-label-md"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                meeting_room
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Room Management
              </span>
            </PortalLink>
          </nav>
        </div>
        <div className="p-3 border-t border-outline-variant space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-variant/60">
            <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-label-sm shrink-0">
              KL
            </div>
            <div
              className={
                "sidebar-label min-w-0 flex-1" +
                (sidebar.collapsed ? " hidden" : "")
              }
            >
              <p className="text-label-md font-label text-on-surface truncate">
                {session?.name}
              </p>
              <span className="text-label-sm text-outline block truncate">
                Care Staff
              </span>
            </div>
            <LogoutButton
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error-container/40 font-label text-label-md transition-colors focus-visible:ring-2 focus-visible:ring-secondary text-left"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                logout
              </span>
              <span
                className={
                  "sidebar-label" + (sidebar.collapsed ? " hidden" : "")
                }
              >
                Logout
              </span>
            </LogoutButton>
          </div>
        </div>
      </aside>
    );
  return null;
}
