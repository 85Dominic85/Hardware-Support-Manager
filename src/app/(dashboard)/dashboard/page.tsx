import type { Metadata } from "next";
import {
  getDashboardStats,
  getRecentActivity,
  getIncidentStatusDistribution,
  getIncidentTrend,
  getSlaMetrics,
  getAgingDistribution,
  getTechnicianPerformance,
} from "@/server/queries/dashboard";
import { getAlertItems } from "@/server/queries/alerts";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de Control",
};

export default async function DashboardPage() {
  const withTimeout = <T,>(promise: Promise<T>, fallback: T, ms = 10000): Promise<T> =>
    Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);

  const [stats, activity, distribution, trend, sla, aging, technicians, alerts] =
    await Promise.all([
      withTimeout(getDashboardStats(), { openIncidents: 0, activeRmas: 0, totalProviders: 0 }),
      withTimeout(getRecentActivity(), []),
      withTimeout(getIncidentStatusDistribution(), []),
      withTimeout(getIncidentTrend(), []),
      withTimeout(getSlaMetrics(), { avgResolutionHours: null, slaCompliancePercent: 100, overdueCount: 0, reopenRate: 0, avgRmaTurnaroundDays: null, incidentsByPriority: [] }),
      withTimeout(getAgingDistribution(), []),
      withTimeout(getTechnicianPerformance(), []),
      withTimeout(getAlertItems(), { totalCount: 0, items: [], counts: { staleIncidents: 0, stuckRmas: 0, warehouseRmas: 0, slaWarnings: 0 } }),
    ]);

  return (
    <DashboardContent
      initialStats={stats}
      initialSla={sla}
      initialTrend={trend}
      initialDistribution={distribution}
      initialAging={aging}
      initialTechnicians={technicians}
      initialActivity={activity}
      initialAlerts={alerts}
    />
  );
}
