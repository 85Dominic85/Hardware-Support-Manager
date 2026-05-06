-- 010-quick-consultations.sql
-- Iteración v0.7 (2026-05-06)
--
-- Adds support for "quick consultations" — incidents resolved in-situ in
-- minutes (a colleague stops by the desk, hardware lead helps, done in 5 min).
-- They count as workload but should NOT distort SLA / avg_resolution metrics.
--
-- 1. Adds 'consulta_rapida' to incident_category enum.
-- 2. Adds nullable column quick_duration_minutes to incidents.
-- 3. Adds index on category for the new filter that excludes consulta_rapida
--    from SLA queries.
--
-- HOW TO APPLY:
--   - Run as `postgres` role in Supabase SQL Editor.
--   - The ALTER TYPE statement must complete in its own transaction before
--     the new value can be used elsewhere; the explicit COMMIT below ensures
--     that. The rest can run in a single follow-up transaction.

-- 1) New enum value (own transaction).
ALTER TYPE hsm.incident_category ADD VALUE IF NOT EXISTS 'consulta_rapida';
COMMIT;

BEGIN;

-- 2) New nullable column.
ALTER TABLE hsm.incidents
  ADD COLUMN IF NOT EXISTS quick_duration_minutes INTEGER;

COMMENT ON COLUMN hsm.incidents.quick_duration_minutes IS
  'Estimated minutes invested when resolving an in-situ quick consultation. NULL for normal incidents. Not used for SLA calculations.';

-- 3) Index on category for the SLA filter `WHERE category != ''consulta_rapida''`
--    used in dashboard.ts. Speeds up the queries that exclude quick consultations.
CREATE INDEX IF NOT EXISTS idx_incidents_category
  ON hsm.incidents(category);

COMMIT;
