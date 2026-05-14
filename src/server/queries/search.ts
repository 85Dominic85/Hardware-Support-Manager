import { db } from "@/lib/db";
import {
  incidents,
  rmas,
  clients,
  providers,
} from "@/lib/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { accentInsensitiveLike } from "@/lib/utils/sql-search";

/**
 * Cross-entity global search used by the sidebar search bar.
 *
 * Each call accepts an array of pre-normalized tokens (lowercased, accent
 * stripped). The tokens are combined with OR so a query like
 * "cafe cantina" returns rows matching either of the two — per user spec.
 *
 * SQL uses `accentInsensitiveLike()` to lookup against case + accent
 * insensitive column values, sidestepping the Supabase unaccent limitation.
 */

export interface IncidentSearchResult {
  id: string;
  incidentNumber: string;
  title: string;
  clientCompanyName: string | null;
  clientName: string | null;
  status: string;
  deviceBrand: string | null;
  deviceModel: string | null;
}

export interface RmaSearchResult {
  id: string;
  rmaNumber: string;
  clientCompanyName: string | null;
  clientName: string | null;
  status: string;
  deviceBrand: string | null;
  deviceModel: string | null;
  providerName: string | null;
  incidentNumber: string | null;
}

/** Columns to search across in incidents (joined with clients). */
function buildIncidentTokenWhere(token: string) {
  return or(
    accentInsensitiveLike(incidents.incidentNumber, token),
    accentInsensitiveLike(incidents.title, token),
    accentInsensitiveLike(incidents.description, token),
    accentInsensitiveLike(incidents.clientName, token),
    accentInsensitiveLike(incidents.deviceType, token),
    accentInsensitiveLike(incidents.deviceBrand, token),
    accentInsensitiveLike(incidents.deviceModel, token),
    accentInsensitiveLike(incidents.deviceSerialNumber, token),
    accentInsensitiveLike(incidents.contactName, token),
    accentInsensitiveLike(incidents.pickupCity, token),
    accentInsensitiveLike(incidents.pickupAddress, token),
    accentInsensitiveLike(incidents.intercomEscalationId, token),
    accentInsensitiveLike(clients.name, token),
    accentInsensitiveLike(clients.city, token),
  );
}

/** Columns to search across in RMAs (joined with providers, incidents, clients). */
function buildRmaTokenWhere(
  token: string,
  linkedIncidentNumber: ReturnType<typeof alias>,
) {
  return or(
    accentInsensitiveLike(rmas.rmaNumber, token),
    accentInsensitiveLike(rmas.clientName, token),
    accentInsensitiveLike(rmas.deviceType, token),
    accentInsensitiveLike(rmas.deviceBrand, token),
    accentInsensitiveLike(rmas.deviceModel, token),
    accentInsensitiveLike(rmas.deviceSerialNumber, token),
    accentInsensitiveLike(rmas.providerRmaNumber, token),
    accentInsensitiveLike(rmas.trackingNumberOutgoing, token),
    accentInsensitiveLike(rmas.trackingNumberReturn, token),
    accentInsensitiveLike(rmas.contactName, token),
    accentInsensitiveLike(rmas.pickupCity, token),
    accentInsensitiveLike(rmas.pickupAddress, token),
    accentInsensitiveLike(rmas.notes, token),
    accentInsensitiveLike(providers.name, token),
    accentInsensitiveLike(clients.name, token),
    accentInsensitiveLike(clients.city, token),
    accentInsensitiveLike(linkedIncidentNumber.incidentNumber, token),
  );
}

export async function searchIncidentsByTokens(
  tokens: string[],
  limit = 5,
): Promise<IncidentSearchResult[]> {
  if (tokens.length === 0) return [];

  // OR between tokens — user wants UNION of matches.
  const whereCondition = or(...tokens.map((t) => buildIncidentTokenWhere(t)));

  try {
    const rows = await db
      .select({
        id: incidents.id,
        incidentNumber: incidents.incidentNumber,
        title: incidents.title,
        clientCompanyName: clients.name,
        clientName: incidents.clientName,
        status: incidents.status,
        deviceBrand: incidents.deviceBrand,
        deviceModel: incidents.deviceModel,
      })
      .from(incidents)
      .leftJoin(clients, eq(incidents.clientId, clients.id))
      .where(whereCondition)
      .orderBy(desc(incidents.createdAt))
      .limit(limit);
    return rows as IncidentSearchResult[];
  } catch (err) {
    console.error("[search] searchIncidentsByTokens error:", err);
    return [];
  }
}

export async function searchRmasByTokens(
  tokens: string[],
  limit = 5,
): Promise<RmaSearchResult[]> {
  if (tokens.length === 0) return [];

  // Alias incidents so we can join it to RMAs without column-name clash.
  const linkedIncident = alias(incidents, "linked_incident");

  const whereCondition = or(
    ...tokens.map((t) => buildRmaTokenWhere(t, linkedIncident)),
  );

  try {
    const rows = await db
      .select({
        id: rmas.id,
        rmaNumber: rmas.rmaNumber,
        clientCompanyName: clients.name,
        clientName: rmas.clientName,
        status: rmas.status,
        deviceBrand: rmas.deviceBrand,
        deviceModel: rmas.deviceModel,
        providerName: providers.name,
        incidentNumber: linkedIncident.incidentNumber,
      })
      .from(rmas)
      .leftJoin(providers, eq(rmas.providerId, providers.id))
      .leftJoin(linkedIncident, eq(rmas.incidentId, linkedIncident.id))
      .leftJoin(clients, eq(rmas.clientId, clients.id))
      .where(whereCondition)
      .orderBy(desc(rmas.createdAt))
      .limit(limit);
    return rows as RmaSearchResult[];
  } catch (err) {
    console.error("[search] searchRmasByTokens error:", err);
    return [];
  }
}
