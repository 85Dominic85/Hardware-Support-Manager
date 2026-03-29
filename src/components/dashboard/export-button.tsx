"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { fetchDashboardExportData } from "@/server/actions/dashboard-export";
import { generateCSV, downloadCSV } from "@/lib/utils/csv-export";
import type { DateRangeParams } from "@/hooks/use-dashboard-params";

interface ExportButtonProps {
  dateRange: DateRangeParams;
}

export function ExportButton({ dateRange }: ExportButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const handleExport = async () => {
    setState("loading");
    try {
      const data = await fetchDashboardExportData(dateRange);

      // Build CSV sections
      const sections: string[] = [];

      // KPI Summary
      const kpiCSV = generateCSV(
        ["Métrica", "Valor"],
        data.stats.map((s) => [s.label, s.value])
      );
      sections.push("=== RESUMEN KPIs ===\r\n" + kpiCSV);

      // Trend
      if (data.trend.length > 0) {
        const trendCSV = generateCSV(
          ["Fecha", "Incidencias"],
          data.trend.map((t) => [t.date, t.count])
        );
        sections.push("\r\n=== TENDENCIA ===\r\n" + trendCSV);
      }

      // Distribution
      if (data.distribution.length > 0) {
        const distCSV = generateCSV(
          ["Estado", "Cantidad"],
          data.distribution.map((d) => [d.status, d.count])
        );
        sections.push("\r\n=== DISTRIBUCIÓN POR ESTADO ===\r\n" + distCSV);
      }

      // Aging
      if (data.aging.length > 0) {
        const agingCSV = generateCSV(
          ["Rango", "Cantidad"],
          data.aging.map((a) => [a.bucket, a.count])
        );
        sections.push("\r\n=== ANTIGÜEDAD ===\r\n" + agingCSV);
      }

      // Technicians
      if (data.technicians.length > 0) {
        const techCSV = generateCSV(
          ["Técnico", "Resueltas", "Promedio (h)"],
          data.technicians.map((t) => [t.name, t.resolved, t.avgHours ?? "-"])
        );
        sections.push("\r\n=== RENDIMIENTO TÉCNICOS ===\r\n" + techCSV);
      }

      const rangeStr = dateRange.dateFrom && dateRange.dateTo
        ? `_${dateRange.dateFrom}_${dateRange.dateTo}`
        : "";
      const filename = `dashboard${rangeStr}_${new Date().toISOString().split("T")[0]}.csv`;

      downloadCSV(sections.join("\r\n"), filename);

      setState("success");
      toast.success("Exportación completada");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
      toast.error("Error al exportar datos");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={state === "loading"}
      className="gap-1.5"
    >
      {state === "loading" ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : state === "success" ? (
        <Check
          className="size-3.5 text-emerald-500"
          style={{
            animation: "zoom-in-97 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        />
      ) : (
        <Download className="size-3.5" />
      )}
      Exportar CSV
    </Button>
  );
}
