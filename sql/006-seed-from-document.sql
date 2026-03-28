-- ============================================================
-- SEED DATA: Extracted from "Hardware departament documento Vivo.md"
-- Jan-Mar 2026 daily activity log
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. CLIENTS
-- ============================================================

INSERT INTO hsm.clients (id, name, contact_name, notes, created_at, updated_at) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Knela Cafe', NULL, 'RMA impresora reparado ene-2026', '2026-01-20 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000002', 'Bar L''encontre', NULL, 'Pendiente recogida impresora', '2026-01-21 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000003', 'Bar La Risaia', NULL, 'Impresora no conecta wifi, cliente longevo', '2026-01-21 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000004', 'UMAME Burguer', 'Miriam Morales', 'RMA Posiflex tramitado desde oficina', '2026-01-21 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000005', 'Caffetin Las Francesas', 'Yudith Martinez', 'RMA Pedro Porto', '2026-01-21 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000006', 'Sukaldea Atotxa', 'Pedro', 'Problemas TPV, permanencia 6 meses conseguida', '2026-01-21 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000007', 'El Mundo del Campero', 'Pablo', 'TPV bloqueado, reconfigurado a TPV antiguo', '2026-01-21 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000008', 'La Favorita Burguer', 'Marta', 'Fuera de temporada', '2026-01-26 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000009', 'La Esquina del Buen Sabor', 'Claudia', 'Pantalla TPV dañada, sin cobertura garantía', '2026-01-26 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000010', 'Restaurante La Parada', 'Albert', 'Problemas mal tramitados anteriormente, solucionados desde almacén', '2026-01-26 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000011', 'Cafeson', 'Dayma', 'Operativa 3 Sunmi + 2 POS, resuelto con OPAL', '2026-01-27 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000012', 'Kache Cafe', 'Ismael', 'Cajón portamonedas no abre', '2026-02-03 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000013', 'Taquería Los Carnales', 'Oscar Vargas', 'Printer perdida CTT, enviada nueva', '2026-01-07 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000014', 'BocaFloja Brunch', NULL, 'Cambio RMA presencial impresora en Sevilla', '2026-02-20 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000015', 'Bar Cuatrolatas', 'Jorge', '4 impresoras, configuración enrevesada', '2026-02-09 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000016', 'Casa de Botes', 'Maria', 'TPV enviado a cambio permanencia 12 meses', '2026-02-09 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000017', 'Bar Santiago', 'Fran', 'Videovigilancia incompatible con IPs impresoras', '2026-03-09 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000018', 'Solopizza', NULL, 'Config 2 impresoras + 1 TPV', '2026-03-11 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000019', 'La Bella Caffe Tejeringos', NULL, 'Incidencia costes recogida, cambio política fabricante', '2026-03-11 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000020', 'Manhattan Food & Drink', 'Flor', 'Impresora cocina sacada del OPAL', '2026-02-13 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000021', 'Pilar Palau Cafe', 'Pilar', 'Envío impresora + RMA proveedor', '2026-01-08 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000022', 'La Darsena', NULL, 'Envío y recogida impresora LAN', '2026-01-20 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000023', 'La Perla de la Habana', 'Tamya', 'Incidencia CTT resuelta, paquetes entregados', '2026-01-22 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000024', 'Restaurante BEBE tu Birra', NULL, 'Config complicada Win7, todo en funcionamiento', '2026-01-23 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000025', 'La Reinventá', NULL, 'Recuperación equipos enviados por error', '2026-02-16 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000026', 'Bar de Dalt', NULL, 'RMA impresora reparada, cerrado', '2026-02-12 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000027', 'Canela en Rama', NULL, 'Config complicada, cliente no quiere typeform', '2026-03-02 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000028', 'Nuevo Baviera', 'Romer Taranto', 'RMA pendiente de tramitar', '2026-02-20 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000029', 'El Tapeillo', 'José', 'Descontento soporte, reconfigurado equipo', '2026-02-18 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000030', 'Bar La Sixta', NULL, 'Config impresora aqprox USB, 16 min', '2026-01-27 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000031', 'Bar Terraseta', NULL, 'Config impresora USB cliente, 17 min', '2026-01-27 09:00:00+01', now()),
  ('a0000001-0000-0000-0000-000000000032', 'Fiorito Argentino', NULL, 'Impresora LAN one-off', '2026-01-29 09:00:00+01', now());

-- ============================================================
-- 2. CLIENT LOCATIONS (one default location per client)
-- ============================================================

