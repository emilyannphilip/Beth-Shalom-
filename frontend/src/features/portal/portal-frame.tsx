import type { ReactNode } from "react";

const authClasses =
  "bg-surface text-on-surface font-body antialiased min-h-[1024px] flex flex-col justify-between selection:bg-primary-container selection:text-primary";
const workspaceClasses =
  "bg-surface text-on-surface font-body antialiased min-h-[1024px] flex selection:bg-primary-container selection:text-primary";

export function PortalFrame({
  children,
  auth = false,
}: {
  children: ReactNode;
  auth?: boolean;
}) {
  return (
    <div data-portal-frame className={auth ? authClasses : workspaceClasses}>
      <div className="portal-view">{children}</div>
    </div>
  );
}

export function DemoNotice() {
  return <p className="portal-demo-notice">Demo workspace · Sample records only</p>;
}
