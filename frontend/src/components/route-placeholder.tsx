import type { ReactNode } from "react";

export function RoutePlaceholder({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p>This page is scheduled for a later migration phase.</p>
      {children}
    </div>
  );
}
