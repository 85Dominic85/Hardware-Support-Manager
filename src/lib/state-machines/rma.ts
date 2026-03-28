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
  { from: "solicitado", to: "aprobado", label: "Proveedor Aprueba", requiredRole: ["admin", "technician"] },
  { from: "solicitado", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From aprobado
  { from: "aprobado", to: "enviado_proveedor", label: "Marcar Enviado", requiredRole: ["admin", "technician"] },
  { from: "aprobado", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From enviado_proveedor
  { from: "enviado_proveedor", to: "en_proveedor", label: "Proveedor Recibe", requiredRole: ["admin", "technician"] },
  // From en_proveedor
  { from: "en_proveedor", to: "devuelto", label: "Proveedor Devuelve", requiredRole: ["admin", "technician"] },
  // From devuelto
  { from: "devuelto", to: "recibido_oficina", label: "Recibido en Oficina", requiredRole: ["admin", "technician"] },
  // From recibido_oficina
  { from: "recibido_oficina", to: "cerrado", label: "Cerrar RMA", requiredRole: ["admin", "technician"] },
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
