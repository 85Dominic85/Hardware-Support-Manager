"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RmaStateBadge } from "@/components/shared/state-badge";
import { fetchWarehouseItems } from "@/server/actions/warehouse";
import { useState, useMemo } from "react";
import { Search, Package } from "lucide-react";
import type { WarehouseItem } from "@/server/queries/warehouse";
import type { RmaStatus } from "@/lib/constants/rmas";

interface WarehouseTableProps {
  initialData: WarehouseItem[];
}

export function WarehouseTable({ initialData }: WarehouseTableProps) {
  const [search, setSearch] = useState("");

  const { data: items = initialData } = useQuery({
    queryKey: ["warehouse"],
    queryFn: () => fetchWarehouseItems(),
    initialData,
    refetchInterval: 60000, // refresh every minute
  });

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.deviceSerialNumber?.toLowerCase().includes(q) ||
        item.deviceBrand?.toLowerCase().includes(q) ||
        item.deviceModel?.toLowerCase().includes(q) ||
        item.rmaNumber.toLowerCase().includes(q) ||
        (item.clientCompanyName ?? item.clientName ?? "").toLowerCase().includes(q) ||
        item.providerName?.toLowerCase().includes(q)
    );
  }, [items, search]);

  const pendingShipment = items.filter(
    (i) => i.status === "borrador" || i.status === "aprobado"
  ).length;
  const pendingReturn = items.filter(
    (i) => i.status === "recibido_oficina"
  ).length;

  return (
    <div className="space-y-4">
      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Package className="mr-1 h-3.5 w-3.5" />
          Total en oficina: {items.length}
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
          Pendiente envío a proveedor: {pendingShipment}
        </Badge>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-300">
          Pendiente devolución a cliente: {pendingReturn}
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por Nº serie, marca, modelo, RMA..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <Package className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-lg font-medium">
            {items.length === 0
              ? "No hay equipos en la oficina"
              : "Sin resultados para la búsqueda"}
          </p>
          {items.length === 0 && (
            <p className="text-sm mt-1">
              Los equipos aparecen aquí cuando están en estado Borrador, Aprobado o Recibido en Oficina.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Serie</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Nº RMA</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Días</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.rmaId}>
                  <TableCell className="font-mono text-sm">
                    {item.deviceSerialNumber || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {[item.deviceBrand, item.deviceModel].filter(Boolean).join(" ") || "-"}
                    </div>
                    {item.deviceType && (
                      <div className="text-xs text-muted-foreground">{item.deviceType}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/rmas/${item.rmaId}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      {item.rmaNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.clientCompanyName ?? item.clientName ?? "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.providerName ?? "-"}
                  </TableCell>
                  <TableCell>
                    <RmaStateBadge status={item.status as RmaStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.daysInWarehouse > 7
                          ? "text-red-600 font-semibold"
                          : item.daysInWarehouse > 3
                            ? "text-amber-600 font-medium"
                            : "text-muted-foreground"
                      }
                    >
                      {item.daysInWarehouse}d
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
