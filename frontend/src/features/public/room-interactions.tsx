"use client";

import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Modal } from "./modal";
import { RequestAction } from "./requests";

type Category = "studio" | "1bed" | "suite";
type Filter = Category | "all";

interface RoomPreview {
  title: string;
  category: string;
  units: string;
  description: string;
}

const RoomContext = createContext<{
  filter: Filter;
  setFilter: (filter: Filter) => void;
  preview: RoomPreview | null;
  setPreview: (room: RoomPreview | null) => void;
}>({ filter: "all", setFilter: () => {}, preview: null, setPreview: () => {} });

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [preview, setPreview] = useState<RoomPreview | null>(null);

  return (
    <RoomContext.Provider value={{ filter, setFilter, preview, setPreview }}>
      {children}
    </RoomContext.Provider>
  );
}

const filterColors = new Set([
  "bg-primary",
  "text-on-primary",
  "bg-surface-container",
  "text-on-surface",
]);

export function RoomFilterButton({
  filter,
  className = "",
  ...props
}: ComponentProps<"button"> & { filter: Filter }) {
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

export function RoomCard({
  category,
  as: Tag,
  className,
  ...props
}: ComponentProps<"div"> & { category: Category; as: "div" | "article" }) {
  const { filter } = useContext(RoomContext);
  const filtered = filter !== "all" && filter !== category;
  return (
    <Tag
      {...props}
      hidden={filtered}
      className={filtered ? (className ?? "") + " hidden" : className}
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
  return useContext(RoomContext).preview?.[field] ?? null;
}

export function RoomApplicationButton(props: ComponentProps<"button">) {
  const { preview } = useContext(RoomContext);
  return (
    <RequestAction {...props} kind="room" category={preview?.title ?? ""} />
  );
}
