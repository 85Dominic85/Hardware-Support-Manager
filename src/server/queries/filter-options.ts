import { db } from "@/lib/db";
import { users, providers } from "@/lib/db/schema";
import { isNull, asc } from "drizzle-orm";

export interface FilterOptionRow {
  value: string;
  label: string;
}

/** Active (non-deleted) users for filter dropdowns */
export async function getUserFilterOptions(): Promise<FilterOptionRow[]> {
  const rows = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(isNull(users.deletedAt))
    .orderBy(asc(users.name));

  return rows.map((r) => ({ value: r.id, label: r.name }));
}

/** Active (non-deleted) providers for filter dropdowns */
export async function getProviderFilterOptions(): Promise<FilterOptionRow[]> {
  const rows = await db
    .select({ id: providers.id, name: providers.name })
    .from(providers)
    .where(isNull(providers.deletedAt))
    .orderBy(asc(providers.name));

  return rows.map((r) => ({ value: r.id, label: r.name }));
}