INSERT INTO hsm.client_locations (id, client_id, name, contact_name, is_default, created_at, updated_at) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'Local principal', NULL, true, '2026-01-20 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'Local principal', NULL, true, '2026-01-21 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000003', 'Local principal', NULL, true, '2026-01-21 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'Restaurante', 'Miriam Morales', true, '2026-01-21 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000005', 'Local principal', 'Yudith Martinez', true, '2026-01-21 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000006', 'Restaurante Atotxa', 'Pedro', true, '2026-01-21 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000007', 'Local principal', 'Pablo', true, '2026-01-21 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000008', 'Local principal', 'Marta', true, '2026-01-26 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000009', 'Local principal', 'Claudia', true, '2026-01-26 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000010', 'Restaurante', 'Albert', true, '2026-01-26 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000011', 'Cafeson', 'Dayma', true, '2026-01-27 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000012', 'Café', 'Ismael', true, '2026-02-03 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000013', 'Taquería', 'Oscar Vargas', true, '2026-01-07 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000014', 'Local Sevilla', NULL, true, '2026-02-20 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000015', 'Bar', 'Jorge', true, '2026-02-09 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000016', 'a0000001-0000-0000-0000-000000000016', 'Local principal', 'Maria', true, '2026-02-09 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000017', 'Bar', 'Fran', true, '2026-03-09 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000018', 'Local principal', NULL, true, '2026-03-11 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000019', 'Cafetería', NULL, true, '2026-03-11 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000020', 'Local principal', 'Flor', true, '2026-02-13 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000021', 'Café', 'Pilar', true, '2026-01-08 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000022', 'a0000001-0000-0000-0000-000000000022', 'Local principal', NULL, true, '2026-01-20 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000023', 'a0000001-0000-0000-0000-000000000023', 'Restaurante', 'Tamya', true, '2026-01-22 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000024', 'Local principal', NULL, true, '2026-01-23 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000025', 'a0000001-0000-0000-0000-000000000025', 'Restaurante', NULL, true, '2026-02-16 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000026', 'a0000001-0000-0000-0000-000000000026', 'Bar', NULL, true, '2026-02-12 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000027', 'a0000001-0000-0000-0000-000000000027', 'Restaurante', NULL, true, '2026-03-02 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000028', 'a0000001-0000-0000-0000-000000000028', 'Local principal', 'Romer Taranto', true, '2026-02-20 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000029', 'a0000001-0000-0000-0000-000000000029', 'Bar', 'José', true, '2026-02-18 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000030', 'a0000001-0000-0000-0000-000000000030', 'Bar', NULL, true, '2026-01-27 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000031', 'a0000001-0000-0000-0000-000000000031', 'Bar', NULL, true, '2026-01-27 09:00:00+01', now()),
  ('b0000001-0000-0000-0000-000000000032', 'a0000001-0000-0000-0000-000000000032', 'Restaurante', NULL, true, '2026-01-29 09:00:00+01', now());

-- ============================================================
-- 3. INCIDENTS
-- Assigned to Domingo Bueno: f478ccf0-3c04-4324-9f24-57ed75c754d7
-- ============================================================

INSERT INTO hsm.incidents (
  id, incident_number, client_id, client_location_id, client_name,
  title, description, category, priority, status,
  assigned_user_id, device_type, device_brand, device_model,
  intercom_url, intercom_escalation_id, contact_name,
  resolution_type, resolved_at, created_at, updated_at, state_changed_at
) VALUES

-- INC-2026-00001: Knela Cafe - Impresora RMA reparado
(gen_random_uuid(), 'INC-2026-00001',
 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Knela Cafe',
 'Impresora averiada - RMA reparado pendiente envío al cliente',
 'RMA reparado, a la espera de recoger la impresora del fabricante y enviarla al local del cliente.',
 'impresora', 'media', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/admin/8601230/conversation/215472543578393?view=List', '215472543578393', NULL,
 'derivado_rma', '2026-01-26 12:00:00+01', '2026-01-20 09:00:00+01', now(), '2026-01-26 12:00:00+01'),

-- INC-2026-00002: Bar L'encontre - Recogida impresora
(gen_random_uuid(), 'INC-2026-00002',
 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'Bar L''encontre',
 'Recogida de impresora averiada en local',
 'Pendiente tramitar la recogida de una impresora en su local.',
 'impresora', 'media', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/conversation/215472746334158?view=List', '215472746334158', NULL,
 'derivado_rma', '2026-02-06 12:00:00+01', '2026-01-21 09:00:00+01', now(), '2026-02-06 12:00:00+01'),

