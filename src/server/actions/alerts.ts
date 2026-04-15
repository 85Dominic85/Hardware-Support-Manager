"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import { getAlertCounts, getAlertItems } from "@/server/queries/alerts";
import type { AlertBadgeCounts, AlertSummary } from "@/server/queries/alerts";
import type { DateRangeParams } from "@/hooks/use-dashboard-params";

export async function fetchAlertCounts(): Promise<AlertBadgeCounts> {
  await getRequiredSession();
  return getAlertCounts();
}

export async function fetchAlertItems(
  range?: DateRangeParams,
): Promise<AlertSummary> {
  await getRequiredSession();
  return getAlertItems(undefined, undefined, range);
}
