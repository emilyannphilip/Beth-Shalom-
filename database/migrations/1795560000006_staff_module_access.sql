-- Up Migration
INSERT INTO permissions(code,module)
VALUES ('enquiries.manage','enquiries'), ('residents.manage','residents')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions(role_id,permission_id)
SELECT r.id,p.id FROM roles r CROSS JOIN permissions p
WHERE r.name='STAFF' AND p.code IN ('enquiries.manage','residents.manage')
ON CONFLICT DO NOTHING;

-- Keep public form routing attached to the original categories when their labels change.
ALTER TABLE enquiry_categories ADD COLUMN IF NOT EXISTS public_topic varchar(150) UNIQUE;
UPDATE enquiry_categories c SET public_topic=c.name
WHERE c.public_topic IS NULL AND NOT EXISTS (
  SELECT 1 FROM enquiry_categories mapped WHERE mapped.public_topic=c.name
) AND c.name IN (
  'Senior Admission & Room Tour',
  'Differently-Abled Support Living',
  'Detailed Suite & Floor Plan Inspection',
  'Facilities',
  'General Institutional Walkthrough'
);

-- Down Migration
ALTER TABLE enquiry_categories DROP COLUMN public_topic;
DELETE FROM role_permissions rp USING roles r, permissions p
WHERE rp.role_id=r.id AND rp.permission_id=p.id AND r.name='STAFF'
  AND p.code IN ('enquiries.manage','residents.manage');
