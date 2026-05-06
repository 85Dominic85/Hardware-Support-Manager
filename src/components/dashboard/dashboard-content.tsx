"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Clock,
  AlertOctagon,
  RefreshCcw,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KpiCard } from "./kpi-card";
import { ExpandableKpiCard } from "./expandable-kpi-card";
import { RecentActivity } from "./recent-activity";
import { QuickActions } from "./quick-actions";
import { AttentionWidget } from "./attention-widget";
import { DateRangeSelector } from "./date-range-selector";
import { ExportButton } from "./export-button";

const ChartSkeleton = () => (
  <Card><CardHeader><Skeleton className="h-5 w-40" /></CardHeader><CardContent><Skeleton className="h-[200px] w-full" /></CardContent></Card>
);
const IncidentsChart = dynamic(() => import("./incidents-chart").then(m => m.IncidentsChart), { ssr: false, loading: ChartSkeleton });
const StatusDistribution = dynamic(() => import("./status-distribution").then(m => m.StatusDistribution), { ssr: false, loading: ChartSkeleton });
const AgingChart = dynamic(() => import("./aging-chart").then(m => m.AgingChart), { ssr: false, loading: ChartSkeleton });
const TechnicianChart = dynamic(() => import("./technician-chart").then(m => m.TechnicianChart), { ssr: false, loading: ChartSkeleton });
import { Button } from "@/components/ui/button";
import { StaggerList } from "@/components/shared/stagger-list";
import { useDashboardParams } from "@/hooks/use-dashboard-params";
import {
  fetchDashboardStats,
  fetchSlaMetrics,
  fetchIncidentTrend,
  fetchIncidentStatusDistribution,
  fetchAgingDistribution,
  fetchTechnicianPerformance,
  fetchRecentActivity,
  fetchQuickConsultationsStats,
} from "@/server/actions/dashboard";
import { fetchAlertItems } from "@/server/actions/alerts";
import type {
  DashboardStats,
  SlaMetrics,
  TrendPoint,
  StatusDistribution as StatusDistType,
  AgingBucket,
  TechnicianPerformance as TechPerfType,
  RecentActivity as RecentActType,
  QuickConsultationsStats,
} from "@/server/queries/dashboard";
import type { AlertSummary } from "@/server/queries/alerts";

function formatHours(hours: number | null): string {
  if (hours === null) return "-";
  if (hours < 24) return `${hours}h`;
  const days = Math.round((hours / 24) * 10) / 10;
  return `${days}d`;
}

interface DashboardContentProps {
  initialStats: DashboardStats;
  initialSla: SlaMetrics;
  initialTrend?: TrendPoint[];
  initialDistribution?: StatusDistType[];
  initialAging?: AgingBucket[];
  initialTechnicians?: TechPerfType[];
  initialActivity?: RecentActType[];
  initialAlerts: AlertSummary;
  initialQuickConsultations?: QuickConsultationsStats;
}

