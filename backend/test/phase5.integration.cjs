const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { once } = require("node:events");
const { join } = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");
const { test } = require("node:test");
const { Pool } = require("pg");

const url = process.env.DATABASE_URL;
test(
  "Phase 5 API against isolated PostgreSQL",
  {
    skip:
      !url &&
      "Set DATABASE_URL for a migrated and seeded copy of beth_shalom_test",
  },
  async (t) => {
    const database = new URL(url);
    assert.equal(database.pathname, "/beth_shalom_test");
    assert(["127.0.0.1", "localhost", "[::1]"].includes(database.hostname));
    const pool = new Pool({ connectionString: url });
    t.after(() => pool.end());
    const accessTokens = new Map();
    let output = "";
    const port = process.env.TEST_API_PORT ?? "33051";
    const app = spawn(process.execPath, [join(__dirname, "../dist/main.js")], {
      env: {
        ...process.env,
        NODE_ENV: "test",
        HOST: "127.0.0.1",
        PORT: port,
        AUTH_ACCESS_SECRET: randomUUID()+randomUUID(),
        AUTH_REFRESH_SECRET: randomUUID()+randomUUID(),
        SMTP_HOST: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    t.after(async () => {
      if (app.exitCode === null && !app.signalCode) {
        const exited = once(app, "exit");
        app.kill();
        await exited;
      }
    });
    app.stdout.on("data", (chunk) => {
      output += String(chunk);
    });
    app.stderr.on("data", (chunk) => {
      output += String(chunk);
    });
    const origin = "http://127.0.0.1:" + port;
    for (let retry = 0; retry < 240; retry++) {
      if (app.exitCode !== null) assert.fail(output);
      let response;
      try {
        response = await fetch(origin + "/api/v1/health/database");
      } catch {
        /* Starting. */
      }
      if (response?.ok) break;
      if (retry === 239) assert.fail("Backend did not become ready: " + output);
      await delay(250);
    }

    const actorRows = (
      await pool.query(
        "SELECT u.id,r.name FROM users u JOIN roles r ON r.id=u.role_id WHERE u.username IN ($1,$2) AND u.status='ACTIVE' AND u.deleted_at IS NULL",
        [process.env.DEV_ADMIN_USERNAME, process.env.DEV_STAFF_USERNAME],
      )
    ).rows;
    const admin = actorRows.find((row) => row.name === "ADMIN")?.id;
    const staff = actorRows.find((row) => row.name === "STAFF")?.id;
    assert(
      admin && staff,
      "Seed one development Admin and one Staff account first",
    );
    const key = randomUUID().slice(0, 8);
    const base = origin + "/api/v1";
    for (const role of ["ADMIN","STAFF"]) {
      const username=process.env["DEV_"+role+"_USERNAME"];
      const password=process.env["TEST_"+role+"_PASSWORD"];
      assert(username&&password,"Supply credentials for the isolated test accounts.");
      const response=await fetch(base+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})});
      assert.equal(response.status,200);
      const session=await response.json();
      accessTokens.set(session.actor.id,session.accessToken);
    }
    async function request(method, path, actor, body, status = 200) {
      const headers = actor
        ? { Authorization: "Bearer " + accessTokens.get(actor) }
        : {};
      if (body !== undefined) headers["content-type"] = "application/json";
      const response = await fetch(base + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const result = await response.json();
      if (status !== null)
        assert.equal(
          response.status,
          status,
          method + " " + path + " " + JSON.stringify(result),
        );
      return status === null ? { status: response.status, result } : result;
    }
    const get = (path, actor, status = 200) =>
      request("GET", path, actor, undefined, status);
    const post = (path, actor, body, status = 201) =>
      request("POST", path, actor, body, status);
    const patch = (path, actor, body, status = 200) =>
      request("PATCH", path, actor, body, status);
    const remove = (path, actor, status = 200) =>
      request("DELETE", path, actor, undefined, status);

    await t.test(
      "database constraints, request validation and Swagger",
      async () => {
        const schema = (
          await pool.query(
            "SELECT count(*) FILTER(WHERE table_type='BASE TABLE' AND table_name<>'pgmigrations')::int AS tables, count(*) FILTER(WHERE table_type='VIEW')::int AS views FROM information_schema.tables WHERE table_schema='public'",
          )
        ).rows[0];
        assert.deepEqual(schema, { tables: 23, views: 7 });
        assert.equal((await fetch(origin + "/api/docs-json")).status, 200);
        const swagger = await (await fetch(origin + "/api/docs-json")).json();
        assert(swagger.paths["/api/v1/allocations/{id}/transfer"]);
        await get("/rooms", undefined, 401);
        await get("/rooms?limit=101", staff, 400);
        await get("/rooms?sortBy=unknown", staff, 400);
        await get("/rooms/invalid", admin, 400);
        await get("/staff", staff, 403);
        await get("/audit-logs", staff, 403);
        await assert.rejects(
          pool.query(
            "INSERT INTO resident_contacts(resident_id,contact_name,contact_type) VALUES(gen_random_uuid(),'sample','OTHER')",
          ),
          { code: "23503" },
        );
      },
    );

    await t.test("role mappings and staff CRUD", async () => {
      const roles = await get("/roles", admin);
      const staffRole = roles.find((row) => row.name === "STAFF").id;
      const mappings = await get("/roles/" + staffRole + "/permissions", admin);
      const granted = new Set(mappings.map((row) => row.code));
      for (const code of ["housing.manage", "enquiries.manage", "residents.manage"])
        assert(granted.has(code));
      for (const code of ["staff.manage", "audit.read"]) assert(!granted.has(code));
      const otherAdmins = await pool.query(
        "SELECT 1 FROM users u JOIN roles r ON r.id=u.role_id WHERE r.name='ADMIN' AND u.status='ACTIVE' AND u.deleted_at IS NULL AND u.id<>$1",
        [admin],
      );
      if (!otherAdmins.rowCount)
        await post("/staff/" + admin + "/deactivate", admin, {}, 409);
      await get("/roles", staff, 403);
      await get("/permissions", staff, 403);
      await post("/staff/" + admin + "/password-reset", staff, {}, 403);
      await patch("/staff/" + admin, staff, { phone: "5551234567" }, 403);
      const identity = {
        full_name: "Sample Staff " + key,
        username: "sample." + key,
        email: key + "@example.test",
        password: "Synthetic-Password-2026!",
        role_id: staffRole,
      };
      const created = await post("/staff", admin, identity);
      assert(!("password_hash" in created));
      await post(
        "/staff",
        admin,
        { ...identity, username: identity.username.toUpperCase() },
        409,
      );
      await patch("/staff/" + created.id, admin, { phone: "5551234567" });
      const page = await get("/staff?limit=1&search=" + key, admin);
      assert.equal(page.total, 1);
      assert.equal(page.data[0].id, created.id);
      await post("/staff/" + created.id + "/deactivate", admin, {});
      await post("/staff/" + created.id + "/activate", admin, {});
      await remove("/staff/" + created.id, admin);
    });

    let enquiry;
    await t.test(
      "public intake, enquiries, categories and visit requests",
      async () => {
        const categories = await get("/public/enquiry-categories");
        assert(categories.length >= 5);
        const c = categories[0];
        const common = {
          category_id: c.id,
          applicant_name: "Sample Applicant " + key,
          phone: "+91 98765 43210",
          original_topic: "Sample specific topic",
        };
        await post(
          "/public/enquiries",
          undefined,
          { ...common, source_form: "WELCOME_ENQUIRY", unexpected: true },
          400,
        );
        await post(
          "/public/enquiries",
          undefined,
          { ...common, source_form: "ADMISSION_ENQUIRY" },
          400,
        );
        for (const source of [
          "WELCOME_ENQUIRY",
          "ROOM_APPLICATION",
          "HARMONY_SUITE_APPLICATION",
          "FACILITIES_ENQUIRY",
          "ADMISSION_ENQUIRY",
          "CAMPUS_WALKTHROUGH",
          "CONTACT_ENQUIRY",
        ]) {
          const receipt = await post("/public/enquiries", undefined, {
            ...common,
            source_form: source,
            details: {
              contact_consent: true,
              applicant_relationship: "Family",
              age: 68,
            },
            ...(source.endsWith("WALKTHROUGH") || source === "CONTACT_ENQUIRY"
              ? {
                  visit: {
                    preferred_date: "2030-05-07",
                    preferred_time: "12:30",
                    visitor_count: 2,
                  },
                }
              : {}),
          });
          assert.deepEqual(Object.keys(receipt).sort(), [
            "enquiry_number",
            "id",
            "status",
          ]);
          const detail = await get("/enquiries/" + receipt.id, staff);
          assert.equal(detail.source_form, source);
          assert.equal(detail.original_topic, common.original_topic);
          assert.equal(detail.details.applicant_relationship, "Family");
          enquiry = receipt.id;
        }
        const listing = await get(
          "/enquiries?limit=2&page=2&search=" +
            key +
            "&sortBy=enquiry_number&sortOrder=asc",
          staff,
        );
        assert.equal(listing.data.length, 2);
        assert.equal(listing.total, 7);
        assert(listing.hasNext && listing.hasPrevious);
        await patch("/enquiries/" + enquiry, staff, { assigned_user_id: staff });
        await patch("/enquiries/" + enquiry, admin, { assigned_user_id: admin });
        assert.equal((await get("/enquiries/" + enquiry, staff)).assigned_user_id, admin);
        await post("/enquiries/" + enquiry + "/followups", staff, {
          status: "PENDING",
          remarks: "Sample follow-up",
        });
        const visit = await post("/visit-requests", admin, {
          enquiry_id: enquiry,
          preferred_date: "2030-05-07",
          preferred_time_slot: "Morning",
        });
        await patch("/visit-requests/" + visit.id, admin, {
          status: "CONFIRMED",
        });
        await remove("/visit-requests/" + visit.id, admin);
        const category = await post("/enquiry-categories", admin, {
          name: "Extra QA " + key,
        });
        await patch("/enquiry-categories/" + category.id, admin, {
          description: "Test",
        });
        const manual = await post("/enquiries", admin, {
          ...common,
          category_id: category.id,
        });
        await remove("/enquiries/" + manual.id, admin);
        await remove("/enquiry-categories/" + category.id, admin);
      },
    );

    await t.test("shared enquiry and resident management preserves authorization and history", async () => {
      for (const [actor, other] of [[admin, staff], [staff, admin]]) {
        const suffix = key + "-" + actor.slice(0, 8);
        const directory = await get("/enquiries/assignees", actor);
        assert(directory.some((row) => row.id === other));
        assert(directory.every((row) => Object.keys(row).sort().join(",") === "id,name"));
        const category = await post("/enquiry-categories", actor, { name: "Permissions " + suffix });
        await patch("/enquiry-categories/" + category.id, other, { description: "Shared description" });
        const enquiry = await post("/enquiries", actor, {
          category_id: category.id,
          applicant_name: "Applicant " + suffix,
          phone: "5551234567",
          assigned_user_id: other,
          status: "PENDING",
          followup_remarks: "Initial remarks",
          visit: { preferred_date: "2030-05-07" },
        });
        const path = "/enquiries/" + enquiry.id;
        const detail = await get(path, other);
        assert.equal(detail.assigned_user_id, other);
        assert.equal(detail.followups[0].remarks, "Initial remarks");
        await patch(path, other, {
          version: detail.version,
          assigned_user_id: actor,
          status: "IN_PROGRESS",
          message: "Shared edit",
          visit_id: detail.visits[0].id,
          visit: { preferred_date: "2030-05-08" },
        });
        const filtered = await get("/enquiries?search="+suffix+"&categoryId="+category.id+"&status=IN_PROGRESS&sortBy=applicant_name&limit=1", actor);
        assert.equal(filtered.data[0].id, enquiry.id);
        assert.equal((await get(path, actor)).assigned_user_id, actor);
        await remove(path, other);
        await get(path, actor, 404);
        await remove("/enquiry-categories/" + category.id, actor);
        assert(!(await get("/public/enquiry-categories")).some((row) => row.id === category.id));

        const resident = await post("/residents", actor, {
          full_name: "Resident " + suffix,
          date_of_birth: "1950-01-01",
          admission_date: "2025-01-01",
          guardian_contact: { contact_type: "GUARDIAN", contact_name: "Test guardian" },
          care: { allergies: "Fictional allergy" },
        });
        const profilePath = "/residents/" + resident.id;
        const profile = await get(profilePath, other);
        assert.equal(profile.contacts[0].contact_name, "Test guardian");
        assert.equal(profile.care.allergies, "Fictional allergy");
        const emergency = await post(profilePath + "/contacts", other, {
          contact_type: "EMERGENCY", contact_name: "Fictional emergency contact",
        });
        await patch(profilePath + "/contacts/" + emergency.id, actor, { phone: "5551234570" });
        await patch(profilePath, other, { address: "Fixture address", care: { medical_conditions: "Fictional condition" } });
        const updated = await get(profilePath, actor);
        assert.equal(updated.care.medical_conditions, "Fictional condition");
        assert.equal(updated.contacts.find((row) => row.id === emergency.id).phone, "5551234570");
        assert.equal((await get("/residents?search="+suffix+"&status=ADMITTED&sortBy=full_name&limit=1", other)).data[0].id, resident.id);
        await post(profilePath + "/discharge", actor, { discharge_date: "2025-05-01" });
        assert((await get(profilePath + "/history", other)).data.some((row) => row.action === "DISCHARGE"));
        await remove(profilePath, other);
        await get(profilePath, actor, 404);
        const audit = await pool.query(
          "SELECT module_name,action,user_id FROM audit_logs WHERE record_id=ANY($1::uuid[])",
          [[enquiry.id, resident.id]],
        );
        assert(audit.rows.some((row) => row.action === "CREATE" && row.user_id === actor));
        assert(audit.rows.some((row) => row.action === "ARCHIVE" && row.user_id === other));
      }
    });

    await t.test(
      "private profiles, housing CRUD, concurrent reservations and allocations, transfers and discharge",
      async () => {
        const category = await post("/accommodation-categories", staff, {
          category_name: "Sample Room " + key,
          category_code: "R-" + key,
          accommodation_type: "ROOM",
          default_capacity: 2,
        });
        const dormCategory = await post("/accommodation-categories", admin, {
          category_name: "Sample Dorm " + key,
          category_code: "D-" + key,
          accommodation_type: "DORMITORY",
          default_capacity: 2,
        });
        const building = await post("/buildings", staff, {
          building_name: "Sample " + key,
          building_code: key,
        });
        const room = await post("/rooms", staff, {
          room_number: "R-" + key,
          category_id: category.id,
          building_id: building.id,
          capacity: 2,
        });
        const dorm = await post("/dormitories", staff, {
          dormitory_name: "Dorm " + key,
          dormitory_number: "D-" + key,
          category_id: dormCategory.id,
          building_id: building.id,
          bed_capacity: 2,
        });
        const bed = await post("/beds", staff, {
          dormitory_id: dorm.id,
          bed_number: "01",
        });
        const secondBed = await post("/beds", staff, {
          dormitory_id: dorm.id,
          bed_number: "02",
        });
        await post(
          "/beds",
          staff,
          { dormitory_id: dorm.id, bed_number: "03" },
          409,
        );
        const input = {
          full_name: "Sample Resident " + key,
          date_of_birth: "1950-04-01",
          admission_date: "2025-01-01",
        };
        const first = await post("/residents", admin, {
          ...input,
          staff_visible: true,
          accommodation: { room_id: room.id },
        });
        const second = await post("/residents", admin, input);
        const third = await post("/residents", admin, input);
        await post("/residents/" + first.id + "/contacts", admin, {
          contact_name: "Sample Contact",
          contact_type: "GUARDIAN",
        });
        await request("PUT", "/residents/" + first.id + "/care", admin, {
          medical_conditions: "Synthetic note",
          care_requirements: "Sample assistance",
        });
        assert.equal((await get("/residents/" + second.id, staff)).id, second.id);
        const visible = await get("/residents/" + first.id, staff);
        assert.equal(visible.care.medical_conditions, "Synthetic note");
        assert.equal(visible.contacts[0].contact_type, "GUARDIAN");
        await patch("/residents/" + first.id, staff, { remarks: "Reviewed by Staff" });
        assert.equal((await get("/residents/" + first.id, admin)).remarks, "Reviewed by Staff");
        const bookings = await Promise.all(
          [second, third].map((person) =>
            post(
              "/allocations",
              staff,
              { resident_id: person.id, room_id: room.id },
              null,
            ),
          ),
        );
        assert.deepEqual(bookings.map((b) => b.status).sort(), [201, 409]);
        const winner = bookings.find((b) => b.status === 201).result;
        const loser = [second, third].find(
          (person) => person.id !== winner.resident_id,
        );
        await post(
          "/allocations",
          staff,
          { resident_id: winner.resident_id, bed_id: bed.id },
          409,
        );
        await remove("/rooms/" + room.id, staff, 409);
        await remove("/accommodation-categories/" + category.id, staff, 409);
        await patch("/rooms/" + room.id, staff, { capacity: 1 }, 409);
        const period = {
          reservation_start: new Date(Date.now() - 60_000).toISOString(),
          reservation_end: new Date(Date.now() + 3_600_000).toISOString(),
        };
        const holds = await Promise.all(
          [first, loser].map((person) =>
            post("/reservations", staff, {
              ...period,
              resident_id: person.id,
              bed_id: bed.id,
            }),
          ),
        );
        const confirmations = await Promise.all(
          holds.map((hold) =>
            post("/reservations/" + hold.id + "/confirm", staff, {}, null),
          ),
        );
        assert.deepEqual(
          confirmations.map((result) => result.status).sort(),
          [201, 409],
        );
        const confirmed = confirmations.find(
          (item) => item.status === 201,
        ).result;
        await remove("/beds/" + bed.id, staff, 409);
        await post("/reservations/" + confirmed.id + "/cancel", staff, {});
        const moved = await post(
          "/allocations/" + winner.id + "/transfer",
          staff,
          { bed_id: bed.id },
        );
        await patch("/allocations/" + moved.id, staff, {
          remarks: "Synthetic transfer checked",
        });
        await patch("/residents/" + winner.resident_id, admin, {
          admission_status: "HOSPITALIZED",
        });
        assert.equal(
          (await get("/allocations/" + moved.id, staff)).status,
          "ACTIVE",
        );
        await post("/residents/" + winner.resident_id + "/discharge", admin, {
          discharge_date: "2025-06-01",
        });
        assert.equal(
          (await get("/allocations/" + moved.id, staff)).status,
          "RELEASED",
        );
        const convertible = await post("/reservations", staff, {
          ...period,
          resident_id: loser.id,
          bed_id: secondBed.id,
        });
        await post("/reservations/" + convertible.id + "/confirm", staff, {});
        const conversion = await post(
          "/reservations/" + convertible.id + "/convert",
          staff,
          {},
        );
        assert.equal(conversion.status, "CONVERTED");
        await post(
          "/allocations/" + conversion.converted_allocation_id + "/release",
          staff,
          {},
        );
        await patch("/beds/" + secondBed.id, staff, {
          operational_status: "MAINTENANCE",
        });
        const availability = await get("/public/availability");
        const stats = availability.find(
          (row) => row.category_id === category.id,
        );
        assert.equal(stats.available_rooms, 0);
        assert.equal(stats.free_room_spaces, 1);
        assert.equal(
          availability.find((row) => row.category_id === dormCategory.id)
            .maintenance_beds,
          1,
        );
        assert(!JSON.stringify(availability).includes(input.full_name));
        const history = await get(
          "/allocations/history?search=TRANSFER",
          staff,
        );
        assert(history.data.some((row) => row.action === "TRANSFER"));
        const staffDashboard = await get("/dashboard/summary", staff);
        assert(!("total_staff" in staffDashboard));
        assert("total_staff" in (await get("/dashboard/summary", admin)));
        const entries = await get("/audit-logs?sortBy=created_at", admin);
        assert(!JSON.stringify(entries).includes("password_hash"));
        assert(!JSON.stringify(entries).includes("Synthetic note"));
        await remove("/residents/" + first.id, admin);
        for (const hold of holds) {
          if (hold.id !== confirmed.id)
            await remove("/reservations/" + hold.id, staff);
        }
        await remove("/beds/" + bed.id, staff);
        await remove("/beds/" + secondBed.id, staff);
        await remove("/dormitories/" + dorm.id, staff);
        await remove("/rooms/" + room.id, staff);
        await remove("/buildings/" + building.id, staff);
        await remove("/accommodation-categories/" + category.id, staff);
      },
    );
    await t.test("category archive, transactional reassignment and preserved booking history", async () => {
      const basePath = "/accommodation-categories";
      const category = (code, type = "ROOM") => post(basePath, staff, {
        category_code: code + key,
        category_name: code + " " + key,
        accommodation_type: type,
        default_capacity: 2,
      });
      const src = await category("SOURCE");
      const dst = await category("DEST");
      const unused = await category("UNUSED");
      const dormSrc = await category("DORM-SRC", "DORMITORY");
      const dormDst = await category("DORM-DST", "DORMITORY");
      const inactive = await category("INACTIVE");
      const path = basePath + "/" + src.id;
      assert.equal((await remove(basePath + "/" + unused.id, staff)).id, unused.id);
      await get(basePath + "/" + unused.id, admin, 404);
      await patch(basePath + "/" + inactive.id, admin, { is_active: false });
      const building = await post("/buildings", admin, {
        building_code: "CAT-" + key,
        building_name: "Synthetic archive building " + key,
      });
      const room = (label) => post("/rooms", staff, {
        room_number: label + "-" + key,
        capacity: 2,
        category_id: src.id,
        building_id: building.id,
      });
      const idle = await room("IDLE");
      const occupied = await room("OCCUPIED");
      const held = await room("HELD");
      const resident = await post("/residents", admin, {
        full_name: "Synthetic category regression",
        date_of_birth: "1950-01-01",
        admission_date: "2025-01-01",
      });
      const allocation = await post("/allocations", staff, { resident_id: resident.id, room_id: occupied.id });
      const period = {
        reservation_start: new Date(Date.now() + 60000).toISOString(),
        reservation_end: new Date(Date.now() + 3600000).toISOString(),
      };
      const enquiryCategory = (await get("/public/enquiry-categories"))[0];
      const enquiry = await post("/public/enquiries", undefined, {
        category_id: enquiryCategory.id,
        applicant_name: "Synthetic accommodation preference",
        original_topic: "Synthetic prior category preference",
        phone: "+91 98765 43210",
        source_form: "WELCOME_ENQUIRY",
        details: { accommodation_category_id: src.id },
      });
      const reservation = await post("/reservations", staff, { ...period, room_id: held.id, enquiry_id: enquiry.id });
      const deps = await get(path + "/dependencies", staff);
      assert.equal(deps.room_count, 3);
      assert.equal(deps.dormitory_count, 0);
      assert.equal(deps.inventory.find((unit) => unit.id === occupied.id).active_allocations, 1);
      assert.equal(deps.inventory.find((unit) => unit.id === held.id).active_reservations, 1);
      assert(deps.compatible_categories.some((option) => option.id === dst.id));
      assert(!deps.compatible_categories.some((option) => [src.id, dormDst.id, inactive.id].includes(option.id)));
      const conflict = await remove(path, staff, 409);
      assert.match(conflict.message, /Unable to delete this accommodation category/);
      await patch(path, admin, { is_active: false }, 409);
      await remove("/enquiries/" + enquiry.id, admin, 409);
      const move = (actor, ids, destination = dst.id, expected = 201) =>
        post(path + "/reassign", actor, { inventory_ids: ids, destination_category_id: destination }, expected);
      await move(staff, [idle.id, occupied.id], dst.id, 409);
      await move(admin, [idle.id, held.id], dst.id, 409);
      await move(admin, [idle.id], dormDst.id, 409);
      await move(staff, [idle.id], inactive.id, 409);
      await move(staff, [idle.id], src.id, 409);
      await patch("/rooms/" + occupied.id, staff, { category_id: dst.id }, 409);
      assert.equal((await get("/rooms/" + idle.id, staff)).category_id, src.id);
      assert.equal((await move(staff, [idle.id])).reassigned, 1);
      assert.equal((await get("/public/availability")).find((row) => row.category_id === dst.id).total_rooms, 1);

      await post("/allocations/" + allocation.id + "/release", staff, {});
      await post("/reservations/" + reservation.id + "/confirm", admin, {});
      await move(admin, [held.id], dst.id, 409);
      await remove("/reservations/" + reservation.id, staff);
      await patch(path, staff, { is_active: false });
      assert(!(await get("/public/availability")).some((row) => row.category_id === src.id));
      await remove(path, admin, 409);
      assert.equal((await move(admin, [occupied.id, held.id])).reassigned, 2);
      assert.equal((await get(path + "/dependencies", admin)).room_count, 0);
      await remove(path, staff);
      assert.equal((await get("/allocations/" + allocation.id, staff)).room_id, occupied.id);
      assert.equal((await get("/reservations/" + reservation.id, staff)).room_id, held.id);
      const saved = await pool.query(
        "SELECT d.accommodation_category_id, (SELECT count(*)::int FROM allocation_history WHERE allocation_id=$2) AS history_count FROM enquiry_details d WHERE d.enquiry_id=$1",
        [enquiry.id, allocation.id],
      );
      assert.equal(saved.rows[0].accommodation_category_id, src.id);
      assert(saved.rows[0].history_count > 0);
      assert.equal((await get("/public/availability")).find((row) => row.category_id === dst.id).total_rooms, 3);
      await remove("/rooms/" + occupied.id, staff);
      const historical = await get("/allocations/history?search=" + resident.resident_number, staff);
      assert(historical.data.some((row) => row.new_room_number === occupied.room_number));

      const dorm = await post("/dormitories", staff, {
        dormitory_name: "Synthetic dormitory reassignment",
        dormitory_number: "D-MOVE-" + key,
        category_id: dormSrc.id,
        building_id: building.id,
        bed_capacity: 2,
      });
      const bed = await post("/beds", admin, { dormitory_id: dorm.id, bed_number: "01" });
      const bedHold = await post("/reservations", staff, { ...period, bed_id: bed.id, resident_id: resident.id });
      const dormPath = basePath + "/" + dormSrc.id;
      const body = { inventory_ids: [dorm.id], destination_category_id: dormDst.id };
      assert.equal((await get(dormPath + "/dependencies", admin)).inventory[0].active_reservations, 1);
      await post(dormPath + "/reassign", staff, body, 409);
      await patch("/dormitories/" + dorm.id, admin, { category_id: dormDst.id }, 409);
      await remove("/dormitories/" + dorm.id, staff, 409);
      await remove("/beds/" + bed.id, admin, 409);
      await remove("/reservations/" + bedHold.id, staff);
      await post(dormPath + "/reassign", admin, body);
      assert.equal((await get("/beds/" + bed.id, staff)).dormitory_id, dorm.id);
      assert.equal((await get("/reservations/" + bedHold.id, staff)).bed_id, bed.id);
      assert.equal((await get("/public/availability")).find((row) => row.category_id === dormDst.id).total_beds, 1);
      await remove(dormPath, staff);
    });


    await t.test("availability updates use named inventory, preserve bookings, and audit both roles", async () => {
      const category = await post("/accommodation-categories", admin, {
        category_name: "Availability rooms " + key,
        category_code: "AV-R-" + key,
        accommodation_type: "ROOM",
        default_capacity: 2,
      });
      const dormitoryCategory = await post("/accommodation-categories", admin, {
        category_name: "Availability beds " + key,
        category_code: "AV-B-" + key,
        accommodation_type: "DORMITORY",
        default_capacity: 1,
      });
      const building = await post("/buildings", staff, {
        building_name: "Availability building " + key,
        building_code: "AV-" + key,
      });
      const room = (name) => post("/rooms", staff, {
        room_number: name + "-" + key,
        category_id: category.id,
        building_id: building.id,
        capacity: 2,
        floor_number: 1,
      });
      const idle = await room("AV-IDLE");
      const residentRoom = await room("AV-OCC");
      const held = await room("AV-HELD");
      const dormitory = await post("/dormitories", staff, {
        dormitory_name: "Availability dormitory " + key,
        dormitory_number: "AV-D-" + key,
        category_id: dormitoryCategory.id,
        building_id: building.id,
      });
      const bed = await post("/beds", admin, { dormitory_id: dormitory.id, bed_number: "01" });
      const unusedBed = await post("/beds", staff, { dormitory_id: dormitory.id, bed_number: "02" });
      const resident = await post("/residents", admin, {
        full_name: "Synthetic availability resident " + key,
        date_of_birth: "1950-01-01",
        admission_date: "2025-01-01",
        accommodation: { room_id: residentRoom.id },
      });
      const start = new Date(Date.now() + 60_000).toISOString();
      const end = new Date(Date.now() + 3_600_000).toISOString();
      const reservation = await post("/reservations", staff, {
        room_id: held.id,
        resident_id: resident.id,
        reservation_start: start,
        reservation_end: end,
        reserved_capacity: 1,
      });
      const roomPath = "/accommodation-categories/" + category.id + "/availability";
      const dormPath = "/dormitories/" + dormitory.id + "/availability";
      const bedCategoryPath = "/accommodation-categories/" + dormitoryCategory.id + "/availability";
      const change = (unit, status, expected_status = "ACTIVE") => ({ id: unit.id, status, expected_status });
      const update = (path, actor, changes, expected = 200) => patch(path, actor, { changes }, expected);
      const publicCategory = async (id) => (await get("/public/availability")).find((row) => row.category_id === id);
      const projections = async (snapshot, view, suffix) => {
        const unitStates = ["available", "occupied", "reserved", "maintenance", "inactive"];
        assert.equal(unitStates.reduce((sum, metric) => sum + snapshot.counts[metric], 0), snapshot.counts.total);
        for (const metric of ["total", "available", "occupied", "reserved", "maintenance", "inactive"])
          assert.equal(snapshot.counts[metric], view[metric + "_" + suffix]);
      };

      await get(roomPath, undefined, 401);
      await update(roomPath, undefined, [change(idle, "MAINTENANCE")], 401);
      await patch(roomPath, admin, { changes: [], available_rooms: -1 }, 400);
      await update(roomPath, admin, [change(idle, "OCCUPIED")], 400);
      await update(roomPath, admin, [{ id: 2, status: "ACTIVE", expected_status: "MAINTENANCE" }], 400);
      await update(roomPath, staff, [change(idle, "MAINTENANCE"), change({ id: idle.id.toUpperCase() }, "INACTIVE")], 400);
      await update(roomPath, staff, [change(bed, "MAINTENANCE")], 409);
      await update(roomPath, staff, [change(idle, "MAINTENANCE"), change(residentRoom, "INACTIVE")], 409);
      await update(roomPath, staff, [change(residentRoom, "ACTIVE")], 409);
      await update(roomPath, admin, [change(held, "ARCHIVE")], 409);
      assert.equal((await get("/rooms/" + idle.id, admin)).operational_status, "ACTIVE");
      assert.equal((await get("/residents/" + resident.id, admin)).accommodation.room_id, residentRoom.id);

      await post("/reservations/" + reservation.id + "/confirm", admin, {});
      const after = await update(roomPath, staff, [change(idle, "MAINTENANCE")]);
      assert.deepEqual(after.counts, { total: 3, available: 0, occupied: 1, reserved: 1, maintenance: 1, inactive: 0 });
      const publicRooms = await publicCategory(category.id);
      await projections(after, publicRooms, "rooms");
      assert.equal(publicRooms.free_room_spaces, 2);
      assert.deepEqual((await get(roomPath, admin)).counts, after.counts);
      await projections(after, (await get("/accommodation-categories/" + category.id, staff)).availability, "rooms");
      await update(roomPath, admin, [change(idle, "INACTIVE")], 409);
      await update(dormPath, admin, [change(bed, "INACTIVE")]);
      await update(bedCategoryPath, staff, [change(unusedBed, "ARCHIVE")]);
      const beds = await get(dormPath, staff);
      assert.deepEqual(beds.counts, { total: 1, available: 0, occupied: 0, reserved: 0, maintenance: 0, inactive: 1 });
      await projections(beds, await publicCategory(dormitoryCategory.id), "beds");
      await projections(beds, (await get("/dormitories/" + dormitory.id, staff)).availability, "beds");
      assert((await pool.query("SELECT deleted_at FROM dormitory_beds WHERE id=$1", [unusedBed.id])).rows[0].deleted_at);
      const audit = (
        await pool.query("SELECT user_id, action, record_id FROM audit_logs WHERE record_id=ANY($1::uuid[]) AND old_values IS NOT NULL", [
          [idle.id, bed.id, unusedBed.id],
        ])
      ).rows;
      assert(audit.some((row) => row.user_id === staff && row.record_id === idle.id && row.action === "UPDATE"));
      assert(audit.some((row) => row.user_id === admin && row.record_id === bed.id && row.action === "UPDATE"));
      assert(audit.some((row) => row.user_id === staff && row.record_id === unusedBed.id && row.action === "ARCHIVE"));

      // Simulate a legacy occupied room with a conflicting operational flag.
      await pool.query("UPDATE rooms SET operational_status='MAINTENANCE' WHERE id=$1", [residentRoom.id]);
      try {
        const legacy = await get(roomPath, admin);
        assert.deepEqual(legacy.counts, after.counts);
        await projections(legacy, await publicCategory(category.id), "rooms");
        assert.equal((await get("/rooms/" + residentRoom.id, staff)).availability_status, "Occupied");
      } finally {
        await pool.query("UPDATE rooms SET operational_status='ACTIVE' WHERE id=$1", [residentRoom.id]);
      }

      await update(dormPath, staff, [change(bed, "ACTIVE", "INACTIVE")]);
      const moved = await post("/allocations/" + resident.allocation.id + "/transfer", staff, { bed_id: bed.id });
      assert.equal(moved.bed_id, bed.id);
      assert.equal((await get("/residents/" + resident.id, admin)).accommodation.bed_id, bed.id);
      await update(dormPath, staff, [change(bed, "ACTIVE")], 409);
      assert.equal((await get(dormPath, admin)).counts.occupied, 1);
      await post("/residents/" + resident.id + "/discharge", admin, {});
      assert.equal((await publicCategory(dormitoryCategory.id)).available_beds, 1);
      assert.equal((await get("/reservations/" + reservation.id, staff)).status, "CANCELLED");
      assert.equal((await publicCategory(category.id)).available_rooms, 2);
      const publicRows = await get("/public/availability");
      const summary = await get("/dashboard/summary", staff);
      assert.equal(summary.available_rooms, publicRows.reduce((sum, row) => sum + row.available_rooms, 0));
      assert.equal(summary.available_beds, publicRows.reduce((sum, row) => sum + row.available_beds, 0));
    });
  },
);
