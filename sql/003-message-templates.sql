-- ============================================================
-- 003 · Message Templates
-- ============================================================
-- Adds a message_templates table for predefined text templates
-- used to generate client/provider communications from
-- incident and RMA detail pages.
-- ============================================================

BEGIN;

-- 1. Enum for template category
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_category' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'hsm')) THEN
    CREATE TYPE hsm.template_category AS ENUM ('cliente', 'proveedor');
  END IF;
END$$;

-- 2. Table
CREATE TABLE IF NOT EXISTS hsm.message_templates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          varchar(255)  NOT NULL,
  category      hsm.template_category NOT NULL DEFAULT 'cliente',
  subject       varchar(500),
  body          text          NOT NULL DEFAULT '',
  variables     jsonb         NOT NULL DEFAULT '[]'::jsonb,
  sort_order    integer       NOT NULL DEFAULT 0,
  is_active     boolean       NOT NULL DEFAULT true,
  created_at    timestamptz   NOT NULL DEFAULT now(),
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

-- 3. Index
CREATE INDEX IF NOT EXISTS idx_message_templates_category_active
  ON hsm.message_templates (category, is_active);

-- 4. Auto-update updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_updated_at_message_templates'
      AND tgrelid = 'hsm.message_templates'::regclass
  ) THEN
    CREATE TRIGGER set_updated_at_message_templates
      BEFORE UPDATE ON hsm.message_templates
      FOR EACH ROW EXECUTE FUNCTION hsm.set_updated_at();
  END IF;
END$$;

-- 5. Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON hsm.message_templates TO hsm_app;

-- 6. Seed default templates
INSERT INTO hsm.message_templates (name, category, subject, body, variables, sort_order) VALUES
(
  'Solicitud RMA a proveedor',
  'proveedor',
  'Solicitud RMA — {{deviceBrand}} {{deviceModel}} (S/N: {{deviceSerialNumber}})',
  E'Estimado equipo de soporte,\n\nSolicito la apertura de un RMA para el siguiente equipo:\n\n- Marca: {{deviceBrand}}\n- Modelo: {{deviceModel}}\n- Nº de serie: {{deviceSerialNumber}}\n- Tipo: {{deviceType}}\n\nCliente: {{clientName}}\nNº de incidencia: {{incidentNumber}}\n\nDescripción del problema:\n{{description}}\n\nDirección de recogida:\n{{pickupAddress}}, {{pickupCity}} {{pickupPostalCode}}\nContacto: {{contactName}} — {{contactPhone}}\n\nQuedo a la espera de su confirmación.\n\nSaludos,',
  '["deviceBrand","deviceModel","deviceSerialNumber","deviceType","clientName","incidentNumber","description","pickupAddress","pickupCity","pickupPostalCode","contactName","contactPhone"]',
  1
),
(
  'Notificación envío a cliente',
  'cliente',
  'Su equipo ha sido enviado — {{rmaNumber}}',
  E'Hola {{clientName}},\n\nLe informamos que su equipo {{deviceBrand}} {{deviceModel}} ha sido enviado al servicio técnico.\n\nNº de seguimiento: {{trackingNumberOutgoing}}\nNº de RMA: {{rmaNumber}}\n\nLe mantendremos informado del progreso.\n\nSaludos,',
  '["clientName","deviceBrand","deviceModel","trackingNumberOutgoing","rmaNumber"]',
  2
),
(
  'Equipo reparado — recogida',
  'cliente',
  'Su equipo está listo para devolución — {{rmaNumber}}',
  E'Hola {{clientName}},\n\nSu equipo {{deviceBrand}} {{deviceModel}} ha sido reparado y está en camino de vuelta.\n\nNº de seguimiento devolución: {{trackingNumberReturn}}\nNº de RMA: {{rmaNumber}}\n\nPor favor confirme la recepción.\n\nSaludos,',
  '["clientName","deviceBrand","deviceModel","trackingNumberReturn","rmaNumber"]',
  3
),
(
  'Seguimiento incidencia a cliente',
  'cliente',
  'Actualización incidencia {{incidentNumber}}',
  E'Hola {{clientName}},\n\nLe escribimos para informarle sobre el estado de su incidencia {{incidentNumber}}.\n\nEquipo: {{deviceBrand}} {{deviceModel}}\nEstado actual: {{status}}\n\nSi tiene alguna duda, no dude en contactarnos.\n\nSaludos,',
  '["clientName","incidentNumber","deviceBrand","deviceModel","status"]',
  4
)
ON CONFLICT DO NOTHING;

COMMIT;
