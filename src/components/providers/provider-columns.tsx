"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header";
import { formatDate } from "@/lib/utils";
import type { ProviderRow } from "@/server/queries/providers";
import type { SortOrder, ProviderContact } from "@/types";

interface GetProviderColumnsParams {
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: SortOrder;
  onSort: (sortBy: string, sortOrder: SortOrder) => void;
}

export function getProviderColumns({
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: GetProviderColumnsParams): ColumnDef<ProviderRow, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: () => (
        <DataTableColumnHeader
          title="Nombre"
          sortKey="name"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <Link
          href={`/providers/${row.original.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <DataTableColumnHeader
          title="Email SAT"
          sortKey="email"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => row.original.email || "-",
    },
    {
      id: "rmaUrl",
      header: "Portal RMA",
      cell: ({ row }) => {
        const url = row.original.rmaUrl;
        if (!url) return "-";
        const href = url.startsWith("http") ? url : `https://${url}`;
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Abrir
          </a>
        );
      },
    },
    {
      id: "contacts",
      header: "Contactos",
      cell: ({ row }) => {
        const contacts = (row.original.contacts ?? []) as ProviderContact[];
        if (contacts.length === 0) return "-";
        return (
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            {contacts.length}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <DataTableColumnHeader
          title="Creado"
          sortKey="createdAt"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/providers/${row.original.id}`}>Editar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(row.original.id)}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
