import { AlertTriangle, RotateCcw, Users, Building2 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { IncidentsChart } from "@/components/dashboard/incidents-chart";
import { StatusDistribution } from "@/components/dashboard/status-distribution";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  getDashboardStats,
  getRecentActivity,
  getIncidentStatusDistribution,
  getIncidentTrend,
} from "@/server/queries/dashboard";

export default async function DashboardPage() {
  const [stats, activity, distribution, trend] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getIncidentStatusDistribution(),
    getIncidentTrend(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Control</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          title="Clientes"
          value={stats.totalClients}
          icon={Users}
          color="green"
        />
        <KpiCard
          title="Proveedores"
          value={stats.totalProviders}
          icon={Building2}
          color="amber"
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncidentsChart data={trend} />
        </div>
        <RecentActivity data={activity} />
      </div>

      {/* Distribution + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StatusDistribution data={distribution} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
