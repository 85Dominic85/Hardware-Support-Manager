"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import { getWarehouseItems } from "@/server/queries/warehouse";
import type { WarehouseItem } from "@/server/queries/warehouse";

export async function fetchWarehouseItems(): Promise<WarehouseItem[]> {
  await getRequiredSession();
  return getWarehouseItems();
}