-- INC-2026-00003: Bar La Risaia - Impresora no conecta WiFi
(gen_random_uuid(), 'INC-2026-00003',
 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000003', 'Bar La Risaia',
 'Impresora no conecta a WiFi',
 'Cliente longevo. Impresora no conecta a WiFi. Aprobado enviar directamente una AQPROX WiFi a su local. Esperando datos del cliente.',
 'impresora', 'alta', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', 'AQPROX', 'WiFi',
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/conversation/215472611373279?view=List', '215472611373279', NULL,
 'standard', '2026-02-10 12:00:00+01', '2026-01-21 09:00:00+01', now(), '2026-02-10 12:00:00+01'),

-- INC-2026-00004: UMAME Burguer - RMA Posiflex desde oficina
(gen_random_uuid(), 'INC-2026-00004',
 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000004', 'UMAME Burguer',
 'Solicitud de RMA Posiflex - tramitar desde oficina',
 'Cliente necesita que rellenemos nosotros la solicitud de RMA desde Posiflex. Se va a tramitar directamente desde la oficina. Enviado TPV de repuesto.',
 'hardware', 'alta', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', 'Posiflex', NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/conversation/215472723234113?view=List', '215472723234113', 'Miriam Morales',
 'derivado_rma', '2026-01-22 15:00:00+01', '2026-01-21 09:00:00+01', now(), '2026-01-22 15:00:00+01'),

-- INC-2026-00005: Caffetin Las Francesas - RMA Pedro Porto
(gen_random_uuid(), 'INC-2026-00005',
 'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000005', 'Caffetin Las Francesas',
 'Equipo averiado - RMA solicitado a Pedro Porto',
 'Solicitado ya el RMA a Pedro Porto. A la espera de la contestación del proveedor.',
 'hardware', 'media', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/conversation/215472593539705?view=List', '215472593539705', 'Yudith Martinez',
 'derivado_rma', '2026-02-05 12:00:00+01', '2026-01-21 09:00:00+01', now(), '2026-02-05 12:00:00+01'),

-- INC-2026-00006: Sukaldea Atotxa - Problemas con TPV
(gen_random_uuid(), 'INC-2026-00006',
 'a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000006', 'Sukaldea Atotxa',
 'Problemas con TPV - consulta al fabricante',
 'Christopher y Pedro reportan problemas con un TPV. Consultando al fabricante. Cliente ha enviado fotos del dispositivo. Solucionada la operativa, conseguida permanencia de 6 meses.',
 'hardware', 'alta', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/conversation/215472598769113?view=List', '215472598769113', 'Christopher',
 'standard', '2026-01-26 11:00:00+01', '2026-01-21 09:00:00+01', now(), '2026-01-26 11:00:00+01'),

-- INC-2026-00007: El Mundo del Campero - TPV bloqueado
(gen_random_uuid(), 'INC-2026-00007',
 'a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000007', 'El Mundo del Campero',
 'TPV bloqueado por contraseña incorrecta',
 'Cliente ha bloqueado el TPV al introducir mal la contraseña varias veces. Reconfigurado el sistema en otro TPV. Formateado a través de técnico externo.',
 'hardware', 'alta', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/view/1434035/conversation/215472734644692?view=List', '215472734644692', 'Pablo',
 'standard', '2026-01-22 16:00:00+01', '2026-01-21 10:00:00+01', now(), '2026-01-22 16:00:00+01'),

-- INC-2026-00008: La Favorita Burguer - Problema printer
(gen_random_uuid(), 'INC-2026-00008',
 'a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000008', 'La Favorita Burguer',
 'Problema con impresora - fuera de temporada',
 'Problema con la printer resuelto. Ahora mismo no están trabajando porque está fuera de temporada y no la necesitan.',
 'impresora', 'baja', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/conversation/215472753976065?view=List', '215472753976065', 'Marta',
 'standard', '2026-01-26 14:00:00+01', '2026-01-26 09:00:00+01', now(), '2026-01-26 14:00:00+01'),

-- INC-2026-00009: La Esquina del Buen Sabor - TPV pantalla dañada
(gen_random_uuid(), 'INC-2026-00009',
 'a0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000009', 'La Esquina del Buen Sabor',
 'Fallos en TPV por pantalla dañada - sin cobertura garantía',
 'Fabricante informa que al estar dañada la pantalla no tendría cobertura de garantía. Se informa a la clienta. Escalado cerrado.',
 'hardware', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/admin/8601230/conversation/215472654822398?view=List', '215472654822398', 'Claudia',
 'standard', '2026-01-26 15:00:00+01', '2026-01-26 09:30:00+01', now(), '2026-01-26 15:00:00+01'),

