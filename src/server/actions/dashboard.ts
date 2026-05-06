"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import {
  getDashboardStats,
  getSlaMetrics,
  getIncidentTrend,
  getIncidentStatusDistribution,
  getAgingDistribution,
  getTechnicianPerformance,
  getRecentActivity,
  getQuickConsultationsStats,
  type DashboardStats,
  type SlaMetrics,
  type TrendPoint,
  type StatusDistribution,
  type AgingBucket,
  type TechnicianPerformance,
  type RecentActivity,
  type QuickConsultationsStats,
} from "@/server/queries/dashboard";
import type { DateRangeParams } from "@/hooks/use-dashboard-params";

export async function fetchDashboardStats(range?: DateRangeParams): Promise<DashboardStats> {
  await getRequiredSession();
  return getDashboardStats(range);
}

export async function fetchSlaMetrics(range?: DateRangeParams): Promise<SlaMetrics> {
  await getRequiredSession();
  return getSlaMetrics(range);
}

export async function fetchIncidentTrend(range?: DateRangeParams): Promise<TrendPoint[]> {
  await getRequiredSession();
  return getIncidentTrend(range);
}

export async function fetchIncidentStatusDistribution(range?: DateRangeParams): Promise<StatusDistribution[]> {
  await getRequiredSession();
  return getIncidentStatusDistribution(range);
}

export async function fetchAgingDistribution(range?: DateRangeParams): Promise<AgingBucket[]> {
  await getRequiredSession();
  return getAgingDistribution(range);
}

export async function fetchTechnicianPerformance(range?: DateRangeParams): Promise<TechnicianPerformance[]> {
  await getRequiredSession();
  return getTechnicianPerformance(range);
}

export async function fetchRecentActivity(range?: DateRangeParams): Promise<RecentActivity[]> {
  await getRequiredSession();
  return getRecentActivity(undefined, range);
}

export async function fetchQuickConsultationsStats(range?: DateRangeParams): Promise<QuickConsultationsStats> {
  await getRequiredSession();
  return getQuickConsultationsStats(range);
}
