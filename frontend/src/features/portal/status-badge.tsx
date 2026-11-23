import type { ComponentProps } from "react";

const styles = {
  info: ["bg-info-container text-info", "bg-info"],
  warning: ["bg-warning-container text-warning", "bg-warning"],
  secondary: ["bg-secondary-container text-secondary", "bg-secondary"],
  success: ["bg-success-container text-success", "bg-success"],
  neutral: ["bg-surface-variant text-outline", "bg-outline"],
} as const;

const mapped: Readonly<Record<string, keyof typeof styles>> = {
  New: "info",
  Pending: "warning",
  "In Progress": "secondary",
  Submitted: "success",
  Active: "success",
  Inactive: "warning",
  "Admitted (Active)": "success",
  "Hospitalized / Temporary Leave": "warning",
};

export function statusStyle(status: string) {
  return styles[Object.hasOwn(mapped, status) ? mapped[status] : "neutral"];
}

export function badges(status: string, className: string) {
  return (
    className
      .replace(
        /\b(?:bg|text)-(?:primary|success|warning|secondary|info|outline|on-surface-variant|surface-variant)(?:-container)?\b/g,
        "",
      )
      .trim() +
    " " +
    statusStyle(status)[0]
  );
}

export function StatusBadge({
  status,
  dot,
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & {
  status: string;
  dot?: string;
}) {
  return (
    <span {...props} className={className}>
      {dot && <span className={dot} aria-hidden="true" />} {status}
    </span>
  );
}

export function DashboardCard(props: ComponentProps<"div">) {
  return <div {...props} />;
}
