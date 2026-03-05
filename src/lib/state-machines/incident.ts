import type { IncidentStatus } from "@/lib/constants/incidents";
import type { UserRole } from "@/lib/constants/roles";

export interface StateTransition {
  from: IncidentStatus;
  to: IncidentStatus;
  label: string;
  requiredRole: UserRole[];
}

export const INCIDENT_TRANSITIONS: StateTransition[] = [
  // From nuevo
  { from: "nuevo", to: "en_triaje", label: "Iniciar Triaje", requiredRole: ["admin", "technician"] },
  { from: "nuevo", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From en_triaje
  { from: "en_triaje", to: "en_diagnostico", label: "Iniciar Diagnóstico", requiredRole: ["admin", "technician"] },
  { from: "en_triaje", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From en_diagnostico
  { from: "en_diagnostico", to: "esperando_repuesto", label: "Solicitar Repuesto", requiredRole: ["admin", "technician"] },
  { from: "en_diagnostico", to: "en_reparacion", label: "Iniciar Reparación", requiredRole: ["admin", "technician"] },
  { from: "en_diagnostico", to: "esperando_cliente", label: "Esperar Cliente", requiredRole: ["admin", "technician"] },
  { from: "en_diagnostico", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From esperando_repuesto
  { from: "esperando_repuesto", to: "en_reparacion", label: "Repuesto Recibido", requiredRole: ["admin", "technician"] },
  { from: "esperando_repuesto", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From en_reparacion
  { from: "en_reparacion", to: "esperando_cliente", label: "Esperar Cliente", requiredRole: ["admin", "technician"] },
  { from: "en_reparacion", to: "resuelto", label: "Marcar Resuelto", requiredRole: ["admin", "technician"] },
  { from: "en_reparacion", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From esperando_cliente
  { from: "esperando_cliente", to: "en_reparacion", label: "Reanudar Reparación", requiredRole: ["admin", "technician"] },
  { from: "esperando_cliente", to: "resuelto", label: "Marcar Resuelto", requiredRole: ["admin", "technician"] },
  { from: "esperando_cliente", to: "cancelado", label: "Cancelar", requiredRole: ["admin"] },
  // From resuelto
  { from: "resuelto", to: "cerrado", label: "Cerrar", requiredRole: ["admin", "technician"] },
  { from: "resuelto", to: "en_diagnostico", label: "Reabrir", requiredRole: ["admin"] },
];

export function getAvailableTransitions(
  currentStatus: IncidentStatus,
  userRole: UserRole
): StateTransition[] {
  return INCIDENT_TRANSITIONS.filter(
    (t) => t.from === currentStatus && t.requiredRole.includes(userRole)
  );
}

export function isValidTransition(
  from: IncidentStatus,
  to: IncidentStatus,
  userRole: UserRole
): boolean {
  return INCIDENT_TRANSITIONS.some(
    (t) => t.from === from && t.to === to && t.requiredRole.includes(userRole)
  );
}
