"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function useModal(
  open: boolean,
  onDismiss: () => void,
  focusSelector?: string,
) {
  const ref = useRef<HTMLDialogElement>(null);
  const dismiss = useRef(onDismiss);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    dismiss.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        opener.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        dialog.showModal();
      }
      if (focusSelector)
        dialog.querySelector<HTMLElement>(focusSelector)?.focus();
    } else if (dialog.open) {
      dialog.close();
      opener.current?.focus({ preventScroll: true });
      opener.current = null;
    }
  }, [open, focusSelector]);

  return {
    ref,
    onCancel: (event: React.SyntheticEvent<HTMLDialogElement>) => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      event.stopPropagation();
      dismiss.current();
    },
  };
}

interface ModalProps {
  open: boolean;
  onDismiss: () => void;
  active?: boolean;
  titleId: string;
  descriptionId?: string;
  backdropId: string;
  focusSelector?: string;
  children: ReactNode;
}

export function Modal({
  open,
  active = open,
  onDismiss,
  titleId,
  descriptionId,
  backdropId,
  focusSelector,
  children,
}: ModalProps) {
  const modal = useModal(open, onDismiss, focusSelector);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(active));
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <dialog
      {...modal}
      className="public-dialog-frame"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-ready={shown || undefined}
      onClick={(event) => {
        if (
          event.target === event.currentTarget ||
          (event.target instanceof Element && event.target.id === backdropId)
        ) {
          onDismiss();
        }
      }}
    >
      {children}
    </dialog>
  );
}
