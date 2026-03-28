import type { Metadata } from "next";
import {
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Clock,
  AlertOctagon,
  RefreshCcw,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { IncidentsChart } from "@/components/dashboard/incidents-chart";
import { StatusDistribution } from "@/components/dashboard/status-distribution";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AgingChart } from "@/components/dashboard/aging-chart";
import { TechnicianChart } from "@/components/dashboard/technician-chart";
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
import { AttentionWidget } from "@/components/dashboard/attention-widget";
import { StaggerList } from "@/components/shared/stagger-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de Control",
};

function formatHours(hours: number | null): string {
  if (hours === null) return "-";
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24 * 10) / 10;
  return `${days}d`;
}

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Control</h1>

      {/* Row 1: KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StaggerList staggerMs={60}>
          <KpiCard
            title="Incidencias Abiertas"
            value={stats.openIncidents}
            icon={AlertTriangle}
            color="blue"
          />
          <KpiCard
            title="RMAs Activos"
            value={stats.activeRmas}
            icon={RotateCcw}
            color="purple"
          />
          <KpiCard
            title="SLA Cumplido"
            value={`${sla.slaCompliancePercent}%`}
            icon={ShieldCheck}
            color={sla.slaCompliancePercent >= 90 ? "green" : sla.slaCompliancePercent >= 70 ? "amber" : "red"}
          />
          <KpiCard
            title="Resolución Media"
            value={formatHours(sla.avgResolutionHours)}
            icon={Clock}
            color="amber"
          />
          <KpiCard
            title="Fuera de SLA"
            value={sla.overdueCount}
            icon={AlertOctagon}
            color={sla.overdueCount > 0 ? "red" : "green"}
          />
          <KpiCard
            title="Tasa Reapertura"
            value={`${sla.reopenRate}%`}
            icon={RefreshCcw}
            color={sla.reopenRate > 5 ? "red" : "green"}
          />
        </StaggerList>
      </div>

      {/* Attention Widget */}
      {alerts.totalCount > 0 && (
        <AttentionWidget initialData={alerts} />
      )}

      {/* Row 2: Trend + Distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncidentsChart data={trend} />
        </div>
        <StatusDistribution data={distribution} />
      </div>

      {/* Row 3: Aging + Technician Performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AgingChart data={aging} />
        <TechnicianChart data={technicians} />
      </div>

      {/* Row 4: Activity + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity data={activity} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
