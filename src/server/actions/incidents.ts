"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import { getIncidents } from "@/server/queries/incidents";
import type { PaginationParams, PaginatedResult } from "@/types";
import type { IncidentRow } from "@/server/queries/incidents";

export async function fetchIncidents(
  params: PaginationParams
): Promise<PaginatedResult<IncidentRow>> {
  await getRequiredSession();
  return getIncidents(params);
}
