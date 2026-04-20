-- 008: Simplify forms — drop client_location_id, homogenize RMA contact/pickup columns,
-- and remap incident_category enum to channel-based values.
--
-- Run as `postgres` in Supabase SQL Editor (hsm_app lacks DDL privileges).
-- Execute each statement individually — Supabase SQL Editor does not support BEGIN/COMMIT.

-- 1. Remove Local/Sucursal reference from incidents and rmas -----------------
ALTER TABLE hsm.incidents DROP COLUMN IF EXISTS client_location_id;
ALTER TABLE hsm.rmas       DROP COLUMN IF EXISTS client_location_id;

-- 2. Homogenize RMA contact + pickup columns (rename + add contact_name) -----
ALTER TABLE hsm.rmas RENAME COLUMN phone       TO contact_phone;
ALTER TABLE hsm.rmas RENAME COLUMN address     TO pickup_address;
ALTER TABLE hsm.rmas RENAME COLUMN city        TO pickup_city;
ALTER TABLE hsm.rmas RENAME COLUMN postal_code TO pickup_postal_code;
ALTER TABLE hsm.rmas ADD  COLUMN contact_name varchar(255);

-- 3. Remap incident_category enum to channel-based values --------------------
-- Step 3a: create new enum with the final values
CREATE TYPE hsm.incident_category_new AS ENUM (
  'escalado',
  'incidencia_directa',
  'mencion',
  'otro'
);

-- Step 3b: cast existing column to text so we can map legacy values
ALTER TABLE hsm.incidents
  ALTER COLUMN category TYPE text
  USING category::text;

-- Step 3c: migrate legacy hardware-type categories → 'otro'
UPDATE hsm.incidents
SET category = 'otro'
WHERE category IN (
  'hardware',
  'periferico',
  'red',
  'almacenamiento',
  'impresora',
  'monitor'
);

-- Step 3d: swap old enum for the new one
ALTER TABLE hsm.incidents
  ALTER COLUMN category TYPE hsm.incident_category_new
  USING category::hsm.incident_category_new;

DROP TYPE hsm.incident_category;
ALTER TYPE hsm.incident_category_new RENAME TO incident_category;
