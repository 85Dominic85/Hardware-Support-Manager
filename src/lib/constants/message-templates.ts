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

/** Variables available when rendering a template from an RMA context */
export const RMA_TEMPLATE_VARIABLES = [
  ...INCIDENT_TEMPLATE_VARIABLES,
  { key: "rmaNumber", label: "Nº RMA" },
  { key: "providerName", label: "Proveedor" },
  { key: "providerRmaNumber", label: "Nº RMA proveedor" },
  { key: "trackingNumberOutgoing", label: "Tracking envío" },
  { key: "trackingNumberReturn", label: "Tracking devolución" },
  { key: "clientLocal", label: "Local" },
  { key: "address", label: "Dirección" },
  { key: "postalCode", label: "Código postal" },
  { key: "city", label: "Ciudad" },
  { key: "phone", label: "Teléfono" },
] as const;

/** All known variables (union of both contexts) — used in template form */
export const ALL_TEMPLATE_VARIABLES = RMA_TEMPLATE_VARIABLES;

/**
 * Render a template body/subject by replacing `{{variable}}` placeholders
 * with values from the provided context.
 */
export function renderTemplate(
  template: string,
  context: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => context[key] || "");
}