-- INC-2026-00010: Restaurante La Parada - Problemas mal tramitados
(gen_random_uuid(), 'INC-2026-00010',
 'a0000001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000010', 'Restaurante La Parada',
 'Múltiples problemas HW mal tramitados anteriormente',
 'Cliente con varios problemas mal tramitados por Tomas. Cogemos el cliente en llamada, investigamos su operativa. Vamos a solucionarle los fallos previos desde nuestro almacén. Necesita envío con recogida impresora USB + WiFi con recogida LAN.',
 'hardware', 'alta', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 NULL, NULL, 'Albert',
 'standard', '2026-02-03 12:00:00+01', '2026-01-26 10:00:00+01', now(), '2026-02-03 12:00:00+01'),

-- INC-2026-00011: Cafeson/Dayma - Sunmis no reconocen impresoras
(gen_random_uuid(), 'INC-2026-00011',
 'a0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000011', 'Cafeson',
 'Sunmis no reconocen impresoras - envío OPAL',
 'Operativa de 3 Sunmi y 2 POS. Dos de las Sunmi han dejado de reconocer las impresoras. Solución: enviar OPAL. OPAL enviado y problema solucionado.',
 'periferico', 'critica', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', 'Sunmi', NULL,
 NULL, NULL, 'Dayma',
 'standard', '2026-02-03 15:00:00+01', '2026-01-27 09:00:00+01', now(), '2026-02-03 15:00:00+01'),

-- INC-2026-00012: Kache Cafe - Cajón portamonedas no abre
(gen_random_uuid(), 'INC-2026-00012',
 'a0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000012', 'Kache Cafe',
 'Cajón portamonedas no abre',
 'Tramitado RMA con Ismael. Problema con el cajón portamonedas que no abre.',
 'periferico', 'media', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'otro', NULL, 'Cajón portamonedas',
 NULL, NULL, 'Ismael',
 'derivado_rma', '2026-02-05 12:00:00+01', '2026-02-03 09:00:00+01', now(), '2026-02-05 12:00:00+01'),

-- INC-2026-00013: La Perla de la Habana - Incidencia CTT
(gen_random_uuid(), 'INC-2026-00013',
 'a0000001-0000-0000-0000-000000000023', 'b0000001-0000-0000-0000-000000000023', 'La Perla de la Habana',
 'Incidencia CTT - paquetes entregados',
 'Tamya, La Perla de la Habana. Incidencia con CTT resuelta, paquetes entregados.',
 'otro', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 'https://app.intercom.com/a/inbox/hckfnffg/inbox/admin/8601230/conversation/215472700952238?view=List', '215472700952238', 'Tamya',
 'standard', '2026-01-22 12:00:00+01', '2026-01-22 09:00:00+01', now(), '2026-01-22 12:00:00+01'),

-- INC-2026-00014: Taquería Los Carnales - Printer perdida CTT
(gen_random_uuid(), 'INC-2026-00014',
 'a0000001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000013', 'Taquería Los Carnales',
 'Impresora perdida en almacenes CTT - enviar sustituta',
 'Printer perdida y reclamada en los almacenes de CTT. Enviamos una impresora mientras se resuelve la incidencia.',
 'impresora', 'alta', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 NULL, NULL, 'Oscar Vargas',
 'standard', '2026-02-12 16:00:00+01', '2026-02-12 09:00:00+01', now(), '2026-02-12 16:00:00+01'),

-- INC-2026-00015: Manhattan Food & Drink - Impresora cocina OPAL
(gen_random_uuid(), 'INC-2026-00015',
 'a0000001-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000020', 'Manhattan Food & Drink',
 'Impresora de cocina sacada del OPAL por soporte',
 'Flor reporta problema con impresora de cocina que soporte había sacado del OPAL. Incidencia 304.',
 'impresora', 'alta', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 NULL, NULL, 'Flor',
 'standard', '2026-02-13 15:00:00+01', '2026-02-13 09:00:00+01', now(), '2026-02-13 15:00:00+01'),

-- INC-2026-00016: Casa de Botes - Envío TPV permanencia 12 meses
(gen_random_uuid(), 'INC-2026-00016',
 'a0000001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000016', 'Casa de Botes',
 'Envío TPV a cambio de permanencia 12 meses',
 'Clienta Maria. Hemos enviado un TPV a cambio de una permanencia de 12 meses con Qamarero.',
 'hardware', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', NULL, NULL,
 NULL, NULL, 'Maria',
 'standard', '2026-02-09 16:00:00+01', '2026-02-09 09:00:00+01', now(), '2026-02-09 16:00:00+01'),

