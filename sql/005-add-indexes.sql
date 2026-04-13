-- ============================================================
-- 005-add-indexes.sql
-- Performance indexes for Supabase hosted PostgreSQL
-- Run in Supabase SQL Editor as postgres (not hsm_app)
-- ============================================================

-- Incidents: filtered/sorted in nearly every query
CREATE INDEX IF NOT EXISTS idx_incidents_status ON hsm.incidents (status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON hsm.incidents (priority);
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_user_id ON hsm.incidents (assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_client_id ON hsm.incidents (client_id);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON hsm.incidents (created_at);
CREATE INDEX IF NOT EXISTS idx_incidents_state_changed_at ON hsm.incidents (state_changed_at);
CREATE INDEX IF NOT EXISTS idx_incidents_intercom_escalation_id ON hsm.incidents (intercom_escalation_id);
-- Composite: alerts (stale incidents), dashboard aging
CREATE INDEX IF NOT EXISTS idx_incidents_status_state_changed ON hsm.incidents (status, state_changed_at);

-- RMAs: filtered/sorted in nearly every query
CREATE INDEX IF NOT EXISTS idx_rmas_status ON hsm.rmas (status);
CREATE INDEX IF NOT EXISTS idx_rmas_provider_id ON hsm.rmas (provider_id);
CREATE INDEX IF NOT EXISTS idx_rmas_incident_id ON hsm.rmas (incident_id);
CREATE INDEX IF NOT EXISTS idx_rmas_client_id ON hsm.rmas (client_id);
CREATE INDEX IF NOT EXISTS idx_rmas_created_at ON hsm.rmas (created_at);
CREATE INDEX IF NOT EXISTS idx_rmas_state_changed_at ON hsm.rmas (state_changed_at);
-- Composite: warehouse query, stuck provider alerts
CREATE INDEX IF NOT EXISTS idx_rmas_status_state_changed ON hsm.rmas (status, state_changed_at);

-- Event logs: fetched by entity on every detail page
CREATE INDEX IF NOT EXISTS idx_event_logs_entity ON hsm.event_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_created_at ON hsm.event_logs (created_at);

-- Attachments: fetched by entity on every detail page
CREATE INDEX IF NOT EXISTS idx_attachments_entity ON hsm.attachments (entity_type, entity_id);

-- Client locations: lookup by client
CREATE INDEX IF NOT EXISTS idx_client_locations_client_id ON hsm.client_locations (client_id);

-- Clients: soft delete filter on every query
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON hsm.clients (deleted_at);
CREATE INDEX IF NOT EXISTS idx_clients_external_id ON hsm.clients (external_id);

-- Providers: soft delete filter on every query
CREATE INDEX IF NOT EXISTS idx_providers_deleted_at ON hsm.providers (deleted_at);

-- Users: soft delete filter on every query
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON hsm.users (deleted_at);

-- Verify unaccent extension is available for search queries
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA extensions;

-- Ensure hsm_app role can use unaccent via search_path
DO $$
BEGIN
  EXECUTE 'ALTER ROLE hsm_app SET search_path TO hsm, extensions, public';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not alter hsm_app search_path: %', SQLERRM;
END
$$;
