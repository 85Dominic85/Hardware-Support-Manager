import type { Metadata } from "next";
import { Package } from "lucide-react";
import { getWarehouseItems } from "@/server/queries/warehouse";
import { WarehouseTable } from "@/components/warehouse/warehouse-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Almacén",
};

export default async function WarehousePage() {
  const items = await getWarehouseItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Almacén</h1>
          <p className="text-sm text-muted-foreground">
            Equipos en la oficina pendientes de envío o devolución
          </p>
        </div>
      </div>
      <WarehouseTable initialData={items} />
    </div>
  );
}