-- INC-2026-00017: Bar Cuatrolatas - Configuración nuevo TPV
(gen_random_uuid(), 'INC-2026-00017',
 'a0000001-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000015', 'Bar Cuatrolatas',
 'Configuración nuevo TPV con 4 impresoras',
 'Jorge tiene problema con la configuración de nuevo TPV que le hemos enviado. Local bastante enrevesado con 4 impresoras. Solucionado en llamada.',
 'hardware', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', NULL, NULL,
 NULL, NULL, 'Jorge',
 'standard', '2026-03-09 16:00:00+01', '2026-03-09 09:00:00+01', now(), '2026-03-09 16:00:00+01'),

-- INC-2026-00018: Bar Santiago - Videovigilancia incompatible IPs
(gen_random_uuid(), 'INC-2026-00018',
 'a0000001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000017', 'Bar Santiago',
 'Sistema videovigilancia incompatible con IPs impresoras',
 'Fran de Bar Santiago tiene problema con sistema de videovigilancia incompatible a la hora de fijar IPs en las impresoras. Solucionado en llamada, 1 hora de incidencia. Fuera de horario.',
 'red', 'alta', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 NULL, NULL, 'Fran',
 'standard', '2026-03-09 18:00:00+01', '2026-03-09 17:00:00+01', now(), '2026-03-09 18:00:00+01'),

-- INC-2026-00019: La Reinventá - Recuperación equipos enviados por error
(gen_random_uuid(), 'INC-2026-00019',
 'a0000001-0000-0000-0000-000000000025', 'b0000001-0000-0000-0000-000000000025', 'La Reinventá',
 'Recuperación de equipos enviados por error',
 'Se enviaron equipos por error al restaurante. Incidencia en proceso de solución: recuperación de los equipos.',
 'otro', 'media', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 NULL, NULL, NULL,
 'standard', '2026-02-20 12:00:00+01', '2026-02-16 09:00:00+01', now(), '2026-02-20 12:00:00+01'),

-- INC-2026-00020: La Bella Caffe Tejeringos - Costes recogida RMA
(gen_random_uuid(), 'INC-2026-00020',
 'a0000001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000019', 'La Bella Caffe Tejeringos',
 'Incidencia costes de recogida - cambio política fabricante',
 'Gestión de incidencia por costes de recogida. Comunicación transparente de cambio de política del fabricante (costes envío ida a cargo del cliente). Caso en seguimiento con finanzas para intentar reembolso. Solicitud de factura a nombre de Qamarero.',
 'otro', 'alta', 'en_gestion',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 NULL, NULL, NULL,
 NULL, NULL, '2026-03-11 09:00:00+01', now(), '2026-03-11 09:00:00+01'),

-- INC-2026-00021: Solopizza - Configuración equipos
(gen_random_uuid(), 'INC-2026-00021',
 'a0000001-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000018', 'Solopizza',
 'Configuración 2 impresoras y 1 TPV',
 'Configuración completada de 2 impresoras y 1 TPV para el local.',
 'hardware', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', NULL, NULL,
 NULL, NULL, NULL,
 'standard', '2026-03-11 16:00:00+01', '2026-03-11 14:00:00+01', now(), '2026-03-11 16:00:00+01'),

-- INC-2026-00022: El Tapeillo - Reconfiguración equipo
(gen_random_uuid(), 'INC-2026-00022',
 'a0000001-0000-0000-0000-000000000029', 'b0000001-0000-0000-0000-000000000029', 'El Tapeillo',
 'Cliente descontento - reconfiguración de equipo',
 'José, algo descontento con la atención de soporte. Tomamos la incidencia y calmamos en llamada. Resolvemos reconfigurando el equipo.',
 'hardware', 'alta', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 NULL, NULL, 'José',
 'standard', '2026-02-18 16:00:00+01', '2026-02-18 09:00:00+01', now(), '2026-02-18 16:00:00+01'),

-- INC-2026-00023: Pilar Palau Cafe - Envío impresora + RMA
(gen_random_uuid(), 'INC-2026-00023',
 'a0000001-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000021', 'Pilar Palau Cafe',
 'Envío impresora de repuesto y tramitación RMA',
 'Preparar envío de impresora a Pilar Palau Cafe. Una vez llegue esa printer vamos a tramitar el RMA con el proveedor.',
 'impresora', 'media', 'resuelto',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 NULL, NULL, 'Pilar',
 'derivado_rma', '2026-01-20 12:00:00+01', '2026-01-08 09:00:00+01', now(), '2026-01-20 12:00:00+01'),

