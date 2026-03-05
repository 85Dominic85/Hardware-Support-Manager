"use client";

import { CanvasView } from "@/components/shared/canvas-view";
import { EntityCard } from "@/components/shared/entity-card";
import { RMA_STATUS_LABELS, type RmaStatus } from "@/lib/constants/rmas";
import type { RmaRow } from "@/server/queries/rmas";

interface RmaCanvasProps {
  data: RmaRow[];
}

const ACTIVE_STATUSES: RmaStatus[] = [
  "borrador",
  "solicitado",
  "aprobado_proveedor",
  "enviado_proveedor",
  "recibido_proveedor",
  "en_reparacion_proveedor",
  "devuelto",
  "recibido_almacen",
];

const STATUS_COLORS: Record<string, string> = {
  borrador: "#6b7280",
  solicitado: "#3b82f6",
  aprobado_proveedor: "#22c55e",
  enviado_proveedor: "#6366f1",
  recibido_proveedor: "#a855f7",
  en_reparacion_proveedor: "#f97316",
  devuelto: "#eab308",
  recibido_almacen: "#14b8a6",
};

export function RmaCanvas({ data }: RmaCanvasProps) {
  const columns = ACTIVE_STATUSES.map((status) => {
    const items = data
      .filter((rma) => rma.status === status)
      .map((rma) => {
        const deviceInfo = [rma.deviceBrand, rma.deviceModel].filter(Boolean).join(" ");
        return (
          <EntityCard
            key={rma.id}
            number={rma.rmaNumber}
            href={`/rmas/${rma.id}`}
            title={deviceInfo || "Sin dispositivo"}
            stateChangedAt={rma.stateChangedAt}
            relatedEntity={rma.providerName}
            relatedEntityIcon="building"
          />
        );
      });

    return {
      id: status,
      label: RMA_STATUS_LABELS[status],
      color: STATUS_COLORS[status] ?? "#6b7280",
      items,
    };
  });

  return <CanvasView columns={columns} />;
}
