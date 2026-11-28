-- Up Migration
CREATE SEQUENCE staff_number_seq;
CREATE SEQUENCE enquiry_number_seq;
CREATE SEQUENCE resident_number_seq;
CREATE SEQUENCE reservation_number_seq;

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(100) NOT NULL UNIQUE,
  module varchar(100) NOT NULL,
  description text
);
CREATE TABLE role_permissions (
  role_id uuid REFERENCES roles(id),
  permission_id uuid REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_number varchar(30) NOT NULL UNIQUE DEFAULT ('STF-' || nextval('staff_number_seq')),
  full_name varchar(150) NOT NULL CHECK (btrim(full_name) <> ''),
  username varchar(100) NOT NULL CHECK (btrim(username) <> ''),
  email varchar(255) NOT NULL,
  phone varchar(20),
  password_hash text NOT NULL,
  designation varchar(100),
  role_id uuid NOT NULL REFERENCES roles(id),
  status varchar(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE UNIQUE INDEX users_username_key ON users (lower(username));
CREATE UNIQUE INDEX users_email_key ON users (lower(email));
CREATE INDEX users_role_status_idx ON users (role_id, status) WHERE deleted_at IS NULL;
CREATE TABLE auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  refresh_token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL CHECK (expires_at > created_at),
  revoked_at timestamptz
);
CREATE INDEX auth_sessions_user_idx ON auth_sessions (user_id) WHERE revoked_at IS NULL;
CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL CHECK (expires_at > created_at),
  used_at timestamptz
);
CREATE INDEX password_reset_tokens_user_idx ON password_reset_tokens (user_id) WHERE used_at IS NULL;
CREATE TABLE enquiry_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(150) NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE accommodation_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name varchar(150) NOT NULL,
  category_code varchar(30) NOT NULL UNIQUE,
  accommodation_type varchar(20) NOT NULL CHECK (accommodation_type IN ('ROOM','DORMITORY')),
  description text,
  default_capacity integer NOT NULL CHECK (default_capacity > 0),
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE UNIQUE INDEX accommodation_categories_name_key ON accommodation_categories (lower(category_name));
CREATE UNIQUE INDEX accommodation_categories_code_ci_key ON accommodation_categories (lower(category_code));
CREATE TABLE enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_number varchar(30) NOT NULL UNIQUE DEFAULT ('ENQ-' || nextval('enquiry_number_seq')),
  category_id uuid NOT NULL REFERENCES enquiry_categories(id),
  source_form varchar(100) NOT NULL,
  original_topic varchar(150),
  applicant_name varchar(150) NOT NULL CHECK (btrim(applicant_name) <> ''),
  email varchar(255),
  phone varchar(20) NOT NULL,
  whatsapp_available boolean NOT NULL DEFAULT false,
  message text,
  status varchar(30) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','PENDING','IN_PROGRESS','SUBMITTED','CLOSED')),
  assigned_user_id uuid REFERENCES users(id),
  created_by uuid REFERENCES users(id),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX enquiries_status_created_idx ON enquiries (status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX enquiries_category_idx ON enquiries (category_id);
CREATE INDEX enquiries_assignment_idx ON enquiries (assigned_user_id) WHERE deleted_at IS NULL;
CREATE TABLE enquiry_details (
  enquiry_id uuid PRIMARY KEY REFERENCES enquiries(id),
  applicant_relationship varchar(100),
  age integer CHECK (age BETWEEN 0 AND 130),
  gender varchar(30),
  address text,
  accommodation_category_id uuid REFERENCES accommodation_categories(id),
  care_requirement text,
  residence_type varchar(30),
  expected_move_in varchar(100),
  medical_notes text,
  dietary_notes text,
  contact_consent boolean,
  consent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE enquiry_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES enquiries(id),
  user_id uuid NOT NULL REFERENCES users(id),
  previous_status varchar(30) CHECK (previous_status IN ('NEW','PENDING','IN_PROGRESS','SUBMITTED','CLOSED')),
  new_status varchar(30) NOT NULL CHECK (new_status IN ('NEW','PENDING','IN_PROGRESS','SUBMITTED','CLOSED')),
  remarks text,
  followup_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX enquiry_followups_enquiry_idx ON enquiry_followups (enquiry_id, created_at);
CREATE TABLE visit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES enquiries(id),
  preferred_date date,
  preferred_time time,
  preferred_time_slot varchar(50),
  visitor_count integer CHECK (visitor_count > 0),
  purpose varchar(150),
  status varchar(30) NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED','CONFIRMED','COMPLETED','CANCELLED')),
  confirmed_at timestamptz,
  confirmed_by uuid REFERENCES users(id),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX visit_requests_enquiry_idx ON visit_requests (enquiry_id);
CREATE INDEX visit_requests_status_date_idx ON visit_requests (status, preferred_date);

CREATE TABLE residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_number varchar(30) NOT NULL UNIQUE DEFAULT ('RES-' || nextval('resident_number_seq')),
  enquiry_id uuid REFERENCES enquiries(id),
  full_name varchar(150) NOT NULL CHECK (btrim(full_name) <> ''),
  date_of_birth date NOT NULL,
  gender varchar(30),
  phone varchar(20),
  email varchar(255),
  address text,
  admission_date date NOT NULL,
  discharge_date date,
  admission_category varchar(100),
  admission_status varchar(30) NOT NULL DEFAULT 'ADMITTED'
    CHECK (admission_status IN ('ADMITTED','HOSPITALIZED','TEMPORARY_LEAVE','DISCHARGED')),
  staff_visible boolean NOT NULL DEFAULT false,
  remarks text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CHECK (admission_date >= date_of_birth),
  CHECK ((admission_status = 'DISCHARGED') = (discharge_date IS NOT NULL)),
  CHECK (discharge_date >= admission_date)
);
CREATE INDEX residents_status_admission_idx ON residents (admission_status, admission_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX residents_enquiry_idx ON residents (enquiry_id);
CREATE TABLE resident_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id),
  contact_name varchar(150) NOT NULL,
  contact_type varchar(30) NOT NULL CHECK (contact_type IN ('GUARDIAN','EMERGENCY','OTHER')),
  relationship varchar(50),
  phone varchar(20),
  email varchar(255),
  address text,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX resident_contacts_resident_idx ON resident_contacts (resident_id);
CREATE UNIQUE INDEX resident_contacts_primary_key ON resident_contacts (resident_id, contact_type) WHERE is_primary;
CREATE TABLE resident_care_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL UNIQUE REFERENCES residents(id),
  medical_conditions text,
  allergies text,
  dietary_requirements text,
  mobility_requirements text,
  care_requirements text,
  special_instructions text,
  updated_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_name varchar(150) NOT NULL,
  building_code varchar(30) NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE UNIQUE INDEX buildings_code_ci_key ON buildings (lower(building_code));
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES accommodation_categories(id),
  building_id uuid NOT NULL REFERENCES buildings(id),
  room_number varchar(30) NOT NULL UNIQUE,
  floor_number integer NOT NULL DEFAULT 0,
  capacity integer NOT NULL CHECK (capacity > 0),
  operational_status varchar(30) NOT NULL DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE','MAINTENANCE','INACTIVE')),
  remarks text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX rooms_category_idx ON rooms (category_id);
CREATE INDEX rooms_building_idx ON rooms (building_id);
CREATE UNIQUE INDEX rooms_number_ci_key ON rooms (lower(room_number));
CREATE TABLE dormitories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES accommodation_categories(id),
  building_id uuid NOT NULL REFERENCES buildings(id),
  dormitory_name varchar(150) NOT NULL,
  dormitory_number varchar(30) NOT NULL UNIQUE,
  floor_number integer NOT NULL DEFAULT 0,
  bed_capacity integer CHECK (bed_capacity > 0),
  operational_status varchar(30) NOT NULL DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE','MAINTENANCE','INACTIVE')),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX dormitories_category_idx ON dormitories (category_id);
CREATE INDEX dormitories_building_idx ON dormitories (building_id);
CREATE UNIQUE INDEX dormitories_number_ci_key ON dormitories (lower(dormitory_number));
CREATE TABLE dormitory_beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dormitory_id uuid NOT NULL REFERENCES dormitories(id),
  bed_number varchar(30) NOT NULL,
  operational_status varchar(30) NOT NULL DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE','MAINTENANCE','INACTIVE')),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (dormitory_id, bed_number)
);
CREATE UNIQUE INDEX beds_dormitory_number_ci_key ON dormitory_beds (dormitory_id, lower(bed_number));
CREATE TABLE accommodation_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid NOT NULL REFERENCES residents(id),
  room_id uuid REFERENCES rooms(id),
  bed_id uuid REFERENCES dormitory_beds(id),
  allocation_type varchar(20) NOT NULL CHECK (allocation_type IN ('ROOM','DORMITORY')),
  start_at timestamptz NOT NULL DEFAULT now(),
  end_at timestamptz,
  status varchar(30) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','RELEASED','TRANSFERRED','CANCELLED')),
  allocated_by uuid NOT NULL REFERENCES users(id),
  released_by uuid REFERENCES users(id),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(room_id,bed_id) = 1),
  CHECK ((room_id IS NOT NULL) = (allocation_type = 'ROOM')),
  CHECK ((status = 'ACTIVE') = (end_at IS NULL)),
  CHECK (end_at >= start_at)
);
CREATE UNIQUE INDEX allocations_active_resident_key ON accommodation_allocations (resident_id) WHERE status = 'ACTIVE';
CREATE UNIQUE INDEX allocations_active_bed_key ON accommodation_allocations (bed_id) WHERE status = 'ACTIVE' AND bed_id IS NOT NULL;
CREATE INDEX allocations_active_room_idx ON accommodation_allocations (room_id) WHERE status = 'ACTIVE';
CREATE INDEX allocations_resident_history_idx ON accommodation_allocations (resident_id, start_at DESC);
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_number varchar(30) NOT NULL UNIQUE DEFAULT ('RSV-' || nextval('reservation_number_seq')),
  enquiry_id uuid REFERENCES enquiries(id),
  resident_id uuid REFERENCES residents(id),
  room_id uuid REFERENCES rooms(id),
  bed_id uuid REFERENCES dormitory_beds(id),
  reserved_capacity integer NOT NULL DEFAULT 1 CHECK (reserved_capacity > 0),
  reservation_start timestamptz NOT NULL,
  reservation_end timestamptz NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','EXPIRED','CONVERTED')),
  reserved_by uuid NOT NULL REFERENCES users(id),
  converted_allocation_id uuid UNIQUE REFERENCES accommodation_allocations(id),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(room_id,bed_id) = 1),
  CHECK (num_nonnulls(enquiry_id,resident_id) >= 1),
  CHECK (bed_id IS NULL OR reserved_capacity = 1),
  CHECK (reservation_end > reservation_start),
  CHECK ((status = 'CONVERTED') = (converted_allocation_id IS NOT NULL))
);
CREATE INDEX reservations_room_window_idx ON reservations (room_id, reservation_start, reservation_end) WHERE status = 'CONFIRMED';
CREATE INDEX reservations_bed_window_idx ON reservations (bed_id, reservation_start, reservation_end) WHERE status = 'CONFIRMED';
CREATE INDEX reservations_expiry_idx ON reservations (reservation_end) WHERE status IN ('PENDING','CONFIRMED');
CREATE INDEX reservations_resident_idx ON reservations (resident_id);
CREATE TABLE allocation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id uuid REFERENCES accommodation_allocations(id),
  resident_id uuid NOT NULL REFERENCES residents(id),
  previous_room_id uuid REFERENCES rooms(id),
  new_room_id uuid REFERENCES rooms(id),
  previous_bed_id uuid REFERENCES dormitory_beds(id),
  new_bed_id uuid REFERENCES dormitory_beds(id),
  action varchar(30) NOT NULL CHECK (action IN ('ADMIT','ALLOCATE','TRANSFER','RELEASE','DISCHARGE','ARCHIVE','UPDATE')),
  performed_by uuid NOT NULL REFERENCES users(id),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(previous_room_id,previous_bed_id) <= 1),
  CHECK (num_nonnulls(new_room_id,new_bed_id) <= 1)
);
CREATE INDEX allocation_history_resident_idx ON allocation_history (resident_id, created_at DESC);
CREATE INDEX allocation_history_allocation_idx ON allocation_history (allocation_id);
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  module_name varchar(100) NOT NULL,
  record_id uuid NOT NULL,
  action varchar(30) NOT NULL CHECK (action IN ('CREATE','UPDATE','DELETE','ARCHIVE','ALLOCATE','TRANSFER','RELEASE','RESERVE','CONFIRM','CANCEL','EXPIRE','CONVERT','DISCHARGE')),
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_record_idx ON audit_logs (module_name, record_id, created_at DESC);
CREATE INDEX audit_logs_created_idx ON audit_logs (created_at DESC);

CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $phase5$
BEGIN
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$phase5$;
DO $phase5$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['users','enquiry_categories','enquiries','enquiry_details','visit_requests',
    'residents','resident_contacts','resident_care_details','accommodation_categories','buildings',
    'rooms','dormitories','dormitory_beds','accommodation_allocations','reservations']
  LOOP
    EXECUTE format('CREATE TRIGGER touch_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', table_name);
  END LOOP;
END;
$phase5$;

CREATE FUNCTION protect_record_history() RETURNS trigger LANGUAGE plpgsql AS $phase5$
BEGIN
  RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'Historical records cannot be removed or edited';
END;
$phase5$;
CREATE TRIGGER protect_allocations BEFORE DELETE ON accommodation_allocations
  FOR EACH ROW EXECUTE FUNCTION protect_record_history();
CREATE TRIGGER protect_reservations BEFORE DELETE ON reservations
  FOR EACH ROW EXECUTE FUNCTION protect_record_history();
CREATE TRIGGER protect_allocation_history BEFORE UPDATE OR DELETE ON allocation_history
  FOR EACH ROW EXECUTE FUNCTION protect_record_history();
CREATE TRIGGER protect_enquiry_followups BEFORE UPDATE OR DELETE ON enquiry_followups
  FOR EACH ROW EXECUTE FUNCTION protect_record_history();
CREATE TRIGGER protect_audit_logs BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION protect_record_history();

-- Down Migration
DROP TABLE audit_logs, allocation_history, reservations, accommodation_allocations,
  dormitory_beds, dormitories, rooms, buildings, resident_care_details, resident_contacts, residents,
  visit_requests, enquiry_followups, enquiry_details, enquiries, accommodation_categories,
  enquiry_categories, password_reset_tokens, auth_sessions, users, role_permissions, permissions, roles;
DROP FUNCTION protect_record_history(), set_updated_at();
DROP SEQUENCE reservation_number_seq, resident_number_seq, enquiry_number_seq, staff_number_seq;