-- INC-2026-00024: BocaFloja Brunch - Impresora averiada
(gen_random_uuid(), 'INC-2026-00024',
 'a0000001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000014', 'BocaFloja Brunch',
 'Impresora averiada - cambio presencial en Sevilla',
 'Cambio de RMA presencial en local en Sevilla. Vamos a llevarle una impresora de aquí, configurarla y traernos la averiada.',
 'impresora', 'alta', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 NULL, NULL, NULL,
 'standard', '2026-03-02 17:00:00+01', '2026-03-02 09:00:00+01', now(), '2026-03-02 17:00:00+01'),

-- INC-2026-00025: Canela en Rama - Config complicada
(gen_random_uuid(), 'INC-2026-00025',
 'a0000001-0000-0000-0000-000000000027', 'b0000001-0000-0000-0000-000000000027', 'Canela en Rama',
 'Configuración complicada - cliente requiere asistencia local',
 'Cliente bastante complicado. No quiere pedir cita en typeform y no quiere montar los equipos sin asistencia de alguien local. Reservada 1 hora.',
 'hardware', 'media', 'en_gestion',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 NULL, NULL, NULL,
 NULL, NULL, '2026-03-02 10:00:00+01', now(), '2026-03-02 10:00:00+01'),

-- INC-2026-00026: Bar de Dalt - Impresora reparada RMA
(gen_random_uuid(), 'INC-2026-00026',
 'a0000001-0000-0000-0000-000000000026', 'b0000001-0000-0000-0000-000000000026', 'Bar de Dalt',
 'Impresora reparada vía RMA - entregada al cliente',
 'La impresora reparada está en posesión del cliente. Escalado/RMA cerrado.',
 'impresora', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, NULL,
 NULL, NULL, NULL,
 'standard', '2026-02-12 15:00:00+01', '2026-02-01 09:00:00+01', now(), '2026-02-12 15:00:00+01'),

-- INC-2026-00027: Sukaldea - Envío recogida TPV + equipos
(gen_random_uuid(), 'INC-2026-00027',
 'a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000006', 'Sukaldea Atotxa',
 'Envío TPV + incidencia recogida CTT',
 'Envío de 1 TPV para Pedro de Sukaldea. Incidencia con CTT: Pedro se niega a entregar los equipos hasta que no venga el repartidor.',
 'hardware', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'tpv', NULL, NULL,
 NULL, NULL, 'Pedro',
 'standard', '2026-02-06 12:00:00+01', '2026-01-29 09:00:00+01', now(), '2026-02-06 12:00:00+01'),

-- INC-2026-00028: Nuevo Baviera - RMA pendiente
(gen_random_uuid(), 'INC-2026-00028',
 'a0000001-0000-0000-0000-000000000028', 'b0000001-0000-0000-0000-000000000028', 'Nuevo Baviera',
 'RMA pendiente de tramitar',
 'Preparar el RMA para Nuevo Baviera. Comprobar la conversación de intercom para tramitarlo. Romer Taranto tiene problemas con la recogida de su RMA.',
 'hardware', 'media', 'en_gestion',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 NULL, NULL, 'Romer Taranto',
 NULL, NULL, '2026-02-20 09:00:00+01', now(), '2026-02-20 09:00:00+01'),

-- INC-2026-00029: La Darsena - Envío y recogida impresora LAN
(gen_random_uuid(), 'INC-2026-00029',
 'a0000001-0000-0000-0000-000000000022', 'b0000001-0000-0000-0000-000000000022', 'La Darsena',
 'Envío y recogida de impresora LAN',
 'Envío y recogida de impresora LAN a La Darsena.',
 'impresora', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', 'impresora', NULL, 'LAN',
 NULL, NULL, NULL,
 'standard', '2026-01-20 16:00:00+01', '2026-01-20 09:00:00+01', now(), '2026-01-20 16:00:00+01'),

-- INC-2026-00030: BEBE tu Birra - Config complicada Win7
(gen_random_uuid(), 'INC-2026-00030',
 'a0000001-0000-0000-0000-000000000024', 'b0000001-0000-0000-0000-000000000024', 'Restaurante BEBE tu Birra',
 'Configuración complicada en Windows 7',
 'Configuración con operativa complicada en Windows 7. Hemos dejado al cliente con todo en funcionamiento.',
 'hardware', 'media', 'cerrado',
 'f478ccf0-3c04-4324-9f24-57ed75c754d7', NULL, NULL, NULL,
 NULL, NULL, NULL,
 'standard', '2026-01-23 12:00:00+01', '2026-01-23 09:00:00+01', now(), '2026-01-23 12:00:00+01');


