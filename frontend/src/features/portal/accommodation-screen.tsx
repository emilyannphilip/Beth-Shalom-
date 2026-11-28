"use client";

import { useState } from "react";
import Link from "next/link";
import {
  availabilityCountKeys,
  floorLabel,
  floorList,
  type AvailabilityScope,
} from "../accommodation/availability";
import {
  active,
  currentAllocation,
  inventoryKinds,
  targetLabel,
  unitState,
  type ApiInventoryCommand,
  type InventoryKind,
  type Target,
  type AccommodationType,
} from "../accommodation/inventory";
import {
  historyRecord,
  inventoryRoutes,
  reservationTimeFields,
  s,
  type Row,
} from "./portal-api";
import type { ApiPath } from "@/lib/api-path";
import type { Filters } from "./server-grid";
import { PortalDataStatus, usePortal } from "./portal-session";
import { PortalFrame } from "./portal-frame";
import { PortalSidebar } from "./portal-sidebar";
import {
  ConfirmAction,
  FormFields,
  formText,
  ManagementForm,
  ManagementTable,
  RecordAction,
  RecordDetails,
  managementButton,
  optionsOf,
  type FieldSpec,
  type FormValues,
  type ManagementRow,
} from "./management-ui";
import { parseTarget, TargetPicker } from "./target-picker";
import { CategoryArchiveDialog } from "./category-archive-dialog";
import { AvailabilityDialog, type BookingAction } from "./availability-dialog";

const sections = {
  categories: "Room Categories",
  rooms: "Rooms",
  dormitories: "Dormitories",
  beds: "Bed Management",
  allocations: "Resident Allocations",
  reservations: "Reservations",
  history: "Allocation History",
} as const;
type Tab = keyof typeof sections;
type Editor = {
  tab: Exclude<Tab, "history">;
  id: string | null;
  parentId?: string;
  target?: Target;
};
const required = (name: string, label: string): FieldSpec => ({
  name,
  label,
  required: true,
});
const capacity: FieldSpec = {
  ...required("capacity", "Maximum occupancy"),
  type: "number",
  min: 1,
};
const buildingField = required("building", "Building or block");
const floor: FieldSpec = {
  ...required("floor", "Floor number"),
  type: "number",
};
const remarks: FieldSpec = {
  name: "remarks",
  label: "Remarks",
  type: "textarea",
};
const maintenance: FieldSpec = {
  name: "maintenance",
  label: "Under maintenance",
  type: "checkbox",
};

