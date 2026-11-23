"use client";

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Modal } from "./modal";

const GalleryContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <GalleryContext.Provider value={{ open, setOpen }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function GalleryButton({
  action,
  ...props
}: ComponentProps<"button"> & { action: "open" | "close" }) {
  const { setOpen } = useContext(GalleryContext);
  return (
    <button
      {...props}
      type="button"
      aria-haspopup={action === "open" ? "dialog" : undefined}
      onClick={() => setOpen(action === "open")}
    />
  );
}

export function GalleryModal({ children, ...props }: ComponentProps<"div">) {
  const { open, setOpen } = useContext(GalleryContext);
  return (
    <Modal
      open={open}
      onDismiss={() => setOpen(false)}
      titleId="gallery-title"
      backdropId="gallery-modal"
    >
      <div {...props}>{children}</div>
    </Modal>
  );
}
