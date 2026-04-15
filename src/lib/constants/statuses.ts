/**
 * Centralized status group constants.
 *
 * Used across server queries, actions, and UI components to filter
 * incidents and RMAs by lifecycle stage. Defined once here to prevent
 * divergent copies.
 */

/** Incident statuses that represent a closed/finished lifecycle. */
export const CLOSED_INCIDENT_STATUSES = ["resuelto", "cerrado", "cancelado"] as const;

/** RMA statuses that represent a closed/finished lifecycle. */
export const CLOSED_RMA_STATUSES = ["recibido_oficina", "cerrado", "cancelado"] as const;

/** Incident statuses where the SLA clock is paused (waiting on external party). */
export const PAUSED_INCIDENT_STATES = ["esperando_cliente", "esperando_proveedor"] as const;

/** RMA statuses where the device is in the warehouse/office (not with provider). */
export const WAREHOUSE_RMA_STATUSES = ["borrador", "aprobado", "recibido_oficina"] as const;
