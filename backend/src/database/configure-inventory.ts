import "reflect-metadata";
import "dotenv/config";
import { Pool } from "pg";
import { audit } from "../common/api";
import type { Sql } from "./database.module";

const catalogue = [
  {
    code: "NEST",
    name: "Nest",
    legacy: "Nest Suite",
    rooms: [
      {
        number: "N-301",
        floor: 3,
      },
      {
        number: "N-302",
        floor: 3,
      },
      {
        number: "N-303",
        floor: 3,
      },
      {
        number: "N-304",
        floor: 3,
      },
      {
        number: "N-305",
        floor: 3,
      },
      {
        number: "N-306",
        floor: 3,
      },
      {
        number: "N-307",
        floor: 3,
      },
      {
        number: "N-308",
        floor: 3,
      },
      {
        number: "N-309",
        floor: 3,
      },
      {
        number: "N-310",
        floor: 3,
      },
      {
        number: "N-311",
        floor: 3,
      },
      {
        number: "N-312",
        floor: 3,
      },
      {
        number: "N-313",
        floor: 3,
      },
      {
        number: "N-314",
        floor: 3,
      },
      {
        number: "N-315",
        floor: 3,
      },
      {
        number: "N-316",
        floor: 3,
      },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRtvUG0FuIR42NgWoqFqHmu2sFLxCJPNl564CEnV03RLi7z2IGBkaRoraguIjgzUFP_UNXGDzbl2rotdMx0j1c2pZGpDFANrV4jIbJr8U0I2efB8qS0wnbkrXqE3llWCI_TONWt0jzthAQg_pA9cKjYISgKTVCp2atsMhI-NjygfeHmuu1vcT0PNRy2HVw9pGlrugYGJCsjWt6l-FYsGCoznRfbAZzflSnTlZJTQ",
    description:
      "Cozy and thoughtfully designed for peaceful, independent living with zero trip hazards and intimate privacy.",
    features: [
      "Anti-slip bath with European water closet",
      "Private scenic balcony",
      "24/7 Emergency call bell at bedside",
      "Geriatric safety grab rails installed",
    ],
  },
  {
    code: "HEAVEN",
    name: "Heaven",
    legacy: "Heaven Residence",
    rooms: [
      {
        number: "H-201",
        floor: 2,
      },
      {
        number: "H-202",
        floor: 2,
      },
      {
        number: "H-203",
        floor: 2,
      },
      {
        number: "H-204",
        floor: 2,
      },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDusRpci5ZjJ9HBFUnrfvigLODSf3UmFVaYbOE1qlecESXgrq8ZFSbJxccPlYx3SlNTsAK4UHUtCcxE7e2wxinQDXX2PD7wvCenjOzTAtVCXMXBEANzxuIliKOWqMgYPjSZSp3SDV3H8oxTAXAqZxKyrbOR9v3RkXxPOZ1Y_2mDPW0ZO2r85xpPJZov5dsFuIpoZZEze3hzUlh7oTzPt-GvzfZKjx4XR582HNyJwQ",
    description:
      "A bright, airy retreat balancing modern comforts with serene surroundings, equipped with a handy tea-making kitchenette.",
    features: [
      "Generous sit-out balcony",
      "Compact open pantry kitchenette",
      "Wheelchair-accessible bath with toilet",
      "Extra-wide hallway and doorways",
    ],
  },
  {
    code: "AURA",
    name: "Aura",
    legacy: "Aura Sanctuary",
    rooms: [
      {
        number: "A-101",
        floor: 1,
      },
      {
        number: "A-201",
        floor: 2,
      },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEQIwi3ZQTraYEA1F3-dW6Sb_LK4T8UTifOFjo4u2Gfv5tk8bniyV3fK87yiW5nwCip_CJcsZqgF7Mg5Osfv_eyHOMUgiW8brNHC8qMS-FM7L8uYOiMCqTzQP6eLHacvOdQSCxtmdLR_CDxzciBk0eDExrNrU9z0onpOfge55mSL4pfh3BXd10PDE012kJ7KHn18nqlaYJIR2MDOZQ6IcBhdnoecwZAl13-YWTZg",
    description:
      "Dedicated room separations create a truly homely atmosphere for singles or couples craving distinct living and sleeping domains.",
    features: [
      "Fully partitioned master bedroom",
      "Relaxing panoramic veranda / balcony",
      "Dedicated kitchen utility space",
      "Independent living & guest seating area",
    ],
  },
  {
    code: "VISTA",
    name: "Vista",
    legacy: "Vista Living",
    rooms: [
      {
        number: "V-101",
        floor: 1,
      },
      {
        number: "V-102",
        floor: 1,
      },
      {
        number: "V-103",
        floor: 1,
      },
      {
        number: "V-104",
        floor: 1,
      },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnjaULLJKn2ijZG7BDCFdsLFxptgdi4vmKST7bUYksvgCt_09-iaYQ__ofsmN86bmFIhP-N1GOImLtU-tgPNpf2uN-Nh6gXOenBI3pz9Yp9_mQYKC_k5HkTS3fjVoIQc-Kng7Nwy3YRyIogeRK7R6IEFxokvWyUta-9JOB8XCOFzvRCXTUgPiDcGVMesF2zu64J3jAE_0KPcoqaM7fK25vXu5bQbTlhe39IRS29g",
    description:
      "A complete and highly functional layout with beautiful open garden views and quick, step-free access to central community dining.",
    features: [
      "Spacious bedroom with garden vista",
      "Accessible en-suite bath with grab bars",
      "Expansive open kitchenette & living space",
      "Scenic shaded sit-out balcony",
    ],
  },
  {
    code: "HARMONY",
    name: "Harmony",
    legacy: "Harmony Suite",
    rooms: [
      {
        number: "HM-101",
        floor: 1,
      },
      {
        number: "HM-102",
        floor: 1,
      },
      {
        number: "HM-201",
        floor: 2,
      },
      {
        number: "HM-202",
        floor: 2,
      },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7YOv-wCW-br_k4henGWsWacrs6FLUv_2RwcN6jaGWKxPG9uHeelARLwKTolf_hgeDd4V3n-_TNL4ZHEPKMHhPNUTJoPjSD1tMfuBUJ6RawURMuUIfshSEvW2ifzEH4FU5APzDb6J0saaXRW9HOsNU-HnvFhIELOQVzDwAGqeEISSG8Pciaub8dWbwlpCAOifs6fu157iokllKdxs3U9uYlnv6RzgPaF7EGOuYmA",
    description:
      "Expansive suite living with generous proportions, dual outdoor access, and full dual bathroom facilities for visiting family.",
    features: [
      "2 Baths with senior-safe toilets",
      "2 Independent private balconies",
      "Full open kitchenette & pantry",
      "Generous living & formal dining salon",
    ],
  },
  {
    code: "GRANDE",
    name: "Grande",
    legacy: "Grande Premium Suite",
    rooms: [
      {
        number: "G-101",
        floor: 1,
      },
      {
        number: "G-102",
        floor: 1,
      },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhuvFMZrWYlUAiCBSUaeB80CMgCOsYjDeCRQ_et00AxcaGuXnOsQere4sREMr4H3mk2c6tA45FgKmDX1MrVwMXaeVAYrruXgxddQeJRjJz8XA6po9C4waVk_wUvydWQyC42fD_hNt28gDL2JiPJIoiYu_81ZDUniA6vASGEtyPq7O20dqjw9_8_a-A4i1SWIE9JpM5iqpd4dfjRdApujCsZmt0_ISlDmA6sEO3qQ",
    description:
      "Our crown jewel — the most spacious and refined offering in the home, crafted for peerless ease, dignity, and elevated living.",
    features: [
      "Expansive primary living & dining hall",
      "Open chef-ready breakfast kitchen",
      "2 Full baths with wheelchair accessibility",
      "Corner panoramic view balconies",
    ],
  },
];
const dormitory = {
  code: "DORM",
  name: "Dormitory",
  legacy: "Supported Dormitory",
};
const beds = Array.from(
  { length: 16 },
  (_, i) => "D-" + String(i + 1).padStart(2, "0"),
);

type Category = {
  id: string;
  default_capacity: number;
  accommodation_type: "ROOM" | "DORMITORY";
};
type Change = { kind: string; code: string; action: string };

async function establishCategories(sql: Sql, changes: Change[]) {
  const result = new Map<string, Category>();
  for (const definition of [
    ...catalogue,
    {
      ...dormitory,
      description: undefined,
      image: undefined,
      features: undefined,
    },
  ]) {
    const { code, name, legacy, description, image, features } = definition;
    const key = "initial-category:" + code;
    const rows = (
      await sql.query(
        "SELECT * FROM accommodation_categories WHERE inventory_key=$1 OR lower(category_code)=lower($2) FOR UPDATE",
        [key, code],
      )
    ).rows;
    if (rows.length !== 1)
      throw Error(
        `Expected one configured category for ${code}. Review its mapping and capacity before applying inventory.`,
      );
    const existing = rows[0];
    const expectedType = code === dormitory.code ? "DORMITORY" : "ROOM";
    if (
      existing.accommodation_type !== expectedType ||
      !existing.default_capacity
    )
      throw Error(
        `Category ${code} requires a matching type and configured capacity.`,
      );
    if (existing.inventory_key) {
      if (
        existing.inventory_key !== key ||
        existing.deleted_at ||
        !existing.is_active
      )
        throw Error(
          `The configured category ${code} is archived, inactive, or has a conflicting inventory key.`,
        );
      result.set(code, existing as Category);
      continue;
    }
    if (
      ![name, legacy].some(
        (label) =>
          label.toLowerCase() === String(existing.category_name).toLowerCase(),
      )
    )
      throw Error(
        `Review the existing category name for ${code} before applying its mapping.`,
      );
    if (!existing.is_active)
      throw Error(
        `Review the inactive category ${code} before applying inventory.`,
      );
    const conflict = (
      await sql.query(
        "SELECT 1 FROM accommodation_categories WHERE lower(category_name)=lower($1) AND id<>$2",
        [name, existing.id],
      )
    ).rowCount;
    if (conflict)
      throw Error(`Another category already uses the name ${name}.`);
    if (existing.deleted_at) {
      const linked = (
        await sql.query(
          "SELECT 1 FROM rooms WHERE category_id=$1 AND deleted_at IS NULL UNION ALL SELECT 1 FROM dormitories WHERE category_id=$1 AND deleted_at IS NULL",
          [existing.id],
        )
      ).rowCount;
      if (linked)
        throw Error(
          `Review archived category ${code} and its linked inventory before restoring it.`,
        );
    }
    const revised = (
      await sql.query(
        "UPDATE accommodation_categories SET category_name=$2, inventory_key=$3, deleted_at=NULL," +
          " description=coalesce(description,$4),image_url=coalesce(image_url,$5),public_features=coalesce(public_features,$6) WHERE id=$1 RETURNING *",
        [
          existing.id,
          name,
          key,
          description ?? null,
          image ?? null,
          features ?? null,
        ],
      )
    ).rows[0];
    await audit(
      sql,
      null,
      "accommodation_categories",
      existing.id,
      "UPDATE",
      existing,
      revised,
    );
    changes.push({
      kind: "category",
      code,
      action: existing.deleted_at
        ? "restore verified mapping"
        : "record verified mapping",
    });
    result.set(code, revised as Category);
  }
  return result;
}

async function configure(sql: Sql) {
  const changes: Change[] = [];
  const review: string[] = [];
  const categories = await establishCategories(sql, changes);
  const building =
    (
      await sql.query(
        "INSERT INTO buildings(building_name,building_code) VALUES('Beth Shalom','BETH-SHALOM') ON CONFLICT DO NOTHING RETURNING id",
      )
    ).rows[0] ??
    (
      await sql.query(
        "SELECT id FROM buildings WHERE lower(building_code)='beth-shalom' AND building_name='Beth Shalom' AND is_active AND deleted_at IS NULL",
      )
    ).rows[0];
  if (!building) throw Error("Review the BETH-SHALOM building mapping.");
  async function establish(
    table: "rooms" | "dormitories" | "dormitory_beds",
    numberField: "room_number" | "dormitory_number" | "bed_number",
    code: string,
    values: Record<string, string | number | null>,
    matchingFields: string[],
  ) {
    const key = "initial-unit:" + code;
    const bedScope = table === "dormitory_beds";
    const matches = (
      await sql.query(
        "SELECT * FROM " +
          table +
          " WHERE inventory_key=$1 OR (lower(" +
          numberField +
          ")=lower($2)" +
          (bedScope ? " AND dormitory_id=$3" : "") +
          ") FOR UPDATE",
        bedScope ? [key, code, values.dormitory_id] : [key, code],
      )
    ).rows;
    if (matches.length > 1) throw Error(`Conflicting ${table} number ${code}.`);
    const item = matches[0];
    if (item?.inventory_key === key) {
      if (
        item.deleted_at ||
        item[numberField] !== code ||
        matchingFields.some((field) => item[field] !== values[field])
      )
        review.push(
          `${table} ${code} has since been edited or archived and was preserved.`,
        );
      return item;
    }
    if (item) {
      if (
        item.deleted_at ||
        item.inventory_key ||
        matchingFields.some((field) => item[field] !== values[field])
      )
        throw Error(
          `Conflicting existing ${table} record for ${code}. Review it before applying inventory.`,
        );
      await sql.query("UPDATE " + table + " SET inventory_key=$2 WHERE id=$1", [
        item.id,
        key,
      ]);
      changes.push({ kind: table, code, action: "adopt matching record" });
      return item;
    }
    const record = { ...values, [numberField]: code, inventory_key: key };
    const fields = Object.keys(record);
    const created = (
      await sql.query(
        "INSERT INTO " +
          table +
          "(" +
          fields.join(",") +
          ") VALUES(" +
          fields.map((_, i) => "$" + (i + 1)).join(",") +
          ") RETURNING *",
        Object.values(record),
      )
    ).rows[0];
    await audit(sql, null, table, created.id, "CREATE", undefined, created);
    changes.push({ kind: table, code, action: "create" });
    return created;
  }
  for (const definition of catalogue) {
    const category = categories.get(definition.code)!;
    for (const room of definition.rooms)
      await establish(
        "rooms",
        "room_number",
        room.number,
        {
          category_id: category.id,
          building_id: building.id,
          floor_number: room.floor,
          capacity: category.default_capacity,
        },
        ["category_id", "building_id", "floor_number"],
      );
  }
  const dorm = await establish(
    "dormitories",
    "dormitory_number",
    "DORM-01",
    {
      category_id: categories.get("DORM")!.id,
      building_id: building.id,
      dormitory_name: "Dormitory",
      floor_number: null,
    },
    ["category_id", "building_id"],
  );
  if (dorm.deleted_at || dorm.category_id !== categories.get("DORM")!.id)
    review.push(
      "The planned dormitory was edited or archived. Its bed inventory was preserved.",
    );
  else {
    const liveBedCount = (
      await sql.query(
        "SELECT count(*)::int AS count FROM dormitory_beds WHERE dormitory_id=$1 AND deleted_at IS NULL",
        [dorm.id],
      )
    ).rows[0].count;
    const matchingBedCount = (
      await sql.query(
        "SELECT count(*)::int AS count FROM dormitory_beds WHERE dormitory_id=$1 AND deleted_at IS NULL AND (lower(bed_number)=ANY($2::text[]) OR inventory_key=ANY($3::text[]))",
        [
          dorm.id,
          beds.map((number) => number.toLowerCase()),
          beds.map((number) => "initial-unit:" + number),
        ],
      )
    ).rows[0].count;
    if (
      dorm.bed_capacity &&
      liveBedCount - matchingBedCount + beds.length > dorm.bed_capacity
    )
      throw Error(
        "The configured dormitory bed limit conflicts with the requested inventory.",
      );
    for (const number of beds)
      await establish(
        "dormitory_beds",
        "bed_number",
        number,
        { dormitory_id: dorm.id },
        ["dormitory_id"],
      );
  }
  const extra = await sql.query(
    "SELECT 'rooms' AS kind,room_number AS number FROM rooms WHERE inventory_key IS NULL AND deleted_at IS NULL " +
      "UNION ALL SELECT 'dormitories',dormitory_number FROM dormitories WHERE inventory_key IS NULL AND deleted_at IS NULL " +
      "UNION ALL SELECT 'beds',bed_number FROM dormitory_beds WHERE inventory_key IS NULL AND deleted_at IS NULL ORDER BY kind,number",
  );
  console.log(
    JSON.stringify(
      {
        changes,
        review,
        additionalInventory: extra.rows,
        capacitySettings: catalogue.map(({ code }) => ({
          code,
          capacity: categories.get(code)!.default_capacity,
        })),
        dormitoryFloor: dorm.floor_number,
        dormitoryMedia:
          "Confirm an approved dormitory image and description if none is configured.",
      },
      null,
      2,
    ),
  );
}

async function main() {
  const connection = new URL(process.env.DATABASE_URL ?? "");
  if (
    !["127.0.0.1", "localhost", "[::1]"].includes(connection.hostname) ||
    process.env.NODE_ENV === "production"
  )
    throw Error(
      "Inventory reconciliation is enabled only for local development databases.",
    );
  const pool = new Pool({ connectionString: connection.href });
  try {
    const sql = await pool.connect();
    try {
      await sql.query("BEGIN");
      await sql.query("SELECT pg_advisory_xact_lock(727091, 5)");
      await configure(sql);
      const apply = process.argv.includes("--apply");
      await sql.query(apply ? "COMMIT" : "ROLLBACK");
      console.log(
        apply
          ? "Inventory reconciliation applied."
          : "Inventory preview completed. No changes committed.",
      );
    } catch (error) {
      await sql.query("ROLLBACK");
      throw error;
    } finally {
      sql.release();
    }
  } finally {
    await pool.end();
  }
}
void main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Inventory reconciliation failed.",
  );
  process.exitCode = 1;
});
