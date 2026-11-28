"use client";
import { PublicRoomAvailability } from "./room-availability";

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Modal } from "./modal";
import { RequestAction } from "./requests";

interface RoomPreview {
  id: string;
  code: string;
  title: string;
  category: string;
  units: string;
  description: string;
}

const RoomContext = createContext<{
  filter: string;
  setFilter: (filter: string) => void;
  preview: RoomPreview | null;
  setPreview: (room: RoomPreview | null) => void;
}>({ filter: "all", setFilter: () => {}, preview: null, setPreview: () => {} });

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState<RoomPreview | null>(null);

  return (
    <RoomContext.Provider value={{ filter, setFilter, preview, setPreview }}>
      {children}
    </RoomContext.Provider>
  );
}

export const useRoomFilter = () => useContext(RoomContext).filter;

const filterColors = new Set([
  "bg-primary",
  "text-on-primary",
  "bg-surface-container",
  "text-on-surface",
]);

export function RoomFilterButton({
  filter,
  className = "filter-tab min-h-[44px] px-5 py-2 rounded-full font-label-md text-label-md transition-colors",
  ...props
}: ComponentProps<"button"> & { filter: string }) {
  const { filter: active, setFilter } = useContext(RoomContext);
  const pressed = filter === active;
  const base = className
    .split(/\s+/)
    .filter((token) => !filterColors.has(token))
    .join(" ");

  return (
    <button
      {...props}
      type="button"
      className={`${base} ${pressed ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"}`}
      aria-pressed={pressed}
      onClick={() => setFilter(filter)}
    />
  );
}

export function RoomDetailsButton({
  room,
  ...props
}: ComponentProps<"button"> & { room: RoomPreview }) {
  const { setPreview } = useContext(RoomContext);
  return (
    <button
      {...props}
      type="button"
      aria-haspopup="dialog"
      onClick={() => setPreview(room)}
    />
  );
}

export function RoomCloseButton(props: ComponentProps<"button">) {
  const { setPreview } = useContext(RoomContext);
  return <button {...props} type="button" onClick={() => setPreview(null)} />;
}

export function RoomPreviewModal({
  children,
  ...props
}: ComponentProps<"div">) {
  const { preview, setPreview } = useContext(RoomContext);
  return (
    <Modal
      open={preview !== null}
      onDismiss={() => setPreview(null)}
      titleId="modal-title"
      backdropId="space-modal"
    >
      <div {...props}>{children}</div>
    </Modal>
  );
}

export function RoomValue({ field }: { field: keyof RoomPreview }) {
  const preview = useContext(RoomContext).preview;
  if (!preview) return null;
  if (field === "units")
    return <PublicRoomAvailability category={preview.code} />;
  return preview[field];
}

export function RoomApplicationButton(props: ComponentProps<"button">) {
  const { preview } = useContext(RoomContext);
  return (
    <RequestAction
      {...props}
      kind="room"
      category={preview?.title ?? ""}
      categoryId={preview?.id}
    />
  );
}
