import type { Metadata } from "next";
import {
  getDashboardStats,
  getSlaMetrics,
  getQuickConsultationsStats,
} from "@/server/queries/dashboard";
import { getAlertItems } from "@/server/queries/alerts";
import { getSlaThresholds, getAlertThresholds } from "@/server/queries/settings";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de Control",
};

export default async function DashboardPage() {
  // Prefetch settings once (2 queries), then reuse for all downstream queries.
  // This avoids 3 redundant settings fetches that previously happened inside each query.
  const [slaThresholds, alertThresholds] = await Promise.all([
    getSlaThresholds(),
    getAlertThresholds(),
  ]);

  // Only await critical KPI data server-side for instant page render.
  // Charts and activity data load client-side via TanStack Query.
  const [stats, sla, alerts, quickConsultations] = await Promise.all([
    getDashboardStats().catch(() => ({ openIncidents: 0, activeRmas: 0, totalProviders: 0 })),
    getSlaMetrics(undefined, slaThresholds).catch(() => ({ avgResolutionHours: null, slaCompliancePercent: 100, overdueCount: 0, reopenRate: 0, avgRmaTurnaroundDays: null, incidentsByPriority: [] })),
    getAlertItems(alertThresholds, slaThresholds).catch(() => ({ totalCount: 0, items: [], counts: { staleIncidents: 0, stuckRmas: 0, warehouseRmas: 0, slaWarnings: 0 } })),
    getQuickConsultationsStats().catch(() => ({ count: 0, totalMinutes: 0, avgMinutes: null, byTechnician: [], conversionRatePct: 0 })),
  ]);

  return (
    <DashboardContent
      initialStats={stats}
      initialSla={sla}
      initialAlerts={alerts}
      initialQuickConsultations={quickConsultations}
    />
  );
}
