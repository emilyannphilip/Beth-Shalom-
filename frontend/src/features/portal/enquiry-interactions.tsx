"use client";

import { useRef, useState } from "react";
import { allRecords, errorMessage } from "@/lib/api";
import { enquiryRecord, enquiryState, type Row } from "./portal-api";
import { usePortal } from "./portal-session";
import { useServerGrid } from "./server-grid";
import { type Enquiry, type EnquiryStatus } from "./models";

function csvCell(value: string) {
  const safe = /^[\s]*[=+@-]|^[\t\r]/.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}

function downloadEnquiries(rows: Enquiry[]) {
  const entries = [
    [
      "Enquiry ID",
      "Name",
      "Telephone",
      "Email",
      "Category",
      "Enquiry date",
      "Preferred visit",
      "Status",
      "Notes",
      "Remarks",
      "Last updated",
      "Updated by",
      "Audit history",
    ],
    ...rows.map((row) => {
      const latest = row.audit?.at(-1);
      return [
        row.number ?? row.id,
        row.name,
        row.phone,
        row.email,
        row.category,
        row.date,
        row.visit,
        row.status,
        row.notes,
        row.remarks,
        latest?.time ?? "",
        latest?.role ?? "",
        latest ? JSON.stringify(row.audit) : "",
      ];
    }),
  ];
  const csv = entries
    .map((record) => record.map(csvCell).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "beth-shalom-enquiries.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useEnquiryWorkspace() {
  const { categories, saveEnquiry, enquiryDetail } = usePortal();
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [status, setStatus] = useState<EnquiryStatus>("New");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const latest = useRef(0);
  const saving = useRef(false);
  const grid = useServerGrid(
    "/enquiries",
    5,
    (row) => enquiryRecord(row, categories),
    (filters) => ({
      search: filters.search,
      categoryId: filters.category === "ALL" ? undefined : filters.category,
      status:
        filters.status === "ALL" ? undefined : enquiryState(filters.status),
      sortBy:
        filters.sort === "visit"
          ? "preferred_date"
          : filters.sort === "priority"
            ? "status"
            : "created_at",
      sortOrder: filters.sort === "visit" ? "asc" : "desc",
    }),
  );
  return {
    grid,
    selected,
    status,
    setStatus,
    remarks,
    setRemarks,
    error,
    detailLoading,
    pending,
    detailNotes: selected?.notes,
    async show(record: Enquiry) {
      const request = ++latest.current;
      setSelected(record);
      setStatus(record.status);
      setRemarks("");
      setError("");
      setDetailLoading(true);
      try {
        const detail = await enquiryDetail(record.id);
        if (request === latest.current) {
          setSelected(detail);
          setStatus(detail.status);
        }
      } catch (failure) {
        if (request === latest.current) setError(errorMessage(failure));
      } finally {
        if (request === latest.current) setDetailLoading(false);
      }
    },
    dismiss() {
      if (!saving.current) {
        latest.current++;
        setSelected(null);
        setError("");
      }
    },
    async save() {
      if (!selected || saving.current) return;
      saving.current = true;
      setPending(true);
      setError("");
      try {
        await saveEnquiry(selected.id, status, remarks.trim());
        setSelected(null);
      } catch (failure) {
        setError(errorMessage(failure));
      } finally {
        saving.current = false;
        setPending(false);
      }
    },
    async download() {
      try {
        const rows = await allRecords<Row>("/enquiries", grid.params);
        downloadEnquiries(rows.map((row) => enquiryRecord(row, categories)));
      } catch (failure) {
        setError(errorMessage(failure));
      }
    },
  };
}