-- ============================================================
-- 4. RMAS
-- Providers:
--   AQPROX:      e431e944-5bee-4e1f-af8c-bf464af48758
--   GEON:        622e94e1-f667-42ca-8ba0-3b364a405b6b
--   JASSWAY:     6fae4711-4d8d-4c61-a7ca-46c6ee23d18e
--   PC Mira:     39d22962-5749-4dde-a63a-08861ca6649f
--   Pedro Porto: 0531a78f-3f3d-4ab0-9095-c78b2d222d58
--   Posiflex:    57dcac2a-dd77-4c1e-9d48-f9639577945d
-- ============================================================

-- First we need incident IDs for linking. Use a CTE approach won't work with INSERT...
-- We'll use subqueries to look up incident IDs by incident_number.

INSERT INTO hsm.rmas (
  id, rma_number, incident_id, provider_id,
  client_id, client_location_id, client_name,
  status, device_type, device_brand, device_model,
  notes, created_at, updated_at, state_changed_at
) VALUES

-- RMA-2026-00001: Knela Cafe - Impresora reparada
(gen_random_uuid(), 'RMA-2026-00001',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00001'),
 'e431e944-5bee-4e1f-af8c-bf464af48758',  -- AQPROX (asumido)
 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Knela Cafe',
 'cerrado', 'impresora', NULL, NULL,
 'RMA reparado. Impresora recogida del fabricante y enviada al local del cliente.',
 '2026-01-20 10:00:00+01', now(), '2026-01-26 12:00:00+01'),

-- RMA-2026-00002: UMAME Burguer - Posiflex desde oficina
(gen_random_uuid(), 'RMA-2026-00002',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00004'),
 '57dcac2a-dd77-4c1e-9d48-f9639577945d',  -- Posiflex
 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000004', 'UMAME Burguer',
 'cerrado', 'tpv', 'Posiflex', NULL,
 'RMA tramitado desde oficina. Solicitud de RMA rellenada por nosotros en la web de Posiflex. Enviado TPV de repuesto.',
 '2026-01-22 09:00:00+01', now(), '2026-02-10 12:00:00+01'),

-- RMA-2026-00003: Caffetin Las Francesas - Pedro Porto
(gen_random_uuid(), 'RMA-2026-00003',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00005'),
 '0531a78f-3f3d-4ab0-9095-c78b2d222d58',  -- Pedro Porto
 'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000005', 'Caffetin Las Francesas',
 'en_proveedor', NULL, NULL, NULL,
 'RMA solicitado a Pedro Porto. A la espera de la contestación del proveedor.',
 '2026-01-21 10:00:00+01', now(), '2026-01-21 10:00:00+01'),

-- RMA-2026-00004: Bar L'encontre - Recogida impresora
(gen_random_uuid(), 'RMA-2026-00004',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00002'),
 'e431e944-5bee-4e1f-af8c-bf464af48758',  -- AQPROX (asumido)
 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'Bar L''encontre',
 'cerrado', 'impresora', NULL, NULL,
 'Recogida de impresora tramitada en el local del cliente.',
 '2026-01-21 10:00:00+01', now(), '2026-02-06 12:00:00+01'),

-- RMA-2026-00005: Kache Cafe - Cajón portamonedas
(gen_random_uuid(), 'RMA-2026-00005',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00012'),
 '0531a78f-3f3d-4ab0-9095-c78b2d222d58',  -- Pedro Porto (asumido)
 'a0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000012', 'Kache Cafe',
 'en_proveedor', 'otro', NULL, 'Cajón portamonedas',
 'Cajón portamonedas no abre. RMA tramitado.',
 '2026-02-03 10:00:00+01', now(), '2026-02-03 10:00:00+01'),

-- RMA-2026-00006: Bar de Dalt - Impresora reparada
(gen_random_uuid(), 'RMA-2026-00006',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00026'),
 'e431e944-5bee-4e1f-af8c-bf464af48758',  -- AQPROX (asumido)
 'a0000001-0000-0000-0000-000000000026', 'b0000001-0000-0000-0000-000000000026', 'Bar de Dalt',
 'cerrado', 'impresora', NULL, NULL,
 'Impresora reparada. En posesión del cliente.',
 '2026-02-01 10:00:00+01', now(), '2026-02-12 15:00:00+01'),

-- RMA-2026-00007: Pilar Palau Cafe - Impresora
(gen_random_uuid(), 'RMA-2026-00007',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00023'),
 'e431e944-5bee-4e1f-af8c-bf464af48758',  -- AQPROX (asumido)
 'a0000001-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000021', 'Pilar Palau Cafe',
 'cerrado', 'impresora', NULL, NULL,
 'Enviada impresora de repuesto al cliente. RMA tramitado con proveedor.',
 '2026-01-08 10:00:00+01', now(), '2026-01-20 12:00:00+01'),

