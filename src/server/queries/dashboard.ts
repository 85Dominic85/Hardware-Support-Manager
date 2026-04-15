import { db } from "@/lib/db";
import { incidents, eventLogs } from "@/lib/db/schema";
import { eq, count, sql, desc, gte, lte, not, inArray, and } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { getSlaThresholds } from "./settings";
import type { SlaThresholds } from "@/lib/constants/sla";

export interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

export interface DashboardStats {
  openIncidents: number;
  activeRmas: number;
  totalProviders: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userName: string | null;
  createdAt: Date;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface SlaMetrics {
  avgResolutionHours: number | null;
  slaCompliancePercent: number;
  overdueCount: number;
  reopenRate: number;
  avgRmaTurnaroundDays: number | null;
  incidentsByPriority: { priority: string; count: number }[];
}

export interface TechnicianPerformance {
  name: string;
  resolved: number;
  avgHours: number | null;
}

export interface AgingBucket {
  bucket: string;
  count: number;
}

const CLOSED_INCIDENT_STATUSES = ["resuelto", "cerrado", "cancelado"] as const;

function incidentDateConds(range?: DateRangeParams) {
  const conds = [];
  if (range?.dateFrom) conds.push(gte(incidents.createdAt, new Date(range.dateFrom + "T00:00:00")));
  if (range?.dateTo) conds.push(lte(incidents.createdAt, new Date(range.dateTo + "T23:59:59")));
  return conds;
}


export async function getDashboardStats(range?: DateRangeParams): Promise<DashboardStats> {
  try {
    const incDateFrom = range?.dateFrom ? `AND created_at >= '${range.dateFrom}T00:00:00'` : "";
    const incDateTo = range?.dateTo ? `AND created_at <= '${range.dateTo}T23:59:59'` : "";
    const rmaDateFrom = range?.dateFrom ? `AND created_at >= '${range.dateFrom}T00:00:00'` : "";
    const rmaDateTo = range?.dateTo ? `AND created_at <= '${range.dateTo}T23:59:59'` : "";

    const result = await db.execute(sql`
      SELECT
        (SELECT count(*) FROM hsm.incidents
         WHERE status NOT IN ('resuelto','cerrado','cancelado')
         ${sql.raw(incDateFrom)} ${sql.raw(incDateTo)}
        ) AS open_incidents,
        (SELECT count(*) FROM hsm.rmas
         WHERE status NOT IN ('recibido_oficina','cerrado','cancelado')
         ${sql.raw(rmaDateFrom)} ${sql.raw(rmaDateTo)}
        ) AS active_rmas,
        (SELECT count(*) FROM hsm.providers
         WHERE deleted_at IS NULL
        ) AS total_providers
    `);

    const row = result[0] as Record<string, string> | undefined;
    if (!row) return { openIncidents: 0, activeRmas: 0, totalProviders: 0 };

    return {
      openIncidents: Number(row.open_incidents) || 0,
      activeRmas: Number(row.active_rmas) || 0,
      totalProviders: Number(row.total_providers) || 0,
    };
  } catch {
    return { openIncidents: 0, activeRmas: 0, totalProviders: 0 };
  }
}

export async function getSlaMetrics(range?: DateRangeParams, preloadedSla?: SlaThresholds): Promise<SlaMetrics> {
  const defaults: SlaMetrics = {
    avgResolutionHours: null,
    slaCompliancePercent: 100,
    overdueCount: 0,
    reopenRate: 0,
    avgRmaTurnaroundDays: null,
    incidentsByPriority: [],
  };

  try {
    const sla = preloadedSla ?? await getSlaThresholds();

    // Build date condition fragments for raw SQL
    const incDateFrom = range?.dateFrom ? `AND created_at >= '${range.dateFrom}T00:00:00'` : "";
    const incDateTo = range?.dateTo ? `AND created_at <= '${range.dateTo}T23:59:59'` : "";
    const logDateFrom = range?.dateFrom ? `AND created_at >= '${range.dateFrom}T00:00:00'` : "";
    const logDateTo = range?.dateTo ? `AND created_at <= '${range.dateTo}T23:59:59'` : "";
    const rmaDateFrom = range?.dateFrom ? `AND created_at >= '${range.dateFrom}T00:00:00'` : "";
    const rmaDateTo = range?.dateTo ? `AND created_at <= '${range.dateTo}T23:59:59'` : "";

    // Single query with 7 scalar subqueries (replaces 8 sequential queries)
    const result = await db.execute(sql`
      SELECT
        (SELECT avg((extract(epoch from (resolved_at - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0)
         FROM hsm.incidents
         WHERE status = 'resuelto' AND resolved_at IS NOT NULL
         ${sql.raw(incDateFrom)} ${sql.raw(incDateTo)}
        ) AS avg_hours,

        (SELECT count(*)
         FROM hsm.incidents
         WHERE status IN ('resuelto','cerrado') AND resolved_at IS NOT NULL
         ${sql.raw(incDateFrom)} ${sql.raw(incDateTo)}
        ) AS comp_total,

        (SELECT count(*)
         FROM hsm.incidents
         WHERE status IN ('resuelto','cerrado') AND resolved_at IS NOT NULL
         ${sql.raw(incDateFrom)} ${sql.raw(incDateTo)}
         AND (
           (priority = 'critica' AND (extract(epoch from (resolved_at - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 <= ${sla.resolution.critica}) OR
           (priority = 'alta' AND (extract(epoch from (resolved_at - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 <= ${sla.resolution.alta}) OR
           (priority = 'media' AND (extract(epoch from (resolved_at - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 <= ${sla.resolution.media}) OR
           (priority = 'baja' AND (extract(epoch from (resolved_at - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 <= ${sla.resolution.baja})
         )
        ) AS comp_compliant,

        (SELECT count(*)
         FROM hsm.incidents
         WHERE status NOT IN ('resuelto','cerrado','cancelado')
         ${sql.raw(incDateFrom)} ${sql.raw(incDateTo)}
         AND (
           (priority = 'critica' AND (extract(epoch from (now() - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 > ${sla.resolution.critica}) OR
           (priority = 'alta' AND (extract(epoch from (now() - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 > ${sla.resolution.alta}) OR
           (priority = 'media' AND (extract(epoch from (now() - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 > ${sla.resolution.media}) OR
           (priority = 'baja' AND (extract(epoch from (now() - created_at)) * 1000 - CAST(sla_paused_ms AS bigint)) / 3600000.0 > ${sla.resolution.baja})
         )
        ) AS overdue_count,

        (SELECT count(*)
         FROM hsm.event_logs
         WHERE entity_type = 'incident' AND action = 'transition' AND from_state = 'resuelto'
         ${sql.raw(logDateFrom)} ${sql.raw(logDateTo)}
        ) AS reopen_count,

        (SELECT count(*)
         FROM hsm.incidents
         WHERE status IN ('resuelto','cerrado')
         ${sql.raw(incDateFrom)} ${sql.raw(incDateTo)}
        ) AS total_resolved,

        (SELECT avg(extract(epoch from (updated_at - created_at)) / 86400)
         FROM hsm.rmas
         WHERE status IN ('recibido_oficina','cerrado')
         ${sql.raw(rmaDateFrom)} ${sql.raw(rmaDateTo)}
        ) AS rma_avg_days
    `);

    const row = result[0] as Record<string, string | null> | undefined;
    if (!row) return defaults;

    const avgHours = row.avg_hours ? parseFloat(row.avg_hours) : null;
    const compTotal = Number(row.comp_total) || 0;
    const compCompliant = Number(row.comp_compliant) || 0;
    const compliancePercent = compTotal > 0 ? Math.round((compCompliant / compTotal) * 100) : 100;
    const overdueCount = Number(row.overdue_count) || 0;
    const reopenCount = Number(row.reopen_count) || 0;
    const totalResolved = Number(row.total_resolved) || 0;
    const reopenRate = totalResolved > 0
      ? Math.round((reopenCount / totalResolved) * 100 * 10) / 10
      : 0;
    const rmaDays = row.rma_avg_days ? parseFloat(row.rma_avg_days) : null;

    // By priority (separate query — returns multiple rows)
    const dateConds = incidentDateConds(range);
    const byPriority = await db
      .select({
        priority: incidents.priority,
        count: count(),
      })
      .from(incidents)
      .where(and(
        not(inArray(incidents.status, [...CLOSED_INCIDENT_STATUSES])),
        ...dateConds
      ))
      .groupBy(incidents.priority);

    return {
      avgResolutionHours: avgHours ? Math.round(avgHours * 10) / 10 : null,
      slaCompliancePercent: compliancePercent,
      overdueCount,
      reopenRate,
      avgRmaTurnaroundDays: rmaDays ? Math.round(rmaDays * 10) / 10 : null,
      incidentsByPriority: byPriority,
    };
  } catch {
    return defaults;
  }
}

export async function getAgingDistribution(range?: DateRangeParams): Promise<AgingBucket[]> {
  try {
    const dateConds = incidentDateConds(range);

    const result = await db
      .select({
        bucket: sql<string>`case
          when extract(epoch from (now() - ${incidents.stateChangedAt})) / 86400 < 1 then '< 1 día'
          when extract(epoch from (now() - ${incidents.stateChangedAt})) / 86400 < 3 then '1-3 días'
          when extract(epoch from (now() - ${incidents.stateChangedAt})) / 86400 < 7 then '3-7 días'
          else '7+ días'
        end`,
        count: count(),
      })
      .from(incidents)
      .where(and(
        not(inArray(incidents.status, [...CLOSED_INCIDENT_STATUSES])),
        ...dateConds
      ))
      .groupBy(sql`case
        when extract(epoch from (now() - ${incidents.stateChangedAt})) / 86400 < 1 then '< 1 día'
        when extract(epoch from (now() - ${incidents.stateChangedAt})) / 86400 < 3 then '1-3 días'
        when extract(epoch from (now() - ${incidents.stateChangedAt})) / 86400 < 7 then '3-7 días'
        else '7+ días'
      end`);

    const order = ["< 1 día", "1-3 días", "3-7 días", "7+ días"];
    return order.map((b) => ({
      bucket: b,
      count: result.find((r) => r.bucket === b)?.count ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function getTechnicianPerformance(range?: DateRangeParams): Promise<TechnicianPerformance[]> {
  try {
    const dateConds = incidentDateConds(range);

    const result = await db
      .select({
        name: users.name,
        resolved: count(),
        avgHours: sql<number>`avg((extract(epoch from (${incidents.resolvedAt} - ${incidents.createdAt})) * 1000 - CAST(${incidents.slaPausedMs} AS bigint)) / 3600000.0)`,
      })
      .from(incidents)
      .innerJoin(users, eq(incidents.assignedUserId, users.id))
      .where(
        and(
          inArray(incidents.status, ["resuelto", "cerrado"]),
          sql`${incidents.resolvedAt} is not null`,
          ...dateConds
        )
      )
      .groupBy(users.name)
      .orderBy(desc(count()))
      .limit(5);

    return result.map((r) => ({
      name: r.name,
      resolved: r.resolved,
      avgHours: r.avgHours ? Math.round(r.avgHours * 10) / 10 : null,
    }));
  } catch {
    return [];
  }
}

export async function getRecentActivity(limit: number = 10, range?: DateRangeParams): Promise<RecentActivity[]> {
  try {
    const dateConds = range ? [
      ...(range.dateFrom ? [gte(eventLogs.createdAt, new Date(range.dateFrom + "T00:00:00"))] : []),
      ...(range.dateTo ? [lte(eventLogs.createdAt, new Date(range.dateTo + "T23:59:59"))] : []),
    ] : [];

    const whereCondition = dateConds.length > 0 ? and(...dateConds) : undefined;

    const results = await db
      .select({
        id: eventLogs.id,
        action: eventLogs.action,
        entityType: eventLogs.entityType,
        entityId: eventLogs.entityId,
        userName: users.name,
        createdAt: eventLogs.createdAt,
      })
      .from(eventLogs)
      .leftJoin(users, eq(eventLogs.userId, users.id))
      .where(whereCondition)
      .orderBy(desc(eventLogs.createdAt))
      .limit(limit);

    return results;
  } catch {
    return [];
  }
}

export async function getIncidentStatusDistribution(range?: DateRangeParams): Promise<StatusDistribution[]> {
  try {
    const dateConds = incidentDateConds(range);

    const results = await db
      .select({
        status: incidents.status,
        count: count(),
      })
      .from(incidents)
      .where(and(
        not(inArray(incidents.status, [...CLOSED_INCIDENT_STATUSES])),
        ...dateConds
      ))
      .groupBy(incidents.status);

    return results;
  } catch {
    return [];
  }
}

export async function getIncidentTrend(range?: DateRangeParams): Promise<TrendPoint[]> {
  try {
    const days = 30;
    const defaultFrom = new Date();
    defaultFrom.setDate(defaultFrom.getDate() - days);

    const fromDate = range?.dateFrom ? new Date(range.dateFrom + "T00:00:00") : defaultFrom;
    const toDate = range?.dateTo ? new Date(range.dateTo + "T23:59:59") : undefined;

    const conditions = [gte(incidents.createdAt, fromDate)];
    if (toDate) conditions.push(lte(incidents.createdAt, toDate));

    const results = await db
      .select({
        date: sql<string>`to_char(${incidents.createdAt}::date, 'YYYY-MM-DD')`,
        count: count(),
      })
      .from(incidents)
      .where(and(...conditions))
      .groupBy(sql`${incidents.createdAt}::date`)
      .orderBy(sql`${incidents.createdAt}::date`);

    return results;
  } catch {
    return [];
  }
}
