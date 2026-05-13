export const TEMPLATE_CATEGORY_LABELS: Record<string, string> = {
  cliente: "Cliente",
  proveedor: "Proveedor",
};

export type TemplateCategory = "cliente" | "proveedor";

/** Variables available when rendering a template from an incident context */
export const INCIDENT_TEMPLATE_VARIABLES = [
  { key: "incidentNumber", label: "Nº incidencia" },
  { key: "title", label: "Título" },
  { key: "description", label: "Descripción" },
  { key: "status", label: "Estado" },
  { key: "category", label: "Categoría" },
  { key: "hardwareOrigin", label: "Origen hardware" },
  { key: "priority", label: "Prioridad" },
  { key: "clientName", label: "Cliente" },
  { key: "assignedUserName", label: "Asignado a" },
  { key: "deviceType", label: "Tipo dispositivo" },
  { key: "deviceBrand", label: "Marca" },
  { key: "deviceModel", label: "Modelo" },
  { key: "deviceSerialNumber", label: "Nº serie" },
  { key: "intercomUrl", label: "URL Intercom" },
  { key: "intercomEscalationId", label: "ID Escalación" },
  { key: "contactName", label: "Contacto" },
  { key: "contactPhone", label: "Teléfono contacto" },
  { key: "pickupAddress", label: "Dirección recogida" },
  { key: "pickupCity", label: "Ciudad recogida" },
  { key: "pickupPostalCode", label: "CP recogida" },
] as const;

/**
 * Variables available when rendering a template from an RMA context.
 * Includes all incident variables (heredadas porque el RMA se vincula a una
 * incidencia y mergeamos su contexto) + campos propios del RMA.
 */
export const RMA_TEMPLATE_VARIABLES = [
  ...INCIDENT_TEMPLATE_VARIABLES,
  { key: "rmaNumber", label: "Nº RMA" },
  { key: "providerName", label: "Proveedor" },
  { key: "providerRmaNumber", label: "Nº RMA proveedor" },
  { key: "trackingNumberOutgoing", label: "Tracking envío" },
  { key: "trackingNumberReturn", label: "Tracking devolución" },
] as const;

/** All known variables (union of both contexts) — used in template form */
export const ALL_TEMPLATE_VARIABLES = RMA_TEMPLATE_VARIABLES;

/**
 * Render a template body/subject by replacing `{{variable}}` placeholders
 * with values from the provided context.
 *
 * Behaviour:
 * - If `key` exists in context (even with empty string): substitute → user
 *   sees real value or empty (legitimate case: data not yet captured, e.g.
 *   tracking number before shipping).
 * - If `key` is NOT in context: preserve `{{key}}` literal so the user can
 *   see at preview time that a variable is missing and react. Avoids the
 *   silent data loss that happens when typo'd or out-of-context variables
 *   render as empty.
 */
export function renderTemplate(
  template: string,
  context: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (key in context) return context[key] ?? "";
    return `{{${key}}}`;
  });
}
