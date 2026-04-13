import { db } from "@/lib/db";
import { clients, clientLocations } from "@/lib/db/schema";
import { eq, and, or, isNull, asc, desc, count, sql, gte, lte, type AnyColumn } from "drizzle-orm";
import type { PaginationParams, PaginatedResult } from "@/types";

export type ClientRow = typeof clients.$inferSelect;
export type ClientLocationRow = typeof clientLocations.$inferSelect;

export type ClientWithLocations = ClientRow & {
  locations: ClientLocationRow[];
};

export async function getClients(
  params: PaginationParams
): Promise<PaginatedResult<ClientRow>> {
  const { page, pageSize, search, sortBy = "name", sortOrder = "asc", filters } = params;
  const offset = (page - 1) * pageSize;

  const conditions = [isNull(clients.deletedAt)];

  if (search) {
    conditions.push(
      or(
        sql`extensions.unaccent(${clients.name}) ILIKE extensions.unaccent(${`%${search}%`})`,
        sql`extensions.unaccent(${clients.email}) ILIKE extensions.unaccent(${`%${search}%`})`,
        sql`${clients.externalId} ILIKE ${`%${search}%`}`,
        sql`${clients.phone} ILIKE ${`%${search}%`}`
      )!
    );
  }
  if (filters?.dateRangeFrom && typeof filters.dateRangeFrom === "string") {
    conditions.push(gte(clients.createdAt, new Date(filters.dateRangeFrom + "T00:00:00")));
  }
  if (filters?.dateRangeTo && typeof filters.dateRangeTo === "string") {
    conditions.push(lte(clients.createdAt, new Date(filters.dateRangeTo + "T23:59:59")));
  }

  const where = and(...conditions);

  const sortColumn = getSortColumn(sortBy);
  const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(clients)
      .where(where)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: count() })
      .from(clients)
      .where(where),
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

export async function getClientById(id: string): Promise<ClientWithLocations | null> {
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), isNull(clients.deletedAt)))
    .limit(1);

  if (!client) return null;

  const locations = await db
    .select()
    .from(clientLocations)
    .where(eq(clientLocations.clientId, id))
    .orderBy(desc(clientLocations.isDefault), asc(clientLocations.name));

  return { ...client, locations };
}

export async function getClientLocations(clientId: string): Promise<ClientLocationRow[]> {
  return db
    .select()
    .from(clientLocations)
    .where(eq(clientLocations.clientId, clientId))
    .orderBy(desc(clientLocations.isDefault), asc(clientLocations.name));
}

function getSortColumn(sortBy: string): AnyColumn {
  const columns: Record<string, AnyColumn> = {
    name: clients.name,
    email: clients.email,
    phone: clients.phone,
    createdAt: clients.createdAt,
  };
  return columns[sortBy] ?? clients.name;
}
