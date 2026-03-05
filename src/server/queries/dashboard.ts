import { db } from "@/lib/db";
import { incidents, rmas, clients, providers, eventLogs } from "@/lib/db/schema";
import { eq, count, isNull, sql, desc, gte, not, inArray } from "drizzle-orm";
import { users } from "@/lib/db/schema";

export interface DashboardStats {
  openIncidents: number;
  activeRmas: number;
  totalClients: number;
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

const CLOSED_INCIDENT_STATUSES = ["cerrado", "cancelado"] as const;
const CLOSED_RMA_STATUSES = ["cerrado", "cancelado"] as const;

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [openIncidentsResult, activeRmasResult, totalClientsResult, totalProvidersResult] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(incidents)
          .where(not(inArray(incidents.status, [...CLOSED_INCIDENT_STATUSES]))),
        db
          .select({ count: count() })
          .from(rmas)
          .where(not(inArray(rmas.status, [...CLOSED_RMA_STATUSES]))),
        db
          .select({ count: count() })
          .from(clients)
          .where(isNull(clients.deletedAt)),
        db
          .select({ count: count() })
          .from(providers)
          .where(isNull(providers.deletedAt)),
      ]);

    return {
      openIncidents: openIncidentsResult[0].count,
      activeRmas: activeRmasResult[0].count,
      totalClients: totalClientsResult[0].count,
      totalProviders: totalProvidersResult[0].count,
    };
  } catch {
    return { openIncidents: 0, activeRmas: 0, totalClients: 0, totalProviders: 0 };
  }
}

export async function getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
  try {
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
      .orderBy(desc(eventLogs.createdAt))
      .limit(limit);

    return results;
  } catch {
    return [];
  }
}

export async function getIncidentStatusDistribution(): Promise<StatusDistribution[]> {
  try {
    const results = await db
      .select({
        status: incidents.status,
        count: count(),
      })
      .from(incidents)
      .where(not(inArray(incidents.status, [...CLOSED_INCIDENT_STATUSES])))
      .groupBy(incidents.status);

    return results;
  } catch {
    return [];
  }
}

export async function getIncidentTrend(days: number = 30): Promise<TrendPoint[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await db
      .select({
        date: sql<string>`to_char(${incidents.createdAt}::date, 'YYYY-MM-DD')`,
        count: count(),
      })
      .from(incidents)
      .where(gte(incidents.createdAt, startDate))
      .groupBy(sql`${incidents.createdAt}::date`)
      .orderBy(sql`${incidents.createdAt}::date`);

    return results;
  } catch {
    return [];
  }
}
