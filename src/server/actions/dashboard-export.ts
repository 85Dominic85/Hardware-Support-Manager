"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import {
  getDashboardStats,
  getSlaMetrics,
  getIncidentTrend,
  getIncidentStatusDistribution,
  getAgingDistribution,
  getTechnicianPerformance,
  type DateRangeParams,
} from "@/server/queries/dashboard";
import { INCIDENT_STATUS_LABELS, type IncidentStatus } from "@/lib/constants/incidents";

export interface DashboardExportData {
  stats: { label: string; value: string | number }[];
  trend: { date: string; count: number }[];
  distribution: { status: string; count: number }[];
  aging: { bucket: string; count: number }[];
  technicians: { name: string; resolved: number; avgHours: number | null }[];
}

export async function fetchDashboardExportData(
  range?: DateRangeParams
): Promise<DashboardExportData> {
  await getRequiredSession();

  const [stats, sla, trend, distribution, aging, technicians] = await Promise.all([
    getDashboardStats(range),
    getSlaMetrics(range),
    getIncidentTrend(range),
    getIncidentStatusDistribution(range),
    getAgingDistribution(range),
    getTechnicianPerformance(range),
  ]);

  return {
    stats: [
      { label: "Incidencias Abiertas", value: stats.openIncidents },
      { label: "RMAs Activos", value: stats.activeRmas },
      { label: "SLA Cumplido (%)", value: sla.slaCompliancePercent },
      { label: "Resolución Media (h)", value: sla.avgResolutionHours ?? "-" },
      { label: "Fuera de SLA", value: sla.overdueCount },
      { label: "Tasa Reapertura (%)", value: sla.reopenRate },
      { label: "Turnaround RMA (días)", value: sla.avgRmaTurnaroundDays ?? "-" },
    ],
    trend,
    distribution: distribution.map((d) => ({
      status: INCIDENT_STATUS_LABELS[d.status as IncidentStatus] ?? d.status,
      count: d.count,
    })),
    aging,
    technicians,
  };
}
