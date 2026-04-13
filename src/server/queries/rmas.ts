import { db } from "@/lib/db";
import { rmas, incidents, providers, clients } from "@/lib/db/schema";
import { eq, or, and, asc, desc, count, sql, gte, lte, inArray, type AnyColumn } from "drizzle-orm";
import type { PaginationParams, PaginatedResult } from "@/types";

export type RmaRow = typeof rmas.$inferSelect & {
  providerName: string | null;
  incidentNumber: string | null;
  clientCompanyName: string | null;
};

export async function getRmas(
  params: PaginationParams
): Promise<PaginatedResult<RmaRow>> {
  const { page, pageSize, search, sortBy = "createdAt", sortOrder = "desc", filters } = params;
  const offset = (page - 1) * pageSize;

  const searchCondition = search
    ? or(
        sql`${rmas.rmaNumber} ILIKE ${`%${search}%`}`,
        sql`unaccent(${providers.name}) ILIKE unaccent(${`%${search}%`})`,
        sql`unaccent(${rmas.clientName}) ILIKE unaccent(${`%${search}%`})`,
        sql`unaccent(${clients.name}) ILIKE unaccent(${`%${search}%`})`,
        sql`unaccent(${rmas.deviceBrand}) ILIKE unaccent(${`%${search}%`})`,
        sql`unaccent(${rmas.deviceModel}) ILIKE unaccent(${`%${search}%`})`,
        sql`${rmas.deviceSerialNumber} ILIKE ${`%${search}%`}`,
        sql`${incidents.incidentNumber} ILIKE ${`%${search}%`}`
      )
    : undefined;

  const filterConditions = [];
  if (searchCondition) filterConditions.push(searchCondition);
  if (filters?.status && Array.isArray(filters.status) && filters.status.length > 0) {
    filterConditions.push(inArray(rmas.status, filters.status as typeof rmas.status.enumValues));
  }
  if (filters?.providerId && Array.isArray(filters.providerId) && filters.providerId.length > 0) {
    filterConditions.push(inArray(rmas.providerId, filters.providerId));
  }
  if (filters?.dateRangeFrom && typeof filters.dateRangeFrom === "string") {
    filterConditions.push(gte(rmas.createdAt, new Date(filters.dateRangeFrom + "T00:00:00")));
  }
  if (filters?.dateRangeTo && typeof filters.dateRangeTo === "string") {
    filterConditions.push(lte(rmas.createdAt, new Date(filters.dateRangeTo + "T23:59:59")));
  }
  const whereCondition = filterConditions.length > 0 ? and(...filterConditions) : undefined;

  const sortColumn = getSortColumn(sortBy);
  const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: rmas.id,
        rmaNumber: rmas.rmaNumber,
        incidentId: rmas.incidentId,
        providerId: rmas.providerId,
        clientId: rmas.clientId,
        clientLocationId: rmas.clientLocationId,
        clientName: rmas.clientName,
        clientExternalId: rmas.clientExternalId,
        clientIntercomUrl: rmas.clientIntercomUrl,
        status: rmas.status,
        deviceType: rmas.deviceType,
        deviceBrand: rmas.deviceBrand,
        deviceModel: rmas.deviceModel,
        deviceSerialNumber: rmas.deviceSerialNumber,
        trackingNumberOutgoing: rmas.trackingNumberOutgoing,
        trackingNumberReturn: rmas.trackingNumberReturn,
        providerRmaNumber: rmas.providerRmaNumber,
        clientLocal: rmas.clientLocal,
        address: rmas.address,
        postalCode: rmas.postalCode,
        city: rmas.city,
        phone: rmas.phone,
        notes: rmas.notes,
        createdAt: rmas.createdAt,
        updatedAt: rmas.updatedAt,
        stateChangedAt: rmas.stateChangedAt,
        articleId: rmas.articleId,
        deviceValueCents: rmas.deviceValueCents,
        repairCostCents: rmas.repairCostCents,
        shippingCostCents: rmas.shippingCostCents,
        replacementCostCents: rmas.replacementCostCents,
        providerName: providers.name,
        incidentNumber: incidents.incidentNumber,
        clientCompanyName: clients.name,
      })
      .from(rmas)
      .leftJoin(providers, eq(rmas.providerId, providers.id))
      .leftJoin(incidents, eq(rmas.incidentId, incidents.id))
      .leftJoin(clients, eq(rmas.clientId, clients.id))
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: count() })
      .from(rmas)
      .leftJoin(providers, eq(rmas.providerId, providers.id))
      .leftJoin(clients, eq(rmas.clientId, clients.id))
      .where(whereCondition),
  ]);

  const totalCount = totalResult[0].count;

  return {
    data,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getRmaById(id: string): Promise<RmaRow | null> {
  const [rma] = await db
    .select({
      id: rmas.id,
      rmaNumber: rmas.rmaNumber,
      incidentId: rmas.incidentId,
      providerId: rmas.providerId,
      clientId: rmas.clientId,
      clientLocationId: rmas.clientLocationId,
      clientName: rmas.clientName,
      clientExternalId: rmas.clientExternalId,
      clientIntercomUrl: rmas.clientIntercomUrl,
      status: rmas.status,
      deviceType: rmas.deviceType,
      deviceBrand: rmas.deviceBrand,
      deviceModel: rmas.deviceModel,
      deviceSerialNumber: rmas.deviceSerialNumber,
      trackingNumberOutgoing: rmas.trackingNumberOutgoing,
      trackingNumberReturn: rmas.trackingNumberReturn,
      providerRmaNumber: rmas.providerRmaNumber,
      clientLocal: rmas.clientLocal,
      address: rmas.address,
      postalCode: rmas.postalCode,
      city: rmas.city,
      phone: rmas.phone,
      notes: rmas.notes,
      createdAt: rmas.createdAt,
      updatedAt: rmas.updatedAt,
      stateChangedAt: rmas.stateChangedAt,
      articleId: rmas.articleId,
      deviceValueCents: rmas.deviceValueCents,
      repairCostCents: rmas.repairCostCents,
      shippingCostCents: rmas.shippingCostCents,
      replacementCostCents: rmas.replacementCostCents,
      providerName: providers.name,
      incidentNumber: incidents.incidentNumber,
      clientCompanyName: clients.name,
    })
    .from(rmas)
    .leftJoin(providers, eq(rmas.providerId, providers.id))
    .leftJoin(incidents, eq(rmas.incidentId, incidents.id))
    .leftJoin(clients, eq(rmas.clientId, clients.id))
    .where(eq(rmas.id, id))
    .limit(1);

  return rma ?? null;
}

function getSortColumn(sortBy: string): AnyColumn {
  const columns: Record<string, AnyColumn> = {
    rmaNumber: rmas.rmaNumber,
    status: rmas.status,
    createdAt: rmas.createdAt,
    stateChangedAt: rmas.stateChangedAt,
  };
  return columns[sortBy] ?? rmas.createdAt;
}