-- RMA-2026-00008: BocaFloja Brunch - Cambio presencial
(gen_random_uuid(), 'RMA-2026-00008',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00024'),
 'e431e944-5bee-4e1f-af8c-bf464af48758',  -- AQPROX (asumido)
 'a0000001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000014', 'BocaFloja Brunch',
 'cerrado', 'impresora', NULL, NULL,
 'Cambio de impresora presencial en local de Sevilla. Llevada impresora nueva, configurada y recogida la averiada.',
 '2026-03-02 09:30:00+01', now(), '2026-03-02 17:00:00+01'),

-- RMA-2026-00009: Restaurante La Parada - Lío impresoras
(gen_random_uuid(), 'RMA-2026-00009',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00010'),
 '0531a78f-3f3d-4ab0-9095-c78b2d222d58',  -- Pedro Porto (asumido)
 'a0000001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000010', 'Restaurante La Parada',
 'cerrado', 'impresora', NULL, NULL,
 'Lío de impresoras que venía desde Tomy. Incidencia en la recogida con CTT. Envío con recogida impresora USB + WiFi con recogida LAN.',
 '2026-01-29 09:00:00+01', now(), '2026-02-03 12:00:00+01'),

-- RMA-2026-00010: Nuevo Baviera - Pendiente de tramitar
(gen_random_uuid(), 'RMA-2026-00010',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00028'),
 '0531a78f-3f3d-4ab0-9095-c78b2d222d58',  -- Pedro Porto (asumido)
 'a0000001-0000-0000-0000-000000000028', 'b0000001-0000-0000-0000-000000000028', 'Nuevo Baviera',
 'borrador', NULL, NULL, NULL,
 'RMA pendiente de tramitar. Comprobar conversación de Intercom. Romer Taranto tiene problemas con la recogida.',
 '2026-02-20 10:00:00+01', now(), '2026-02-20 10:00:00+01'),

-- RMA-2026-00011: Jassway batch (5 tickets de soporte)
(gen_random_uuid(), 'RMA-2026-00011',
 NULL,
 '6fae4711-4d8d-4c61-a7ca-46c6ee23d18e',  -- JASSWAY
 NULL, NULL, NULL,
 'en_proveedor', 'impresora', 'JASSWAY', NULL,
 'Batch de 5 tickets Jassway: #001057, #001058, #001059, #001060, #001061. Diagnóstico completo por serie. Incluye 1 caso fuera de garantía (conector ennegrecido + cucarachas).',
 '2026-03-11 09:00:00+01', now(), '2026-03-11 09:00:00+01'),

-- RMA-2026-00012: Pedro Porto batch (9 RMA tramitados en bloque)
(gen_random_uuid(), 'RMA-2026-00012',
 NULL,
 '0531a78f-3f3d-4ab0-9095-c78b2d222d58',  -- Pedro Porto
 NULL, NULL, NULL,
 'enviado_proveedor', NULL, NULL, NULL,
 'Batch de 9 RMA tramitados con Pedro Porto de la pila de devoluciones. Enviado correo para tramitarlos en bloque.',
 '2026-02-05 09:00:00+01', now(), '2026-02-05 09:00:00+01'),

-- RMA-2026-00013: La Bella Caffe Tejeringos - Costes recogida
(gen_random_uuid(), 'RMA-2026-00013',
 (SELECT id FROM hsm.incidents WHERE incident_number = 'INC-2026-00020'),
 '6fae4711-4d8d-4c61-a7ca-46c6ee23d18e',  -- JASSWAY (asumido, por ser fabricante)
 'a0000001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000019', 'La Bella Caffe Tejeringos',
 'solicitado', NULL, NULL, NULL,
 'Incidencia por costes de recogida. Cambio de política del fabricante: costes de envío de ida a cargo del cliente. En seguimiento con finanzas para reembolso.',
 '2026-03-11 10:00:00+01', now(), '2026-03-11 10:00:00+01');


-- ============================================================
-- 5. UPDATE SEQUENCES
-- We inserted 30 incidents and 13 RMAs
-- ============================================================

UPDATE hsm.sequences SET last_value = 30 WHERE prefix = 'INC' AND year = 2026;
UPDATE hsm.sequences SET last_value = 13 WHERE prefix = 'RMA' AND year = 2026;


-- ============================================================
-- 6. VERIFICATION QUERIES (run after to confirm)
-- ============================================================

-- SELECT count(*) as total_clients FROM hsm.clients;
-- SELECT count(*) as total_locations FROM hsm.client_locations;
-- SELECT count(*) as total_incidents FROM hsm.incidents;
-- SELECT count(*) as total_rmas FROM hsm.rmas;
-- SELECT * FROM hsm.sequences;
