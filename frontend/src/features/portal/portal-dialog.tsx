"use client";

import { useEffect, useRef, type ComponentProps } from "react";

export function PortalDialog({
  open,
  dismiss,
  children,
  ...props
}: Omit<ComponentProps<"dialog">, "open" | "onCancel"> & {
  open: boolean;
  dismiss: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      opener.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      node.showModal();
    } else if (!open && node.open) {
      node.close();
      if (opener.current?.isConnected)
        opener.current.focus({ preventScroll: true });
      opener.current = null;
    }
  }, [open]);

  return (
    <dialog
      {...props}
      ref={dialog}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          dismiss();
      }}
    >
      {children}
    </dialog>
  );
}

const modalClass =
  "w-full max-w-xl rounded-2xl border border-outline-variant bg-white p-6 shadow-xl";

export function DetailDialog({
  title,
  dismiss,
  children,
}: {
  title: string | null;
  dismiss: () => void;
  children: React.ReactNode;
}) {
  return (
    <PortalDialog
      className={modalClass}
      open={title !== null}
      dismiss={dismiss}
      aria-label={title ?? undefined}
    >
      <h2 className="font-headline text-headline-md mb-4">{title}</h2>
      {children}
      <button
        type="button"
        className="mt-4 rounded-md border border-outline-variant px-4 py-2 text-label-md"
        onClick={dismiss}
      >
        Close
      </button>
    </PortalDialog>
  );
}

export function ConfirmDialog({
  title,
  message,
  dismiss,
  accept,
  error,
  pending,
}: {
  title: string | null;
  message?: string;
  dismiss: () => void;
  accept: () => void;
  error?: string;
  pending?: boolean;
}) {
  return (
    <PortalDialog
      className={modalClass}
      open={title !== null}
      dismiss={dismiss}
      aria-label={title ?? undefined}
    >
      <h2 className="font-headline text-headline-md mb-4">{title}</h2>
      <p className="text-body-md">{message}</p>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="rounded-md border border-outline-variant px-4 py-2 text-label-md"
          onClick={dismiss}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-on-primary text-label-md"
          disabled={pending}
          onClick={accept}
        >
          Confirm
        </button>
      </div>
    </PortalDialog>
  );
}
