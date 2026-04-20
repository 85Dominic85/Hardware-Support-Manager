-- 009: Add hardware_origin enum and column to incidents.
--
-- Marca si el hardware es de Qamarero o reciclado del cliente, para extraer
-- métricas de fallos por origen. Campo obligatorio al crear una incidencia
-- desde la app (Zod); la columna es nullable para no romper registros legacy
-- (aparecerán como "—" en la UI hasta que se editen).
--
-- Run as `postgres` in Supabase SQL Editor.

-- 1. Create enum type
CREATE TYPE hsm.hardware_origin AS ENUM ('qamarero', 'cliente_reciclado');

-- 2. Add column (nullable; Zod fuerza el valor en nuevas incidencias)
ALTER TABLE hsm.incidents ADD COLUMN hardware_origin hsm.hardware_origin;
