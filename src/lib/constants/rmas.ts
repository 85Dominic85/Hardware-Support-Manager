export const RMA_STATUSES = {
  BORRADOR: "borrador",
  SOLICITADO: "solicitado",
  APROBADO_PROVEEDOR: "aprobado_proveedor",
  ENVIADO_PROVEEDOR: "enviado_proveedor",
  RECIBIDO_PROVEEDOR: "recibido_proveedor",
  EN_REPARACION_PROVEEDOR: "en_reparacion_proveedor",
  DEVUELTO: "devuelto",
  RECIBIDO_ALMACEN: "recibido_almacen",
  CERRADO: "cerrado",
  CANCELADO: "cancelado",
} as const;

export type RmaStatus = (typeof RMA_STATUSES)[keyof typeof RMA_STATUSES];

export const RMA_STATUS_LABELS: Record<RmaStatus, string> = {
  borrador: "Borrador",
  solicitado: "Solicitado",
  aprobado_proveedor: "Aprobado por Proveedor",
  enviado_proveedor: "Enviado a Proveedor",
  recibido_proveedor: "Recibido por Proveedor",
  en_reparacion_proveedor: "En Reparación (Proveedor)",
  devuelto: "Devuelto",
  recibido_almacen: "Recibido en Almacén",
  cerrado: "Cerrado",
  cancelado: "Cancelado",
};
