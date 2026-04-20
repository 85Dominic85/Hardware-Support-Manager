export const INCIDENT_STATUSES = {
  NUEVO: "nuevo",
  EN_TRIAJE: "en_triaje",
  EN_GESTION: "en_gestion",
  ESPERANDO_CLIENTE: "esperando_cliente",
  ESPERANDO_PROVEEDOR: "esperando_proveedor",
  RESUELTO: "resuelto",
  CERRADO: "cerrado",
  CANCELADO: "cancelado",
} as const;

export type IncidentStatus = (typeof INCIDENT_STATUSES)[keyof typeof INCIDENT_STATUSES];

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  nuevo: "Nuevo",
  en_triaje: "En Triaje",
  en_gestion: "En Gestión",
  esperando_cliente: "Esperando Cliente",
  esperando_proveedor: "Esperando Proveedor",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
  cancelado: "Cancelado",
};

export const INCIDENT_PRIORITIES = {
  BAJA: "baja",
  MEDIA: "media",
  ALTA: "alta",
  CRITICA: "critica",
} as const;

export type IncidentPriority = (typeof INCIDENT_PRIORITIES)[keyof typeof INCIDENT_PRIORITIES];

export const INCIDENT_PRIORITY_LABELS: Record<IncidentPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

export const INCIDENT_CATEGORIES = {
  ESCALADO: "escalado",
  INCIDENCIA_DIRECTA: "incidencia_directa",
  MENCION: "mencion",
  OTRO: "otro",
} as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[keyof typeof INCIDENT_CATEGORIES];

export const INCIDENT_CATEGORY_LABELS: Record<IncidentCategory, string> = {
  escalado: "Escalado",
  incidencia_directa: "Incidencia directa",
  mencion: "Mención",
  otro: "Otro",
};
