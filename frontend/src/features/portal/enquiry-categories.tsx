"use client";

import { useState } from "react";
import { writeApi } from "@/lib/api-hooks";
import {
  ConfirmAction,
  FormFields,
  ManagementForm,
  formText,
  managementButton,
  type FieldSpec,
} from "./management-ui";
import { PortalDialog } from "./portal-dialog";
import { usePortal } from "./portal-session";
import type { EnquiryCategoryRecord } from "./portal-api";

const fields: FieldSpec[] = [
  { name: "name", label: "Category name", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "active", label: "Active category", type: "checkbox" },
];

export function EnquiryCategories() {
  const { categories } = usePortal();
  const [open, setOpen] = useState(false);
  const [editor, setEditor] = useState<EnquiryCategoryRecord | "new" | null>(
    null,
  );
  const [archive, setArchive] = useState<EnquiryCategoryRecord | null>(null);
  const selected = editor === "new" ? null : editor;

  async function save(form: FormData) {
    const data = {
      name: formText(form, "name"),
      description: formText(form, "description"),
      is_active: form.has("active"),
    };
    if (selected) {
      await writeApi(`/enquiry-categories/${selected.id}`, "PATCH", data);
    } else {
      await writeApi("/enquiry-categories", "POST", data);
    }
  }

  return (
    <>
      <button
        type="button"
        className={managementButton}
        onClick={() => setOpen(true)}
      >
        Manage enquiry categories
      </button>
      <PortalDialog
        className="w-full max-w-2xl rounded-2xl border border-outline-variant bg-white p-6"
        open={open}
        dismiss={() => setOpen(false)}
        aria-labelledby="enquiry-categories-title"
      >
        <h2
          id="enquiry-categories-title"
          className="font-headline text-headline-sm"
        >
          Enquiry categories
        </h2>
        <ul className="my-4 divide-y divide-outline-variant">
          {categories.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2"
            >
              <div>
                <p className="font-semibold">{row.name}</p>
                <p>
                  {row.is_active ? "Active" : "Inactive"}
                  {row.description ? " · " + row.description : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={managementButton}
                  aria-label={"Edit " + row.name}
                  onClick={() => setEditor(row)}
                >
                  Edit
                </button>
                {row.is_active && (
                  <button
                    type="button"
                    className={managementButton}
                    aria-label={"Archive " + row.name}
                    onClick={() => setArchive(row)}
                  >
                    Archive
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button
            type="button"
            className={managementButton}
            onClick={() => setEditor("new")}
          >
            Add enquiry category
          </button>
          <button
            type="button"
            className={managementButton}
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </PortalDialog>
      <ManagementForm
        title={
          editor
            ? selected
              ? "Edit enquiry category"
              : "Add enquiry category"
            : null
        }
        close={() => setEditor(null)}
        save={save}
        updating={Boolean(selected)}
      >
        <FormFields
          fields={fields}
          values={{
            name: selected?.name,
            description: selected?.description ?? undefined,
            active: selected?.is_active ?? true,
          }}
        />
      </ManagementForm>
      <ConfirmAction
        title={archive ? "Archive enquiry category" : null}
        message="Deactivate this category for new enquiries? Existing enquiries retain their category."
        close={() => setArchive(null)}
        action={() => writeApi(`/enquiry-categories/${archive!.id}`, "DELETE")}
      />
    </>
  );
}
