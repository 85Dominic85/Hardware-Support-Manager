import { Badge } from "@/components/ui/badge";
import { INCIDENT_STATUS_LABELS, type IncidentStatus } from "@/lib/constants/incidents";
import { RMA_STATUS_LABELS, type RmaStatus } from "@/lib/constants/rmas";

const INCIDENT_STATUS_COLORS: Record<IncidentStatus, string> = {
  nuevo: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  en_triaje: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  en_diagnostico: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  esperando_repuesto: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  en_reparacion: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  esperando_cliente: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  resuelto: "bg-green-100 text-green-800 hover:bg-green-100",
  cerrado: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  cancelado: "bg-red-100 text-red-800 hover:bg-red-100",
};

const RMA_STATUS_COLORS: Record<RmaStatus, string> = {
  borrador: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  solicitado: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  aprobado_proveedor: "bg-green-100 text-green-800 hover:bg-green-100",
  enviado_proveedor: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  recibido_proveedor: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  en_reparacion_proveedor: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  devuelto: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  recibido_almacen: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  cerrado: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  cancelado: "bg-red-100 text-red-800 hover:bg-red-100",
};

interface IncidentStateBadgeProps {
  status: IncidentStatus;
}

export function IncidentStateBadge({ status }: IncidentStateBadgeProps) {
  return (
    <Badge variant="outline" className={INCIDENT_STATUS_COLORS[status]}>
      {INCIDENT_STATUS_LABELS[status]}
    </Badge>
  );
}

interface RmaStateBadgeProps {
  status: RmaStatus;
}

export function RmaStateBadge({ status }: RmaStateBadgeProps) {
  return (
    <Badge variant="outline" className={RMA_STATUS_COLORS[status]}>
      {RMA_STATUS_LABELS[status]}
    </Badge>
  );
}
