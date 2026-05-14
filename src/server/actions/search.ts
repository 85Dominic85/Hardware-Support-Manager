"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import { tokenizeSearchInput } from "@/lib/utils/search-normalize";
import {
  searchIncidentsByTokens,
  searchRmasByTokens,
  type IncidentSearchResult,
  type RmaSearchResult,
} from "@/server/queries/search";

export interface SearchGlobalResult {
  incidents: IncidentSearchResult[];
  rmas: RmaSearchResult[];
}

/**
 * Global search action used by the sidebar bar. Auth-required.
 *
 * Normalizes + tokenizes the raw query on the server (so the same logic
 * is applied regardless of which client called us). Empty results are
 * returned for queries that produce 0 valid tokens — no DB hit.
 *
 * Limit: 5 incidents + 5 RMAs (10 results max).
 */
export async function searchGlobal(
  rawQuery: string,
): Promise<SearchGlobalResult> {
  await getRequiredSession();

  const tokens = tokenizeSearchInput(rawQuery);
  if (tokens.length === 0) {
    return { incidents: [], rmas: [] };
  }

  const [incidents, rmas] = await Promise.all([
    searchIncidentsByTokens(tokens, 5),
    searchRmasByTokens(tokens, 5),
  ]);

  return { incidents, rmas };
}
