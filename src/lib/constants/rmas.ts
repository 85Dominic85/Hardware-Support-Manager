export const RMA_STATUSES = {
  BORRADOR: "borrador",
  SOLICITADO: "solicitado",
  APROBADO: "aprobado",
  ENVIADO_PROVEEDOR: "enviado_proveedor",
  EN_PROVEEDOR: "en_proveedor",
  DEVUELTO: "devuelto",
  RECIBIDO_OFICINA: "recibido_oficina",
  CERRADO: "cerrado",
  CANCELADO: "cancelado",
} as const;

export type RmaStatus = (typeof RMA_STATUSES)[keyof typeof RMA_STATUSES];

export const RMA_STATUS_LABELS: Record<RmaStatus, string> = {
  borrador: "Borrador",
  solicitado: "Solicitado",
  aprobado: "Aprobado por Proveedor",
  enviado_proveedor: "Enviado a Proveedor",
  en_proveedor: "En Proveedor",
  devuelto: "Devuelto",
  recibido_oficina: "Recibido en Oficina",
  cerrado: "Cerrado",
  cancelado: "Cancelado",
};
