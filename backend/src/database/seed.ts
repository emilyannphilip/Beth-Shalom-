import "reflect-metadata";
import "dotenv/config";
import { Pool } from "pg";
import { hashPassword } from "../auth/passwords";

const isLoopback = (host:string) => ["127.0.0.1","localhost","::1"].includes(host);

const permissions = {
  "staff.manage": "staff",
  "enquiries.read": "enquiries",
  "enquiries.manage": "enquiries",
  "enquiries.followup": "enquiries",
  "residents.read": "residents",
  "residents.manage": "residents",
  "housing.manage": "housing",
  "allocations.history": "housing",
  "dashboard.read": "dashboard",
  "audit.read": "audit",
};
const staffPermissions = [
  "enquiries.read",
  "enquiries.manage",
  "enquiries.followup",
  "residents.read",
  "residents.manage",
  "housing.manage",
  "allocations.history",
  "dashboard.read",
];
const categories = [
  "Senior Admission & Room Tour",
  "Differently-Abled Support Living",
  "Detailed Suite & Floor Plan Inspection",
  "Facilities",
  "General Institutional Walkthrough",
];
const lodging = [
  ["NEST", "Nest Suite", "ROOM", 1],
  ["HEAVEN", "Heaven Residence", "ROOM", 1],
  ["AURA", "Aura Sanctuary", "ROOM", 1],
  ["VISTA", "Vista Living", "ROOM", 2],
  ["HARMONY", "Harmony Suite", "ROOM", 2],
  ["GRANDE", "Grande Premium Suite", "ROOM", 2],
  ["DORM", "Supported Dormitory", "DORMITORY", 1],
];

async function run() {
  const connection = new URL(process.env.DATABASE_URL ?? "");
  if (
    !isLoopback(connection.hostname.replace(/^\[|\]$/g, "")) ||
    process.env.DEV_SEED_ENABLED !== "true" ||
    process.env.NODE_ENV === "production"
  ) {
    throw new Error("Seed data requires explicitly enabled local development.");
  }
  const accounts = [];
  for (const role of ["ADMIN", "STAFF"] as const) {
    const username = process.env["DEV_" + role + "_USERNAME"];
    const email = process.env["DEV_" + role + "_EMAIL"];
    const password = process.env["DEV_" + role + "_PASSWORD"];
    if (!username && !email && !password) continue;
    if (!username || !email || !password || password.length < 12)
      throw new Error(
        "Supply the development username, email and a password of at least 12 characters.",
      );
    accounts.push({
      role,
      username,
      email,
      hash: await hashPassword(password),
    });
  }
  const pool = new Pool({
    connectionString: connection.toString(),
    connectionTimeoutMillis: 3000,
  });
  try {
    const sql = await pool.connect();
    try {
      await sql.query("BEGIN");
      await sql.query("SELECT pg_advisory_xact_lock(727091, 5)");
      await sql.query(
        "INSERT INTO roles(name,description) VALUES('ADMIN','Administrator'),('STAFF','Staff member') ON CONFLICT(name) DO NOTHING",
      );
      for (const [code, module] of Object.entries(permissions)) {
        await sql.query(
          "INSERT INTO permissions(code,module) VALUES($1,$2) ON CONFLICT(code) DO NOTHING",
          [code, module],
        );
      }
      await sql.query(
        "INSERT INTO role_permissions SELECT r.id,p.id FROM roles r CROSS JOIN permissions p " +
          "WHERE (r.name='ADMIN' AND p.code=ANY($2::text[])) OR (r.name='STAFF' AND p.code=ANY($1::text[])) ON CONFLICT DO NOTHING",
        [staffPermissions, Object.keys(permissions)],
      );
      for (const name of categories)
        await sql.query(
          "INSERT INTO enquiry_categories(name,public_topic) VALUES($1,$1) ON CONFLICT DO NOTHING",
          [name],
        );
      for (const row of lodging)
        await sql.query(
          "INSERT INTO accommodation_categories(category_code,category_name,accommodation_type,default_capacity) " +
            "VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
          row,
        );
      for (const account of accounts) {
        await sql.query(
          "INSERT INTO users(full_name,username,email,password_hash,designation,role_id) " +
            "SELECT $1,$2,$3,$4,$5,id FROM roles WHERE name=$6 ON CONFLICT DO NOTHING",
          [
            "Sample " + account.role,
            account.username,
            account.email,
            account.hash,
            account.role,
            account.role,
          ],
        );
      }
      const admin = accounts.find((account) => account.role === "ADMIN");
      if (admin && process.env.DEV_SEED_SAMPLE_DATA === "true") {
        const selectedAdmin = (
          await sql.query(
            "SELECT u.id FROM users u JOIN roles r ON r.id=u.role_id WHERE lower(u.username)=lower($1) AND r.name='ADMIN' AND u.status='ACTIVE' AND u.deleted_at IS NULL",
            [admin.username],
          )
        ).rows[0];
        if (!selectedAdmin)
          throw new Error(
            "A matching active sample administrator is required.",
          );
        const adminId = selectedAdmin.id;
        await sql.query(
          "INSERT INTO enquiries(enquiry_number,category_id,source_form,original_topic,applicant_name,phone,created_by) " +
            "SELECT 'ENQ-DEMO-1',id,'PORTAL','Sample admissions question','Sample Applicant','5550100100',$1 " +
            "FROM enquiry_categories WHERE public_topic=$2 ON CONFLICT DO NOTHING",
          [adminId, categories[0]],
        );
        await sql.query(
          "INSERT INTO residents(resident_number,full_name,date_of_birth,admission_date,staff_visible,created_by) " +
            "VALUES('RES-DEMO-1','Sample Resident One','1950-01-01',CURRENT_DATE,true,$1)," +
            "('RES-DEMO-2','Sample Resident Two','1952-01-01',CURRENT_DATE,false,$1) ON CONFLICT DO NOTHING",
          [adminId],
        );
      }
      await sql.query("COMMIT");
    } catch (error) {
      await sql.query("ROLLBACK");
      throw error;
    } finally {
      sql.release();
    }
    console.log("Beth Shalom development seed complete.");
  } finally {
    await pool.end();
  }
}

run().catch((error: unknown) => {
  console.error(
    "Development seed failed. Check database connectivity, migrations, and local seed configuration.",
  );
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  )
    console.error("Database error code:", error.code);
  process.exitCode = 1;
});
