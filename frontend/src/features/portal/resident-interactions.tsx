"use client";

import { useRef, useState, type FormEvent } from "react";
import { errorMessage } from "@/lib/api";
import { currentAllocation } from "../accommodation/inventory";
import { parseTarget } from "./target-picker";
import { usePortal } from "./portal-session";
import { residentDetails, residentRecord, residentState } from "./portal-api";
import { useServerGrid } from "./server-grid";
import {
  contactFields,
  medicalFields,
  residentCategories,
  residentStatuses,
  type Resident,
} from "./models";

type Editor = { id: string; resident: Resident | null };
function isoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw Error("Use YYYY-MM-DD for the birth and admission dates.");
  const date = new Date(value);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  )
    throw Error("Enter a valid date.");
  return value;
}

export function useResidentManagement() {
  const { residents, saveResident, inventory, summary } = usePortal();
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [pending, setPending] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [accommodation, setAccommodation] = useState("ALL");
  const [profile, setProfile] = useState<Resident | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const latest = useRef(0),
    busy = useRef(false);
  const filterOptions = [
    ...new Set([
      ...inventory.categories.map((row) => row.name),
      ...inventory.rooms.map((row) => row.number),
      ...inventory.dormitories.map((row) => row.name),
      ...inventory.beds.map((row) => row.number),
    ]),
  ].sort();
  const grid = useServerGrid(
    "/residents",
    4,
    residentRecord,
    ({ search, category, status, sort }) => ({
      search,
      admissionCategory: category === "ALL" ? undefined : category,
      status: status === "ALL" ? undefined : residentState(status),
      categoryId: inventory.categories.find((row) => row.name === accommodation)
        ?.id,
      roomId: inventory.rooms.find((row) => row.number === accommodation)?.id,
      dormitoryId: inventory.dormitories.find(
        (row) => row.name === accommodation,
      )?.id,
      bedId: inventory.beds.find((row) => row.number === accommodation)?.id,
      sortBy: sort === "newest" ? "admission_date" : "full_name",
      sortOrder: sort === "az" ? "asc" : "desc",
    }),
  );
  const active = residents.filter((row) => row.status !== "Discharged");
  async function detail(record: Resident, mode: "show" | "edit") {
    const request = ++latest.current;
    setDetailError("");
    setDetailLoading(true);
    if (mode === "show") setProfile(record);
    try {
      const result = await residentDetails(record.id, inventory);
      if (request === latest.current) {
        if (mode === "show") setProfile(result);
        else {
          setError("");
          setEditor({ id: result.id, resident: result });
        }
      }
    } catch (failure) {
      if (request === latest.current) setDetailError(errorMessage(failure));
    } finally {
      if (request === latest.current) setDetailLoading(false);
    }
  }
  return {
    grid,
    counts: {
      total: summary?.admitted_residents ?? active.length,
      supported: active.filter((row) => row.category === residentCategories[1])
        .length,
      memory: active.filter((row) => row.category === residentCategories[2])
        .length,
      care: summary?.residents_with_care ?? 0,
    },
    accommodation,
    filterOptions,
    setAccommodation(value: string) {
      setAccommodation(value);
      grid.setPage(1);
    },
    error,
    detailError,
    detailLoading,
    pending,
    profile,
    editor,
    show: (record: Resident) => detail(record, "show"),
    close() {
      latest.current++;
      setProfile(null);
      setDetailError("");
      setDetailLoading(false);
    },
    dismissEditor() {
      if (!busy.current) {
        setEditor(null);
        setError("");
      }
    },
    create() {
      setError("");
      setEditor({ id: "new", resident: null });
    },
    editRecord: (record: Resident) => detail(record, "edit"),
    edit() {
      if (profile) {
        setError("");
        setEditor({ id: profile.id, resident: profile });
      }
    },
    async submit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (!editor || busy.current) return;
      const data = new FormData(event.currentTarget);
      const value = (field: string) => String(data.get(field) ?? "").trim();
      const prior = editor.resident;
      const target = parseTarget(data);
      const assigned = currentAllocation(inventory, editor.id);
      busy.current = true;
      setPending(true);
      setError("");
      try {
        const dob = isoDate(value("dob")),
          admitted = isoDate(value("admitted"));
        if (dob > admitted || dob > new Date().toISOString().slice(0, 10))
          throw Error(
            "Birth date must be on or before the admission date and today.",
          );
        const category =
          residentCategories.find((item) => item === value("category")) ??
          residentCategories[0];
        const status =
          residentStatuses.find((item) => item === value("status")) ??
          residentStatuses[0];
        await saveResident(
          {
            id: editor.id,
            name: value("name"),
            dob,
            admitted,
            phone: value("phone"),
            email: value("email"),
            medical: Object.fromEntries(Object.keys(medicalFields).map((key) => [key, value(key)])),
            emergencyDetails: Object.fromEntries(Object.keys(contactFields).map((key) => [key, value("emergency-" + key)])),
            guardianDetails: Object.fromEntries([...Object.keys(contactFields), "phone"].map((key) => [key, value("guardian-" + key)])),
            expectedDischarge: value("expectedDischarge"),
            gender: value("gender"),
            category,
            status,
            address: value("address"),
            contactName: value("contactName"),
            contactPhone: value("contactPhone"),
            guardian: value("guardian"),
            care: value("care"),
            remarks: value("remarks"),
            ageLabel: "",
            room: "",
            roomClass: "",
            contactLabel: "",
            categoryDetail: "",
            badgeClass: "",
            badgeDot: "",
          },
          target &&
            (assigned?.target.id !== target.id ||
              assigned.target.type !== target.type)
            ? target
            : undefined,
          Boolean(prior),
        );
        setEditor(null);
        setProfile(null);
      } catch (failure) {
        setError(errorMessage(failure));
      } finally {
        busy.current = false;
        setPending(false);
      }
    },
  };
}
