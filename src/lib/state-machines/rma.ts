import type { RmaStatus } from "@/lib/constants/rmas";
import type { UserRole } from "@/lib/constants/roles";

export interface RmaStateTransition {
  from: RmaStatus;
  to: RmaStatus;
  label: string;
  requiredRole: UserRole[];
}

export const RMA_TRANSITIONS: RmaStateTransition[] = [
  // From borrador
  { from: "borrador", to: "solicitado", label: "Enviar Solicitud", requiredRole: ["admin", "technician"] },
  { from: "borrador", to: "cancelado", label: "Cancelar", requiredRole: ["admin", "technician"] },
  // From solicitado
  { from: "solicitado", to: "aprobado_proveedor", label: "Proveedor Aprueba", requiredRole: ["admin", "technician"] },
  { from: "solicitado", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From aprobado_proveedor
  { from: "aprobado_proveedor", to: "enviado_proveedor", label: "Marcar Enviado", requiredRole: ["admin", "technician"] },
  { from: "aprobado_proveedor", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From enviado_proveedor
  { from: "enviado_proveedor", to: "recibido_proveedor", label: "Proveedor Recibe", requiredRole: ["admin", "technician"] },
  // From recibido_proveedor
  { from: "recibido_proveedor", to: "en_reparacion_proveedor", label: "En Reparación", requiredRole: ["admin", "technician"] },
  // From en_reparacion_proveedor
  { from: "en_reparacion_proveedor", to: "devuelto", label: "Marcar Devuelto", requiredRole: ["admin", "technician"] },
  // From devuelto
  { from: "devuelto", to: "recibido_almacen", label: "Recibido en Almacén", requiredRole: ["admin", "technician"] },
  // From recibido_almacen
  { from: "recibido_almacen", to: "cerrado", label: "Cerrar RMA", requiredRole: ["admin", "technician"] },
];

export function getRmaAvailableTransitions(
  currentStatus: RmaStatus,
  userRole: UserRole
): RmaStateTransition[] {
  return RMA_TRANSITIONS.filter(
    (t) => t.from === currentStatus && t.requiredRole.includes(userRole)
  );
}

export function isValidRmaTransition(
  from: RmaStatus,
  to: RmaStatus,
  userRole: UserRole
): boolean {
  return RMA_TRANSITIONS.some(
    (t) => t.from === from && t.to === to && t.requiredRole.includes(userRole)
  );
}
