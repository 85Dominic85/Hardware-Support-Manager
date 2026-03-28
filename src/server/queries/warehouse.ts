import { db } from "@/lib/db";
import { rmas, clients, providers } from "@/lib/db/schema";
import { sql, inArray, asc } from "drizzle-orm";

export interface WarehouseItem {
  rmaId: string;
  rmaNumber: string;
  status: string;
  deviceType: string | null;
  deviceBrand: string | null;
  deviceModel: string | null;
  deviceSerialNumber: string | null;
  clientName: string | null;
  clientCompanyName: string | null;
  providerName: string | null;
  stateChangedAt: Date;
  daysInWarehouse: number;
}

/**
 * Returns RMAs where the device is physically in the office/warehouse.
 * These are RMAs in states:
 * - borrador / aprobado: device collected from client, waiting to be sent
 * - recibido_oficina: device back from provider, waiting to return to client
 */
export async function getWarehouseItems(): Promise<WarehouseItem[]> {
  const warehouseStatuses = ["borrador", "aprobado", "recibido_oficina"] as const;

  const rows = await db
    .select({
      rmaId: rmas.id,
      rmaNumber: rmas.rmaNumber,
      status: rmas.status,
      deviceType: rmas.deviceType,
      deviceBrand: rmas.deviceBrand,
      deviceModel: rmas.deviceModel,
      deviceSerialNumber: rmas.deviceSerialNumber,
      clientName: rmas.clientName,
      clientCompanyName: clients.name,
      providerName: providers.name,
      stateChangedAt: rmas.stateChangedAt,
    })
    .from(rmas)
    .leftJoin(clients, sql`${rmas.clientId} = ${clients.id}`)
    .leftJoin(providers, sql`${rmas.providerId} = ${providers.id}`)
    .where(inArray(rmas.status, warehouseStatuses))
    .orderBy(asc(rmas.stateChangedAt));

  return rows.map((row) => ({
    ...row,
    clientCompanyName: row.clientCompanyName ?? null,
    providerName: row.providerName ?? null,
    daysInWarehouse: Math.floor(
      (Date.now() - new Date(row.stateChangedAt).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));
}
