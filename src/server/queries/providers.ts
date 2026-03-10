import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema";
import { eq, and, or, isNull, asc, desc, count, sql, type AnyColumn } from "drizzle-orm";
import type { PaginationParams, PaginatedResult } from "@/types";

export type ProviderRow = typeof providers.$inferSelect;

export async function getProviders(
  params: PaginationParams
): Promise<PaginatedResult<ProviderRow>> {
  const { page, pageSize, search, sortBy = "createdAt", sortOrder = "desc" } = params;
  const offset = (page - 1) * pageSize;

  const baseCondition = isNull(providers.deletedAt);

  const searchCondition = search
    ? or(
        sql`unaccent(${providers.name}) ILIKE unaccent(${`%${search}%`})`,
        sql`unaccent(${providers.email}) ILIKE unaccent(${`%${search}%`})`
      )
    : undefined;

  const where = searchCondition
    ? and(baseCondition, searchCondition)
    : baseCondition;

  const sortColumn = getSortColumn(sortBy);
  const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(providers)
      .where(where)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: count() })
      .from(providers)
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

export async function getProviderById(id: string): Promise<ProviderRow | null> {
  const [provider] = await db
    .select()
    .from(providers)
    .where(and(eq(providers.id, id), isNull(providers.deletedAt)))
    .limit(1);

  return provider ?? null;
}

function getSortColumn(sortBy: string): AnyColumn {
  const columns: Record<string, AnyColumn> = {
    name: providers.name,
    email: providers.email,
    website: providers.website,
    createdAt: providers.createdAt,
  };
  return columns[sortBy] ?? providers.createdAt;
}
