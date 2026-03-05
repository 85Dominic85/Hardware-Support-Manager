"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import { getRmas } from "@/server/queries/rmas";
import type { PaginationParams, PaginatedResult } from "@/types";
import type { RmaRow } from "@/server/queries/rmas";

export async function fetchRmas(
  params: PaginationParams
): Promise<PaginatedResult<RmaRow>> {
  await getRequiredSession();
  return getRmas(params);
}
