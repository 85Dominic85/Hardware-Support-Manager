-- Migration 002: Clients table, client_locations table, and incident/RMA enrichment
-- Non-destructive: all new columns are nullable, existing data unaffected

BEGIN;

-- 1. Add 'client' to entity_type enum
ALTER TYPE hsm.entity_type ADD VALUE IF NOT EXISTS 'client';

COMMIT;

-- Enum ALTER must be in its own transaction
BEGIN;

-- 2. Create clients table
CREATE TABLE IF NOT EXISTS hsm.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(500) NOT NULL,
  external_id VARCHAR(255),
  intercom_url VARCHAR(1000),
  email VARCHAR(255),
  phone VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 3. Create client_locations table
CREATE TABLE IF NOT EXISTS hsm.client_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES hsm.clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(255),
  postal_code VARCHAR(20),
  notes TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Add new columns to incidents
ALTER TABLE hsm.incidents
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES hsm.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_location_id UUID REFERENCES hsm.client_locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS intercom_url VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS intercom_escalation_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS pickup_address TEXT,
  ADD COLUMN IF NOT EXISTS pickup_postal_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS pickup_city VARCHAR(255);

-- 5. Add new columns to rmas
ALTER TABLE hsm.rmas
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES hsm.clients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_location_id UUID REFERENCES hsm.client_locations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS city VARCHAR(255);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_client_locations_client_id ON hsm.client_locations(client_id);
CREATE INDEX IF NOT EXISTS idx_incidents_client_id ON hsm.incidents(client_id);
CREATE INDEX IF NOT EXISTS idx_rmas_client_id ON hsm.rmas(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_name ON hsm.clients(name);

-- 7. Updated_at triggers for new tables
CREATE OR REPLACE FUNCTION hsm.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_clients_updated_at ON hsm.clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON hsm.clients
  FOR EACH ROW EXECUTE FUNCTION hsm.update_updated_at_column();

DROP TRIGGER IF EXISTS update_client_locations_updated_at ON hsm.client_locations;
CREATE TRIGGER update_client_locations_updated_at
  BEFORE UPDATE ON hsm.client_locations
  FOR EACH ROW EXECUTE FUNCTION hsm.update_updated_at_column();

-- 8. Grant permissions to hsm_app role
GRANT ALL ON hsm.clients TO hsm_app;
GRANT ALL ON hsm.client_locations TO hsm_app;

COMMIT;
