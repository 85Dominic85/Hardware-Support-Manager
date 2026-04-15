import { gte, lte, sql } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { incidents, rmas } from "@/lib/db/schema";

/** Re-export for convenience — canonical definition lives in use-dashboard-params. */
export interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Generic date range conditions for Drizzle ORM .where() clauses.
 * Accepts the `createdAt` column from any table.
 */
export function dateConds(
  createdAtCol: AnyColumn,
  range?: DateRangeParams,
) {
  const conds = [];
  if (range?.dateFrom)
    conds.push(gte(createdAtCol, new Date(range.dateFrom + "T00:00:00")));
  if (range?.dateTo)
    conds.push(lte(createdAtCol, new Date(range.dateTo + "T23:59:59")));
  return conds;
}

/** Date conditions for incidents.createdAt — drop-in replacement for local incidentDateConds. */
export function incidentDateConds(range?: DateRangeParams) {
  return dateConds(incidents.createdAt, range);
}

/** Date conditions for rmas.createdAt — drop-in replacement for local rmaDateConds. */
export function rmaDateConds(range?: DateRangeParams) {
  return dateConds(rmas.createdAt, range);
}

/**
 * Raw SQL date fragments for use inside db.execute() templates.
 * Returns parameterized fragments that can be interpolated directly.
 */
export function rawDateFragments(range?: DateRangeParams) {
  return {
    incFrom: range?.dateFrom
      ? sql`AND created_at >= ${range.dateFrom + "T00:00:00"}`
      : sql``,
    incTo: range?.dateTo
      ? sql`AND created_at <= ${range.dateTo + "T23:59:59"}`
      : sql``,
    rmaFrom: range?.dateFrom
      ? sql`AND created_at >= ${range.dateFrom + "T00:00:00"}`
      : sql``,
    rmaTo: range?.dateTo
      ? sql`AND created_at <= ${range.dateTo + "T23:59:59"}`
      : sql``,
    logFrom: range?.dateFrom
      ? sql`AND created_at >= ${range.dateFrom + "T00:00:00"}`
      : sql``,
    logTo: range?.dateTo
      ? sql`AND created_at <= ${range.dateTo + "T23:59:59"}`
      : sql``,
  };
}