const operational: FieldSpec = {
  name: "operationalStatus",
  label: "Operational status",
  options: [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "MAINTENANCE", label: "Under maintenance" },
  ],
  required: true,
};
const reservationStatus: Record<string, string> = {
  Pending: "PENDING",
  Reserved: "CONFIRMED",
  Cancelled: "CANCELLED",
  Expired: "EXPIRED",
  Fulfilled: "CONVERTED",
};
export function AccommodationScreen() {
  const {
    session,
    inventory,
    residents,
    housingResidents,
    residentName,
    inventoryAction,
    summary,
    buildings,
    loading,
    error,
    retry,
  } = usePortal();
  const isAdmin = session?.role === "admin";
  const [tab, setTab] = useState<Tab>("categories");
  const [availabilityEditor, setAvailabilityEditor] =
    useState<AvailabilityScope | null>(null);
  const [bookingTarget, setBookingTarget] = useState<{
    target: Target;
    label: string;
  } | null>(null);
  const [historyTarget, setHistoryTarget] = useState<{
    kind: "rooms" | "beds";
    id: string;
    label: string;
  } | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [details, setDetails] = useState<{
    title: string;
    entries: [string, string][];
  } | null>(null);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    command: ApiInventoryCommand;
  } | null>(null);
  const [notice, setNotice] = useState("");
  const [statusEditor, setStatusEditor] = useState<{
    kind: Exclude<InventoryKind, "categories">;
    id: string;
    label: string;
    status?: string;
  } | null>(null);
  const [categoryArchive, setCategoryArchive] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedResident, setSelectedResident] = useState("");
  const [reservationPeriod, setReservationPeriod] = useState({
    start: "",
    end: "",
  });
  const categoryName = (id: string) =>
    inventory.categories.find((row) => row.id === id)?.name ?? "";
  const dormName = (id: string) =>
    inventory.dormitories.find((row) => row.id === id)?.name ?? "";
  const categoryOptions = (type: AccommodationType) =>
    active(inventory.categories)
      .filter((row) => row.type === type && !row.maintenance)
      .map((row) => ({ value: row.id, label: row.name }));
  const eligible = housingResidents;
  const peopleFor = (target: Target) =>
    inventory.allocations
      .filter(
        (row) =>
          !row.endedAt &&
          row.target.type === target.type &&
          row.target.id === target.id,
      )
      .flatMap((allocation) =>
        residents
          .filter((row) => row.id === allocation.residentId)
          .map((row) => ({ row, allocation })),
      );
  const residentDetails = (target: Target): [string, string][] =>
    peopleFor(target).flatMap(({ row, allocation }) => {
      const entries: [string, string][] = [
        ["Assigned resident " + (row.number || row.id), row.name],
        ["Admission date " + row.id, row.admitted],
        ["Allocation date " + row.id, allocation.date],
        [
          "Expected discharge " + row.id,
          row.expectedDischarge ?? "",
        ],
        ["Actual discharge " + row.id, row.discharged ?? ""],
      ];
        entries.push(
          [
            "Emergency contact " + row.id,
            [row.contactLabel, row.contactPhone].filter(Boolean).join(" · "),
          ],
          ["Care directives " + row.id, row.care],
        );
        entries.push(
          ["Guardian " + row.id, row.guardian],
          ["Date of birth " + row.id, row.dob],
          ["Gender " + row.id, row.gender],
          ["Address " + row.id, row.address],
          ["Administrative remarks " + row.id, row.remarks],
        );
      return entries;
    });
  const execute = async (command: ApiInventoryCommand, message: string) => {
    setNotice("");
    await inventoryAction(command);
    setNotice(message);
  };
  const openEditor = (next: Editor, residentId = "") => {
    if (next.tab === "reservations") {
      const existing = inventory.reservations.find((row) => row.id === next.id);
      setReservationPeriod(reservationTimeFields(existing));
    }
    setSelectedResident(residentId);
    setEditor(next);
    setNotice("");
  };
  function manageAvailabilityBooking(
    action: BookingAction,
    target: Target,
    label: string,
  ) {
    const bookings =
      action === "Allocate" || action === "Manage allocations"
        ? "allocations"
        : "reservations";
    setAvailabilityEditor(null);
    setHistoryTarget(null);
    setNotice("");
    setBookingTarget({ target, label });
    setTab(bookings);
    if (action === "Allocate" || action === "Reserve")
      openEditor({ tab: bookings, id: null, target });
  }

  const view = (
    title: string,
    columns: string[],
    cells: string[],
    extra: [string, string][] = [],
  ) =>
    setDetails({
      title,
      entries: [
        ...columns.map((column, i): [string, string] => [column, cells[i]]),
        ...extra,
      ],
    });
  const catalogActions = (
    kind: InventoryKind,
    id: string,
    label: string,
    columns: string[],
    cells: string[],
    extra?: [string, string][],
  ) => (
    <>
      <RecordAction
        action="visibility"
        label={"View " + label}
        onClick={() => view(label, columns, cells, extra)}
      />
      <RecordAction
        action="edit"
        label={"Edit " + label}
        onClick={() => openEditor({ tab: kind, id })}
      />
      {(kind === "categories" || kind === "dormitories") && (
        <button
          type="button"
          className={managementButton}
          aria-label={"Edit availability for " + label}
          onClick={() =>
            setAvailabilityEditor({
              scope: kind === "categories" ? "category" : "dormitory",
              id,
              label,
            })
          }
        >
          Edit Availability
        </button>
      )}
      {kind === "categories" &&
        !inventory.categories.find((row) => row.id === id)?.maintenance &&
        inventory.categories.find((row) => row.id === id)?.type === "Room" && (
          <button
            className={managementButton}
            type="button"
            onClick={() => openEditor({ tab: "rooms", id: null, parentId: id })}
          >
            Add room
          </button>
        )}
      {kind === "dormitories" && (
        <button
          className={managementButton}
          type="button"
          onClick={() => openEditor({ tab: "beds", id: null, parentId: id })}
        >
          Add bed
        </button>
      )}
      {(kind === "rooms" || kind === "beds") && (
        <button
          type="button"
          className={managementButton}
          aria-label={"View allocation history for " + label}
          onClick={() => {
            setHistoryTarget({ kind, id, label });
            setTab("history");
          }}
        >
          History
        </button>
      )}
      {kind !== "categories" && (
        <button
          className={managementButton}
          type="button"
          aria-label={"Change status for " + label}
          onClick={() =>
            setStatusEditor({
              kind,
              id,
              label,
              status: inventory[kind].find((row) => row.id === id)
                ?.operationalStatus,
            })
          }
        >
          Change status
        </button>
      )}
      <RecordAction
        action="delete"
        label={"Archive " + label}
        onClick={() => {
          setNotice("");
          if (kind === "categories") {
            setCategoryArchive({ id, name: label });
          } else {
            setConfirmation({
              title: "Archive " + label,
              command: { action: "archive", kind, id },
            });
          }
        }}
      />
    </>
  );

  const categoryColumns = [
    "Category",
    "Code",
    "Type",
    "Description",
    "Max occupancy",
    "Floors",
    "Total rooms or beds",
    "Available",
    "Occupied",
    "Reserved",
    "Maintenance",
    "Inactive",
    "Status",
  ];
  const roomColumns = [
    "Room number",
    "Category",
    "Building",
    "Floor",
    "Occupancy",
    "Remaining capacity",
    "Assigned residents",
    "Remarks",
    "Status",
  ];
  const dormColumns = [
    "Dormitory",
    "Number",
    "Category",
    "Building",
    "Floor",
    "Total beds",
    "Available",
    "Occupied",
    "Reserved",
    "Maintenance",
    "Inactive",
    "Status",
  ];
  const bedColumns = [
    "Bed number",
    "Dormitory",
    "Floor",
    "Assigned resident",
    "Allocation date",
    "Remarks",
    "Status",
  ];
  const allocationColumns = [
    "Resident",
    "Accommodation",
    "Type",
    "Date",
    "Remarks",
    "Status",
  ];
  const historyColumns = [
    "Event",
    "Resident",
    "Accommodation",
    "Recorded",
    "Remarks",
  ];
  const configs: Record<
    Tab,
    {
      columns: string[];
      rows: ManagementRow[];
      mapRow?: (row: Row) => ManagementRow;
      statusOptions?: string[];
    }
  > = {
    categories: {
      columns: categoryColumns,
      rows: (tab === "categories" ? active(inventory.categories) : []).map(
        (row) => {
          const floors = row.floors ?? [];
          const state = row.maintenance ? "Inactive" : "Active";
          const cells = [
            row.name,
            row.code,
            row.type,
            row.description,
            String(row.capacity),
            floorList(floors),
            ...availabilityCountKeys.map((metric) =>
              String(row.availability?.[metric] ?? "—"),
            ),
            state,
          ];
          return {
            id: row.id,
            cells,
            status: state,
            group: row.type,
            actions: catalogActions(
              "categories",
              row.id,
              row.name,
              categoryColumns,
              cells,
              [
                ["Image source", row.imageUrl ?? ""],
                ...floors.map(
                  (floor) =>
                    [
                      floorLabel(floor.floor_number),
                      `${floor.available_units} available · ${floor.occupied_units} occupied · ${floor.reserved_units} reserved · ${floor.maintenance_units} maintenance · ${floor.inactive_units} inactive`,
                    ] as [string, string],
                ),
              ],
            ),
          };
        },
      ),
    },
    rooms: {
      columns: roomColumns,
      rows: (tab === "rooms" ? active(inventory.rooms) : []).map((row) => {
        const target: Target = { type: "Room", id: row.id };
        const unit = unitState(inventory, target);
        const cells = [
          row.number,
          categoryName(row.categoryId),
          row.building,
          floorLabel(row.floor),
          unit.occupancy + " / " + unit.capacity,
          String(row.freeSpaces ?? 0),
          peopleFor(target)
            .map(({ row }) => row.name)
            .join(", "),
          row.remarks,
          unit.status,
        ];
        return {
          id: row.id,
          cells,
          status: unit.status,
          floor: row.floor,
          group: cells[1],
          actions: catalogActions(
            "rooms",
            row.id,
            row.number,
            roomColumns,
            cells,
            [
              ...residentDetails(target),
              ["Created", row.createdAt ?? ""],
              ["Last updated", row.updatedAt ?? ""],
            ],
          ),
        };
      }),
    },
    dormitories: {
      columns: dormColumns,
      rows: (tab === "dormitories" ? active(inventory.dormitories) : []).map(
        (row) => {
          const dormStatus =
            row.operationalStatus === "MAINTENANCE"
              ? "Under Maintenance"
              : row.operationalStatus === "INACTIVE"
                ? "Inactive"
                : "Active";
          const cells = [
            row.name,
            row.number,
            categoryName(row.categoryId),
            row.building,
            floorLabel(row.floor),
            ...availabilityCountKeys.map((metric) =>
              String(row.availability?.[metric] ?? "—"),
            ),
            dormStatus,
          ];
          return {
            id: row.id,
            cells,
            status: dormStatus,
            floor: row.floor,
            group: cells[2],
            actions: catalogActions(
              "dormitories",
              row.id,
              row.name,
              dormColumns,
              cells,
            ),
          };
        },
      ),
    },
    beds: {
      columns: bedColumns,
      rows: (tab === "beds" ? active(inventory.beds) : []).map((row) => {
        const target: Target = { type: "Dormitory", id: row.id };
        const occupant = peopleFor(target)[0];
        const unitStatus = unitState(inventory, target).status;
        const cells = [
          row.number,
          dormName(row.dormitoryId),
          floorLabel(
            inventory.dormitories.find((item) => item.id === row.dormitoryId)
              ?.floor,
          ),
          occupant?.row.name ?? "",
          occupant?.allocation.date ?? "",
          row.remarks,
          unitStatus,
        ];
        return {
          id: row.id,
          cells,
          status: unitStatus,
          floor: inventory.dormitories.find(
            (item) => item.id === row.dormitoryId,
          )?.floor,
          group: cells[1],
          actions: catalogActions(
            "beds",
            row.id,
            row.number,
            bedColumns,
            cells,
            residentDetails(target),
          ),
        };
      }),
    },
    allocations: {
      columns: allocationColumns,
      rows: inventory.allocations
        .filter((row) => !row.endedAt)
        .map((row) => {
          const cells = [
            residentName(row.residentId),
            targetLabel(inventory, row.target),
            row.target.type,
            row.date,
            row.remarks,
            "Allocated",
          ];
          return {
            id: row.id,
            cells,
            status: "Allocated",
            group: row.target.type,
            actions: (
              <>
                <RecordAction
                  action="visibility"
                  label="View allocation"
                  onClick={() =>
                    view(
                      "Allocation",
                      allocationColumns,
                      cells,
                      residentDetails(row.target).filter(([key]) =>
                        key.endsWith(row.residentId),
                      ),
                    )
                  }
                />
                <RecordAction
                  action="edit"
                  label="Edit or transfer allocation"
                  onClick={() =>
                    openEditor(
                      { tab: "allocations", id: row.id },
                      row.residentId,
                    )
                  }
                />
                <RecordAction
                  action="delete"
                  label="Release accommodation"
                  onClick={() =>
                    setConfirmation({
                      title: "Release accommodation",
                      command: {
                        action: "release",
                        residentId: row.residentId,
                        reason: "Released",
                      },
                    })
                  }
                />
              </>
            ),
          };
        }),
    },
    reservations: {
      columns: allocationColumns,
      rows: (tab === "reservations" ? inventory.reservations : []).map(
        (row) => {
          const cells = [
            residentName(row.residentId),
            targetLabel(inventory, row.target),
            row.target.type,
            row.date,
            row.remarks,
            row.status,
          ];
          return {
            id: row.id,
            cells,
            status: row.status,
            group: row.target.type,
            actions: (
              <>
                <RecordAction
                  action="visibility"
                  label="View reservation"
                  onClick={() =>
                    view("Reservation", allocationColumns, cells, [
                      ["Starts", row.start ?? ""],
                      ["Ends", row.end ?? ""],
                      ["Reserved places", String(row.capacity ?? 1)],
                    ])
                  }
                />
                {row.status === "Pending" && (
                  <RecordAction
                    action="edit"
                    label="Confirm reservation"
                    onClick={() =>
                      setConfirmation({
                        title: "Confirm reservation",
                        command: { action: "confirm-reservation", id: row.id },
                      })
                    }
                  />
                )}
                {row.status === "Reserved" && (
                  <RecordAction
                    action="edit"
                    label="Convert reservation to allocation"
                    onClick={() =>
                      setConfirmation({
                        title: "Convert reservation",
                        command: { action: "convert-reservation", id: row.id },
                      })
                    }
                  />
                )}
                {row.status === "Expired" && (
                  <RecordAction
                    action="edit"
                    label="Finalize expired reservation"
                    onClick={() =>
                      setConfirmation({
                        title: "Expire reservation",
                        command: { action: "expire-reservation", id: row.id },
                      })
                    }
                  />
                )}
                {(row.status === "Pending" || row.status === "Reserved") && (
                  <>
                    <RecordAction
                      action="edit"
                      label="Edit reservation"
                      onClick={() =>
                        openEditor(
                          { tab: "reservations", id: row.id },
                          row.residentId,
                        )
                      }
                    />
                    <RecordAction
                      action="delete"
                      label="Cancel reservation"
                      onClick={() =>
                        setConfirmation({
                          title: "Cancel reservation",
                          command: { action: "cancel", id: row.id },
                        })
                      }
                    />
                  </>
                )}
              </>
            ),
          };
        },
      ),
    },
    history: {
      columns: historyColumns,
      rows: [],
      statusOptions: [
        "ADMIT",
        "ALLOCATE",
        "TRANSFER",
        "RELEASE",
        "DISCHARGE",
        "ARCHIVE",
        "UPDATE",
      ],
      mapRow: (item: Row) => {
        const row = historyRecord(item, inventory);
        return {
          id: row.id,
          cells: [
            row.action,
            residentName(row.residentId),
            row.target,
            row.date.replace("T", " ").slice(0, 16) + " UTC",
            row.remarks,
          ],
          status: row.action,
        };
      },
    },
  };

  async function save(data: FormData) {
    if (!editor) return;
    const id = editor.id ?? crypto.randomUUID();
    const str = (name: string) => formText(data, name);
    const num = (name: string) => Number(str(name));
    const maintained =
      data.has("maintenance") || str("operationalStatus") === "MAINTENANCE";
    const base = {
      id,
      number: str("number"),
      building: str("building"),
      floor: num("floor"),
      capacity: num("capacity"),
      categoryId: str("categoryId"),
    };
    switch (editor.tab) {
      case "categories":
        await execute(
          {
            action: "save",
            kind: "categories",
            record: {
              id,
              name: str("name"),
              code: str("code"),
              type: str("type") === "Dormitory" ? "Dormitory" : "Room",
              description: str("description"),
              imageUrl: str("imageUrl"),
              publicFeatures: str("publicFeatures"),
              capacity: base.capacity,
              maintenance: maintained,
            },
          },
          "Category saved.",
        );
        break;
      case "rooms":
        await execute(
          {
            action: "save",
            kind: "rooms",
            record: {
              ...base,
              maintenance: maintained,
              liveStatus:
                str("operationalStatus") === "INACTIVE"
                  ? "Inactive"
                  : undefined,
              remarks: str("remarks"),
            },
          },
          "Room saved.",
        );
        break;
      case "dormitories":
        await execute(
          {
            action: "save",
            kind: "dormitories",
            record: {
              ...base,
              name: str("name"),
              floor: str("floor") ? num("floor") : null,
              bedLimit: str("bedLimit") ? num("bedLimit") : null,
              description: str("description"),
              imageUrl: str("imageUrl"),
              operationalStatus: str("operationalStatus"),
              remarks: str("remarks"),
            },
          },
          "Dormitory saved.",
        );
        break;
      case "beds":
        await execute(
          {
            action: "save",
            kind: "beds",
            record: {
              id,
              number: base.number,
              dormitoryId: str("dormitoryId"),
              maintenance: maintained,
              liveStatus:
                str("operationalStatus") === "INACTIVE"
                  ? "Inactive"
                  : undefined,
              remarks: str("remarks"),
            },
          },
          "Bed saved.",
        );
        break;
      case "allocations":
      case "reservations": {
        const target = parseTarget(data);
        if (!target) throw Error("Select a room or an individual bed.");
        const record = {
          id,
          target,
          residentId: str("residentId"),
          date: str("date"),
          remarks: str("remarks"),
        };
        if (editor.tab === "allocations") {
          if (!editor.id && currentAllocation(inventory, record.residentId)) {
            throw Error(
              "Use Edit or transfer on the resident’s active allocation.",
            );
          }
          const previous = inventory.allocations.find(
            (row) => row.id === editor.id,
          );
          if (
            previous &&
            previous.target.type === target.type &&
            previous.target.id === target.id
          )
            await execute(
              {
                action: "edit-allocation",
                id,
                date: record.date,
                remarks: record.remarks,
              },
              "Allocation updated.",
            );
          else
            await execute(
              { action: "allocate", ...record },
              "Allocation confirmed.",
            );
        } else
          await execute(
            {
              action: "reserve",
              record: {
                ...record,
                start: str("start") + ":00+05:30",
                end: str("end") + ":00+05:30",
                capacity: num("reservedCapacity"),
              },
            },
            "Reservation saved.",
          );
        break;
      }
    }
  }

  const building = {
    ...buildingField,
    options: buildings
      .filter((row) => row.is_active)
      .map((row) => ({
        value: s(row, "building_name"),
        label: s(row, "building_name"),
      })),
  };
  const fieldMap: Record<InventoryKind, FieldSpec[]> = {
    categories: [
      required("name", "Category name"),
      required("code", "Category code"),
      {
        ...required("type", "Accommodation type"),
        options: optionsOf(["Room", "Dormitory"]),
      },
      capacity,
      { name: "description", label: "Description", type: "textarea" },
      { name: "imageUrl", label: "Accommodation image URL" },
      {
        name: "publicFeatures",
        label: "Room features (one per line)",
        type: "textarea",
      },
      { ...maintenance, label: "Inactive" },
    ],
    rooms: [
      required("number", "Room number"),
      {
        ...required("categoryId", "Room category"),
        options: categoryOptions("Room"),
      },
      building,
      floor,
      capacity,
      remarks,
      operational,
    ],
    dormitories: [
      required("name", "Dormitory name"),
      required("number", "Dormitory number"),
      {
        ...required("categoryId", "Dormitory category"),
        options: categoryOptions("Dormitory"),
      },
      building,
      { ...floor, required: false },
      { name: "bedLimit", label: "Optional bed limit", min: 1, type: "number" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "imageUrl", label: "Dormitory image URL" },
      operational,
      remarks,
    ],
    beds: [
      required("number", "Bed number"),
      {
        ...required("dormitoryId", "Dormitory"),
        options: active(inventory.dormitories).map((row) => ({
          value: row.id,
          label: row.name,
        })),
      },
      remarks,
      operational,
    ],
  };
  const assetKind =
    editor && inventoryKinds.find((kind) => kind === editor.tab);
  const existing =
    assetKind && inventory[assetKind].find((row) => row.id === editor?.id);
  const allocation =
    editor?.tab === "allocations"
      ? inventory.allocations.find((row) => row.id === editor.id)
      : undefined;
  const reservation =
    editor?.tab === "reservations"
      ? inventory.reservations.find((row) => row.id === editor.id)
      : undefined;
  const stats = [
    ["Total rooms", "total_rooms"],
    ["Available rooms", "available_rooms"],
    ["Occupied rooms", "occupied_rooms"],
    ["Reserved rooms", "reserved_rooms"],
    ["Rooms under maintenance", "maintenance_rooms"],
    ["Inactive rooms", "inactive_rooms"],
    ["Total dormitory beds", "total_beds"],
    ["Available dormitory beds", "available_beds"],
    ["Occupied dormitory beds", "occupied_beds"],
    ["Reserved dormitory beds", "reserved_beds"],
    ["Beds under maintenance", "maintenance_beds"],
  ] as const;
  const endpoint: ApiPath =
    tab === "allocations"
      ? "/allocations"
      : tab === "reservations"
        ? "/reservations"
        : tab === "history"
          ? "/allocations/history"
          : inventoryRoutes[tab];
  function query({ search, category, status, sort, floor }: Filters) {
    const chosenCategory = inventory.categories.find(
      (row) => row.name === category,
    )?.id;
    const chosenDorm = inventory.dormitories.find(
      (row) => row.name === category,
    )?.id;
    const sortBy = {
      categories: "category_name",
      rooms: "room_number",
      dormitories: "dormitory_name",
      beds: "bed_number",
      allocations: "resident_number",
      reservations: "reservation_number",
      history: "action",
    }[tab];
    return {
      search,
      roomId:
        tab === "history" && historyTarget?.kind === "rooms"
          ? historyTarget.id
          : bookingTarget?.target.type === "Room" &&
              (tab === "allocations" || tab === "reservations")
            ? bookingTarget.target.id
            : undefined,
      bedId:
        tab === "history" && historyTarget?.kind === "beds"
          ? historyTarget.id
          : bookingTarget?.target.type === "Dormitory" &&
              (tab === "allocations" || tab === "reservations")
            ? bookingTarget.target.id
            : undefined,
      floor:
        floor !== "ALL" && ["rooms", "dormitories", "beds"].includes(tab)
          ? Number(floor)
          : undefined,
      sortBy: sort === "newest" ? "created_at" : sortBy,
      sortOrder: sort === "asc" ? "asc" : "desc",
      categoryId: ["rooms", "dormitories"].includes(tab)
        ? chosenCategory
        : undefined,
      dormitoryId: tab === "beds" ? chosenDorm : undefined,
      accommodationType:
        ["categories", "allocations", "reservations"].includes(tab) &&
        category !== "ALL"
          ? category.toUpperCase()
          : undefined,
      status:
        tab === "allocations"
          ? "ACTIVE"
          : tab === "reservations"
            ? reservationStatus[status]
            : tab === "history" && status !== "ALL"
              ? status
              : undefined,
      availabilityStatus:
        inventoryKinds.some((kind) => kind === tab) && status !== "ALL"
          ? status
          : undefined,
    };
  }
  const tabs = Object.keys(sections) as Tab[];
  const config = configs[tab];

  return (
    <PortalFrame>
      <PortalSidebar screen={isAdmin ? "admin" : "staff"} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-white px-4 py-3">
          <div>
            <h1 className="font-headline text-headline-sm">Room Management</h1>
          </div>
          <Link className={managementButton} href="/rooms">
            View public availability
          </Link>
        </header>
        <main className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.map(([label, value]) => (
              <div
                key={label}
                className="bg-white rounded-lg border border-outline-variant p-3"
              >
                <p className="text-label-sm">{label}</p>
                <p className="font-headline text-headline-sm">
                  {summary?.[value] ?? "—"}
                </p>
              </div>
            ))}
          </div>
          <details className="bg-white rounded-xl border border-outline-variant p-4">
            <summary className="font-semibold cursor-pointer">
              Availability by category and floor
            </summary>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {inventory.categories.map((category) => (
                <article
                  key={category.id}
                  className="border border-outline-variant rounded-lg p-3"
                >
                  <h2 className="font-semibold">{category.name}</h2>
                  <p className="text-body-sm">
                    {category.type === "Room" ? "Rooms" : "Beds"}
                  </p>
                  <button
                    type="button"
                    className={managementButton + " mt-2"}
                    aria-label={"Edit availability for " + category.name}
                    onClick={() =>
                      setAvailabilityEditor({
                        scope: "category",
                        id: category.id,
                        label: category.name,
                      })
                    }
                  >
                    Edit Availability
                  </button>
                  <ul className="mt-2 space-y-1 text-body-sm">
                    {(category.floors ?? []).map((floor) => (
                      <li key={String(floor.floor_number)}>
                        <strong>{floorLabel(floor.floor_number)}</strong> ·{" "}
                        {floor.available_units} of {floor.total_units} available
                        · {floor.occupied_units} occupied ·{" "}
                        {floor.reserved_units} reserved ·{" "}
                        {floor.maintenance_units} maintenance ·{" "}
                        {floor.inactive_units} inactive
                      </li>
                    ))}
                    {!category.floors?.length && (
                      <li>No inventory configured.</li>
                    )}
                  </ul>
                </article>
              ))}
            </div>
          </details>
          <nav
            className="flex flex-wrap gap-2"
            aria-label="Accommodation management"
          >
            {tabs.map((key) => (
              <button
                key={key}
                type="button"
                className={
                  managementButton +
                  (tab === key ? " bg-primary-container" : "")
                }
                aria-pressed={tab === key}
                onClick={() => {
                  setTab(key);
                  setHistoryTarget(null);
                  setBookingTarget(null);
                  setNotice("");
                }}
              >
                {sections[key]}
              </button>
            ))}
          </nav>
          {notice && (
            <p className="text-success" role="status">
              {notice}
            </p>
          )}
          <PortalDataStatus loading={loading} error={error} retry={retry} />
          {tab === "history" && historyTarget && (
            <p className="text-body-sm">
              Allocation history for {historyTarget.label}{" "}
              <button
                type="button"
                className={managementButton}
                onClick={() => setHistoryTarget(null)}
              >
                Show all history
              </button>
            </p>
          )}
          {bookingTarget &&
            (tab === "allocations" || tab === "reservations") && (
              <p className="text-body-sm">
                {sections[tab]} for {bookingTarget.label}{" "}
                <button
                  type="button"
                  className={managementButton}
                  onClick={() => setBookingTarget(null)}
                >
                  Show all {tab}
                </button>
              </p>
            )}
          <ManagementTable
            endpoint={endpoint}
            allowTileView={tab === "rooms" || tab === "beds"}
            query={query}
            key={tab}
            title={sections[tab]}
            {...config}
            add={
              tab !== "history"
                ? () => openEditor({ tab, id: null })
                : undefined
            }
          />
        </main>
      </div>
      <ManagementForm
        title={
          editor
            ? editor.tab === "allocations"
              ? editor.id
                ? "Edit or transfer allocation"
                : "Confirm resident allocation"
              : (editor.id ? "Edit " : "Add ") + sections[editor.tab]
            : null
        }
        save={save}
        updating={!!editor?.id}
        close={() => setEditor(null)}
      >
        {assetKind ? (
          <FormFields
            fields={fieldMap[assetKind]}
            values={{
              ...(existing as FormValues | undefined),
              ...(editor?.parentId
                ? editor.tab === "beds"
                  ? { dormitoryId: editor.parentId }
                  : { categoryId: editor.parentId }
                : {}),
              operationalStatus:
                existing && "operationalStatus" in existing
                  ? existing.operationalStatus
                  : existing &&
                      "maintenance" in existing &&
                      existing.maintenance
                    ? "MAINTENANCE"
                    : existing &&
                        "liveStatus" in existing &&
                        existing.liveStatus === "Inactive"
                      ? "INACTIVE"
                      : "ACTIVE",
            }}
          />
        ) : (
          editor && (
            <>
              <label>
                Resident *
                <select
                  name="residentId"
                  required
                  className={managementButton}
                  value={selectedResident}
                  onChange={(event) =>
                    setSelectedResident(event.currentTarget.value)
                  }
                >
                  <option value="">Select a resident</option>
                  {eligible
                    .filter((row) => {
                      if (editor.tab !== "allocations") return true;
                      if (editor.id) return row.id === allocation?.residentId;
                      return !currentAllocation(inventory, row.id);
                    })
                    .map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.name} · {row.number}
                      </option>
                    ))}
                </select>
              </label>
              <TargetPicker
                key={selectedResident}
                inventory={inventory}
                residentId={selectedResident}
                prior={
                  reservation?.target ?? allocation?.target ?? editor.target
                }
                reservedTarget={reservation?.target}
              />
              <FormFields
                fields={
                  editor.tab === "reservations"
                    ? [
                        {
                          ...required("start", "Reservation starts (IST)"),
                          type: "datetime-local",
                        },
                        {
                          ...required("end", "Reservation ends (IST)"),
                          type: "datetime-local",
                        },
                        {
                          ...required("reservedCapacity", "Reserved places"),
                          type: "number",
                          min: 1,
                        },
                        remarks,
                      ]
                    : [remarks]
                }
                values={{
                  ...reservationPeriod,
                  reservedCapacity: reservation?.capacity ?? 1,
                  remarks: reservation?.remarks ?? allocation?.remarks,
                }}
              />
            </>
          )
        )}
      </ManagementForm>
      <ManagementForm
        title={statusEditor ? "Change status for " + statusEditor.label : null}
        updating
        close={() => setStatusEditor(null)}
        save={async (data) => {
          if (!statusEditor) return;
          await execute(
            {
              action: "operational-status",
              kind: statusEditor.kind,
              id: statusEditor.id,
              status: formText(data, "operationalStatus"),
            },
            "Accommodation status updated.",
          );
        }}
      >
        <FormFields
          key={statusEditor?.id}
          fields={[operational]}
          values={{ operationalStatus: statusEditor?.status ?? "ACTIVE" }}
        />
      </ManagementForm>
      {availabilityEditor && (
        <AvailabilityDialog
          key={availabilityEditor.id}
          scope={availabilityEditor}
          dormitories={inventory.dormitories.filter((dormitory) =>
            availabilityEditor.scope === "dormitory"
              ? dormitory.id === availabilityEditor.id
              : dormitory.categoryId === availabilityEditor.id,
          )}
          close={() => setAvailabilityEditor(null)}
          onSaved={() => {
            setAvailabilityEditor(null);
            setNotice("Accommodation availability updated.");
          }}
          onAdd={(tab, parentId) => {
            setAvailabilityEditor(null);
            openEditor({ tab, id: null, parentId });
          }}
          onBooking={manageAvailabilityBooking}
        />
      )}
      <CategoryArchiveDialog
        category={categoryArchive}
        close={() => setCategoryArchive(null)}
        execute={execute}
      />
      <ConfirmAction
        title={confirmation?.title ?? null}
        close={() => setConfirmation(null)}
        action={async () => {
          if (confirmation)
            await execute(
              confirmation.command,
              confirmation.title + " confirmed.",
            );
        }}
      />
      <RecordDetails
        title={details?.title ?? null}
        entries={details?.entries ?? []}
        close={() => setDetails(null)}
      />
    </PortalFrame>
  );
}
