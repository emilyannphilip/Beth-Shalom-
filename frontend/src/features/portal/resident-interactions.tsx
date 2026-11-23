"use client";

import { useState, type FormEvent } from "react";
import { useDemo } from "./demo-session";
import { useGrid } from "./grid";
import {
  residentCategories,
  residentStatuses,
  type Resident,
  type StaffResident,
} from "./models";
import { badges, statusStyle } from "./status-badge";

type Editor = { id: string; resident: Resident | null };

export function useResidentManagement() {
  const { residents, saveResident } = useDemo();
  const [profile, setProfile] = useState<Resident | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const grid = useGrid(residents, {
    pageSize: 4,
    searchValue: (row) =>
      [
        row.id,
        row.name,
        row.room,
        row.category,
        row.status,
        row.contactLabel,
      ].join(" "),
    categoryValue: (row) => row.category,
    statusValue: (row) => row.status,
  });

  return {
    grid,
    profile,
    editor,
    show: setProfile,
    close: () => setProfile(null),
    dismissEditor: () => setEditor(null),
    create() {
      setEditor({
        id: `RES-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        resident: null,
      });
    },
    edit() {
      if (!profile) return;
      setEditor({ id: profile.id, resident: profile });
    },
    submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (!editor) return;
      const data = new FormData(event.currentTarget);
      const value = (key: string) => String(data.get(key) ?? "").trim();
      const prior = editor.resident;
      const category =
        residentCategories.find((entry) => entry === value("category")) ??
        residentCategories[0];
      const status =
        residentStatuses.find((entry) => entry === value("status")) ??
        residentStatuses[0];
      const record: Resident = {
        id: editor.id,
        name: value("name"),
        dob: value("dob"),
        gender: value("gender"),
        admitted: value("admitted"),
        ageLabel: value("dob").match(/\(([^)]+)\)/)?.[1] ?? value("dob"),
        room: value("room"),
        roomClass: prior?.roomClass ?? "font-code font-semibold text-primary",
        staffRoomClass: prior?.staffRoomClass,
        staffSummary:
          prior?.care === value("care") ? prior?.staffSummary : value("care"),
        category,
        categoryDetail:
          prior?.category === category ? prior.categoryDetail : "",
        address: value("address"),
        contactName: value("contactName"),
        contactPhone: value("contactPhone"),
        contactLabel:
          prior?.contactName === value("contactName")
            ? prior.contactLabel
            : value("contactName"),
        guardian: value("guardian"),
        care: value("care"),
        remarks: value("remarks"),
        status,
        badgeClass:
          prior?.status === status
            ? prior.badgeClass
            : badges(
                status,
                prior?.badgeClass ??
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-semibold",
              ),
        badgeDot:
          prior?.status === status
            ? prior.badgeDot
            : `w-1.5 h-1.5 rounded-full ${statusStyle(status)[1]}`,
      };
      saveResident(record);
      setEditor(null);
      if (prior) setProfile(record);
    },
  };
}

export function useStaffResidents() {
  const { residents } = useDemo();
  const [resident, inspect] = useState<StaffResident | null>(null);
  const rows: StaffResident[] = residents
    .filter((record) => record.staffRoomClass)
    .map((record) => ({
      id: record.id,
      name: record.name,
      room: record.room,
      staffRoomClass: record.staffRoomClass,
      category: record.category,
      status: record.status,
      care: record.care,
      summary: record.staffSummary ?? record.care,
      contactLabel: record.contactLabel,
      contactPhone: record.contactPhone,
    }));
  return { rows, resident, inspect, dismiss: () => inspect(null) };
}
