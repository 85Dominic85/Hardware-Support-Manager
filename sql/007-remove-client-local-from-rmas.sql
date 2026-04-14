-- 007: Remove client_local column from rmas table
-- This field is redundant — location info comes from client_locations via clientLocationId

ALTER TABLE hsm.rmas DROP COLUMN IF EXISTS client_local;