export function DashboardContent({
  initialStats,
  initialSla,
  initialTrend,
  initialDistribution,
  initialAging,
  initialTechnicians,
  initialActivity,
  initialAlerts,
  initialQuickConsultations,
}: DashboardContentProps) {
  const { preset, dateFrom, dateTo, dateRange, setPreset, setCustomRange } =
    useDashboardParams();

  const hasCustomRange = dateFrom || dateTo || preset !== "30d";

  // initialDataUpdatedAt prevents TanStack Query from immediately re-fetching
  // SSR data. Without it, initialData is treated as stale and triggers 8 server
  // action calls on page load — doubling DB pressure.
  // Memoized with useState to remain stable across re-renders.
  const [mountTimestamp] = useState(() => Date.now());
  const ssrTimestamp = hasCustomRange ? undefined : mountTimestamp;

  const { data: stats, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ["dashboard-stats", dateRange],
    queryFn: () => fetchDashboardStats(dateRange),
    initialData: hasCustomRange ? undefined : initialStats,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const { data: sla, isError: slaError, refetch: refetchSla } = useQuery({
    queryKey: ["dashboard-sla", dateRange],
    queryFn: () => fetchSlaMetrics(dateRange),
    initialData: hasCustomRange ? undefined : initialSla,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const { data: trend } = useQuery({
    queryKey: ["dashboard-trend", dateRange],
    queryFn: () => fetchIncidentTrend(dateRange),
    initialData: hasCustomRange ? undefined : initialTrend,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const { data: distribution } = useQuery({
    queryKey: ["dashboard-distribution", dateRange],
    queryFn: () => fetchIncidentStatusDistribution(dateRange),
    initialData: hasCustomRange ? undefined : initialDistribution,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const { data: aging } = useQuery({
    queryKey: ["dashboard-aging", dateRange],
    queryFn: () => fetchAgingDistribution(dateRange),
    initialData: hasCustomRange ? undefined : initialAging,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const { data: technicians } = useQuery({
    queryKey: ["dashboard-technicians", dateRange],
    queryFn: () => fetchTechnicianPerformance(dateRange),
    initialData: hasCustomRange ? undefined : initialTechnicians,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const { data: activity } = useQuery({
    queryKey: ["dashboard-activity", dateRange],
    queryFn: () => fetchRecentActivity(dateRange),
    initialData: hasCustomRange ? undefined : initialActivity,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const { data: alerts } = useQuery({
    queryKey: ["dashboard-alerts", dateRange],
    queryFn: () => fetchAlertItems(dateRange),
    initialData: hasCustomRange ? undefined : initialAlerts,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const quickConsultationsDefaults: QuickConsultationsStats = { count: 0, totalMinutes: 0, avgMinutes: null, byTechnician: [], conversionRatePct: 0 };
  const { data: quickConsultations } = useQuery({
    queryKey: ["dashboard-quick-consultations", dateRange],
    queryFn: () => fetchQuickConsultationsStats(dateRange),
    initialData: hasCustomRange ? undefined : initialQuickConsultations,
    initialDataUpdatedAt: ssrTimestamp,
  });

  const s = stats ?? initialStats;
  const sl = sla ?? initialSla;
  const al = alerts ?? initialAlerts;
  const qc = quickConsultations ?? initialQuickConsultations ?? quickConsultationsDefaults;

  const hasCriticalError = statsError && slaError;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <DateRangeSelector
            preset={preset}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onPresetChange={setPreset}
            onCustomRange={setCustomRange}
          />
          <ExportButton dateRange={dateRange} />
        </div>
      </div>

      {hasCriticalError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex items-center gap-3">
            <AlertOctagon className="h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Error al cargar los datos del panel
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Comprueba tu conexión e inténtalo de nuevo.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { refetchStats(); refetchSla(); }}
            >
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StaggerList staggerMs={60}>
          <ExpandableKpiCard
            title="Incidencias Abiertas"
            value={s.openIncidents}
            icon={AlertTriangle}
            color="blue"
            drilldownType="openIncidents"
            dateRange={dateRange}
          />
          <ExpandableKpiCard
            title="RMAs Activos"
            value={s.activeRmas}
            icon={RotateCcw}
            color="purple"
            drilldownType="activeRmas"
            dateRange={dateRange}
          />
          <KpiCard
            title="SLA Cumplido"
            value={`${sl.slaCompliancePercent}%`}
            icon={ShieldCheck}
            color={
              sl.slaCompliancePercent >= 90
                ? "green"
                : sl.slaCompliancePercent >= 70
                  ? "amber"
                  : "red"
            }
          />
          <KpiCard
            title="Resolución Media"
            value={formatHours(sl.avgResolutionHours)}
            icon={Clock}
            color="amber"
          />
          <ExpandableKpiCard
            title="Fuera de SLA"
            value={sl.overdueCount}
            icon={AlertOctagon}
            color={sl.overdueCount > 0 ? "red" : "green"}
            drilldownType="overdue"
            dateRange={dateRange}
          />
          <KpiCard
            title="Tasa Reapertura"
            value={`${sl.reopenRate}%`}
            icon={RefreshCcw}
            color={sl.reopenRate > 5 ? "red" : "green"}
          />
          <KpiCard
            title="Consultas rápidas"
            value={qc.count}
            icon={Zap}
            color="amber"
            subtitle={`${(qc.totalMinutes / 60).toFixed(1)}h dedicadas`}
          />
        </StaggerList>
      </div>

      {/* Attention Widget */}
      {al.totalCount > 0 && <AttentionWidget initialData={al} />}

      {/* Row 2: Trend + Distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncidentsChart data={trend ?? initialTrend ?? []} />
        </div>
        <StatusDistribution data={distribution ?? initialDistribution ?? []} />
      </div>

      {/* Row 3: Aging + Technician Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <AgingChart data={aging ?? initialAging ?? []} />
        <TechnicianChart data={technicians ?? initialTechnicians ?? []} />
      </div>

      {/* Row 4: Activity + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity data={activity ?? initialActivity ?? []} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
