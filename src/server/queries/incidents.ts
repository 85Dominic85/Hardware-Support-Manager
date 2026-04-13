import { db } from "@/lib/db";
import { incidents, users, clients, rmas } from "@/lib/db/schema";
import { eq, or, and, asc, desc, count, sql, gte, lte, inArray, type AnyColumn } from "drizzle-orm";
import type { PaginationParams, PaginatedResult } from "@/types";

export type IncidentRow = typeof incidents.$inferSelect & {
  assignedUserName: string | null;
  clientCompanyName: string | null;
};

export async function getIncidents(
  params: PaginationParams
): Promise<PaginatedResult<IncidentRow>> {
  const { page, pageSize, search, sortBy = "createdAt", sortOrder = "desc", filters } = params;
  const offset = (page - 1) * pageSize;

  const searchCondition = search
    ? or(
        sql`${incidents.incidentNumber} ILIKE ${`%${search}%`}`,
        sql`unaccent(${incidents.title}) ILIKE unaccent(${`%${search}%`})`,
        sql`unaccent(${incidents.clientName}) ILIKE unaccent(${`%${search}%`})`,
        sql`unaccent(${clients.name}) ILIKE unaccent(${`%${search}%`})`,
        sql`${incidents.deviceSerialNumber} ILIKE ${`%${search}%`}`,
        sql`${incidents.intercomEscalationId} ILIKE ${`%${search}%`}`
      )
    : undefined;

  // Build filter conditions
  const filterConditions = [];
  if (searchCondition) filterConditions.push(searchCondition);
  if (filters?.status && Array.isArray(filters.status) && filters.status.length > 0) {
    filterConditions.push(inArray(incidents.status, filters.status as typeof incidents.status.enumValues));
  }
  if (filters?.priority && Array.isArray(filters.priority) && filters.priority.length > 0) {
    filterConditions.push(inArray(incidents.priority, filters.priority as typeof incidents.priority.enumValues));
  }
  if (filters?.category && Array.isArray(filters.category) && filters.category.length > 0) {
    filterConditions.push(inArray(incidents.category, filters.category as typeof incidents.category.enumValues));
  }
  if (filters?.dateRangeFrom && typeof filters.dateRangeFrom === "string") {
    filterConditions.push(gte(incidents.createdAt, new Date(filters.dateRangeFrom + "T00:00:00")));
  }
  if (filters?.dateRangeTo && typeof filters.dateRangeTo === "string") {
    filterConditions.push(lte(incidents.createdAt, new Date(filters.dateRangeTo + "T23:59:59")));
  }
  const whereCondition = filterConditions.length > 0 ? and(...filterConditions) : undefined;

  const sortColumn = getSortColumn(sortBy);
  const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: incidents.id,
        incidentNumber: incidents.incidentNumber,
        clientId: incidents.clientId,
        clientLocationId: incidents.clientLocationId,
        clientName: incidents.clientName,
        assignedUserId: incidents.assignedUserId,
        category: incidents.category,
        priority: incidents.priority,
        status: incidents.status,
        title: incidents.title,
        description: incidents.description,
        deviceBrand: incidents.deviceBrand,
        deviceModel: incidents.deviceModel,
        deviceType: incidents.deviceType,
        deviceSerialNumber: incidents.deviceSerialNumber,
        intercomUrl: incidents.intercomUrl,
        intercomEscalationId: incidents.intercomEscalationId,
        contactName: incidents.contactName,
        contactPhone: incidents.contactPhone,
        pickupAddress: incidents.pickupAddress,
        pickupPostalCode: incidents.pickupPostalCode,
        pickupCity: incidents.pickupCity,
        createdAt: incidents.createdAt,
        updatedAt: incidents.updatedAt,
        resolvedAt: incidents.resolvedAt,
        stateChangedAt: incidents.stateChangedAt,
        slaPausedMs: incidents.slaPausedMs,
        resolutionType: incidents.resolutionType,
        articleId: incidents.articleId,
        deviceValueCents: incidents.deviceValueCents,
        assignedUserName: users.name,
        clientCompanyName: clients.name,
      })
      .from(incidents)
      .leftJoin(users, eq(incidents.assignedUserId, users.id))
      .leftJoin(clients, eq(incidents.clientId, clients.id))
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: count() })
      .from(incidents)
      .leftJoin(clients, eq(incidents.clientId, clients.id))
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

export async function getIncidentById(id: string): Promise<IncidentRow | null> {
  const [incident] = await db
    .select({
      id: incidents.id,
      incidentNumber: incidents.incidentNumber,
      clientId: incidents.clientId,
      clientLocationId: incidents.clientLocationId,
      clientName: incidents.clientName,
      assignedUserId: incidents.assignedUserId,
      category: incidents.category,
      priority: incidents.priority,
      status: incidents.status,
      title: incidents.title,
      description: incidents.description,
      deviceType: incidents.deviceType,
      deviceBrand: incidents.deviceBrand,
      deviceModel: incidents.deviceModel,
      deviceSerialNumber: incidents.deviceSerialNumber,
      intercomUrl: incidents.intercomUrl,
      intercomEscalationId: incidents.intercomEscalationId,
      contactName: incidents.contactName,
      contactPhone: incidents.contactPhone,
      pickupAddress: incidents.pickupAddress,
      pickupPostalCode: incidents.pickupPostalCode,
      pickupCity: incidents.pickupCity,
      createdAt: incidents.createdAt,
      updatedAt: incidents.updatedAt,
      resolvedAt: incidents.resolvedAt,
      stateChangedAt: incidents.stateChangedAt,
      slaPausedMs: incidents.slaPausedMs,
      resolutionType: incidents.resolutionType,
      articleId: incidents.articleId,
      deviceValueCents: incidents.deviceValueCents,
      assignedUserName: users.name,
      clientCompanyName: clients.name,
    })
    .from(incidents)
    .leftJoin(users, eq(incidents.assignedUserId, users.id))
    .leftJoin(clients, eq(incidents.clientId, clients.id))
    .where(eq(incidents.id, id))
    .limit(1);

  return incident ?? null;
}

export interface LinkedRma {
  id: string;
  rmaNumber: string;
  status: string;
}

export async function getLinkedRmas(incidentId: string): Promise<LinkedRma[]> {
  return db
    .select({
      id: rmas.id,
      rmaNumber: rmas.rmaNumber,
      status: rmas.status,
    })
    .from(rmas)
    .where(eq(rmas.incidentId, incidentId));
}

function getSortColumn(sortBy: string): AnyColumn {
  const columns: Record<string, AnyColumn> = {
    incidentNumber: incidents.incidentNumber,
    title: incidents.title,
    status: incidents.status,
    priority: incidents.priority,
    createdAt: incidents.createdAt,
    stateChangedAt: incidents.stateChangedAt,
  };
  return columns[sortBy] ?? incidents.createdAt;
}
