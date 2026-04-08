"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import type { CostSummary } from "@/server/queries/analytics";

interface Props {
  summary?: CostSummary;
}

export function CostPlaceholder({ summary }: Props) {
  const hasData = summary && (
    summary.totalDeviceValue !== null ||
    summary.totalRepairCost !== null ||
    summary.totalShippingCost !== null ||
    summary.totalReplacementCost !== null
  );

  if (hasData && summary) {
    const fmt = (cents: number | null) =>
      cents != null ? `${(cents / 100).toLocaleString("es-ES", { minimumFractionDigits: 2 })} EUR` : "—";

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Valor dispositivos", value: fmt(summary.totalDeviceValue) },
          { label: "Coste reparaciones", value: fmt(summary.totalRepairCost) },
          { label: "Coste envíos", value: fmt(summary.totalShippingCost) },
          { label: "Coste sustituciones", value: fmt(summary.totalReplacementCost) },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
        <CircleDollarSign className="h-12 w-12 text-muted-foreground/30" />
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Datos de costes pendientes
          </p>
          <p className="text-xs text-muted-foreground/70 max-w-md">
            Los datos de costes se mostrarán aquí cuando se registren en los formularios de RMA.
            La estructura está preparada para valor del dispositivo, coste de reparación, envío y sustitución.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
