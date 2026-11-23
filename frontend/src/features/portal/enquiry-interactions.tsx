"use client";

import { useState } from "react";
import { useDemo } from "./demo-session";
import { useGrid } from "./grid";
import {
  enquiryStatuses,
  type DemoRole,
  type Enquiry,
  type EnquiryStatus,
} from "./models";

function compareEnquiries(first: Enquiry, second: Enquiry, sort: string) {
  if (sort === "priority")
    return (
      enquiryStatuses.indexOf(first.status) -
      enquiryStatuses.indexOf(second.status)
    );
  const convert = (value: string, fallback: number) =>
    Number.isNaN(Date.parse(value)) ? fallback : Date.parse(value);
  if (sort === "visit")
    return (
      convert(first.visit, Infinity) - convert(second.visit, Infinity) || 0
    );
  return convert(second.date, -Infinity) - convert(first.date, -Infinity) || 0;
}

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
        row.id,
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

export function useEnquiryWorkspace(role: DemoRole) {
  const { enquiries, saveEnquiry } = useDemo();
  const admin = role === "admin";
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [status, setStatus] = useState<EnquiryStatus>("New");
  const [remarks, setRemarks] = useState("");

  const grid = useGrid(
    admin ? enquiries : enquiries.filter((row) => row.staff),
    {
      pageSize: admin ? 5 : 3,
      searchValue: (row) =>
        [
          row.id,
          row.name,
          admin ? row.relationship : "",
          row.phone,
          admin ? row.email : "",
          row.category,
          row.date,
          row.visit,
          row.status,
        ].join(" "),
      categoryValue: (row) => row.category,
      statusValue: (row) => row.status,
      compare: admin ? compareEnquiries : undefined,
    },
  );

  return {
    grid,
    selected,
    status,
    setStatus,
    remarks,
    setRemarks,
    detailNotes: admin ? selected?.notes : selected?.staff?.notes,
    show(record: Enquiry) {
      setSelected(record);
      setStatus(record.status);
      setRemarks(
        admin || record.audit?.length
          ? record.remarks
          : (record.staff?.remarks ?? ""),
      );
    },
    dismiss: () => setSelected(null),
    save() {
      if (selected) saveEnquiry(selected.id, status, remarks.trim());
      setSelected(null);
    },
    download: () => {
      if (admin) downloadEnquiries(grid.matched);
    },
  };
}
