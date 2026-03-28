-- ============================================================
-- 004 · Update State Machines
-- ============================================================
-- Simplifies incident and RMA states for intermediary workflow.
-- Incidents: 9 → 8 states (removed repair/diagnostic states)
-- RMAs: 10 → 9 states (merged provider states, renamed)
-- ============================================================

-- INCIDENTS: Add new enum values
ALTER TYPE hsm.incident_status ADD VALUE IF NOT EXISTS 'en_gestion';
ALTER TYPE hsm.incident_status ADD VALUE IF NOT EXISTS 'esperando_proveedor';

-- Migrate any existing data from old states to new states
UPDATE hsm.incidents SET status = 'en_gestion' WHERE status = 'en_diagnostico';
UPDATE hsm.incidents SET status = 'en_gestion' WHERE status = 'en_reparacion';
UPDATE hsm.incidents SET status = 'esperando_proveedor' WHERE status = 'esperando_repuesto';

-- RMAS: Add new enum values
ALTER TYPE hsm.rma_status ADD VALUE IF NOT EXISTS 'aprobado';
ALTER TYPE hsm.rma_status ADD VALUE IF NOT EXISTS 'en_proveedor';
ALTER TYPE hsm.rma_status ADD VALUE IF NOT EXISTS 'recibido_oficina';

-- Migrate any existing data from old states to new states
UPDATE hsm.rmas SET status = 'aprobado' WHERE status = 'aprobado_proveedor';
UPDATE hsm.rmas SET status = 'en_proveedor' WHERE status = 'recibido_proveedor';
UPDATE hsm.rmas SET status = 'en_proveedor' WHERE status = 'en_reparacion_proveedor';
UPDATE hsm.rmas SET status = 'recibido_oficina' WHERE status = 'recibido_almacen';

-- NOTE: Old enum values (en_diagnostico, en_reparacion, esperando_repuesto,
-- aprobado_proveedor, recibido_proveedor, en_reparacion_proveedor, recibido_almacen)
-- cannot be removed from PostgreSQL enums. They remain but are unused.
-- The application code only references the new values.
