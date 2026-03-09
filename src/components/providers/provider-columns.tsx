"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink, Eye, Globe, Mail, MoreHorizontal, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
          <div className="space-y-1">
            {contacts.map((c, i) => (
              <div key={i} className="text-sm leading-tight">
                <span className="font-medium">{c.name}</span>
                {c.email && (
                  <span className="text-muted-foreground"> · {c.email}</span>
                )}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      id: "preview",
      header: "",
      cell: ({ row }) => {
        const provider = row.original;
        const contacts = (provider.contacts ?? []) as ProviderContact[];
        const rmaHref = provider.rmaUrl
          ? provider.rmaUrl.startsWith("http")
            ? provider.rmaUrl
            : `https://${provider.rmaUrl}`
          : null;
        const webHref = provider.website
          ? provider.website.startsWith("http")
            ? provider.website
            : `https://${provider.website}`
          : null;

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
                <span className="sr-only">Vista rapida</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">{provider.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Creado {formatDate(provider.createdAt)}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  {provider.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <a href={`mailto:${provider.email}`} className="text-primary hover:underline truncate">
                        {provider.email}
                      </a>
                    </div>
                  )}
                  {webHref && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <a href={webHref} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {provider.website}
                      </a>
                    </div>
                  )}
                  {rmaHref && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <a href={rmaHref} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        Portal RMA
                      </a>
                    </div>
                  )}
                  {!provider.email && !provider.website && !provider.rmaUrl && (
                    <p className="text-muted-foreground">Sin datos de contacto general</p>
                  )}
                </div>

                {contacts.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Contactos ({contacts.length})
                      </p>
                      {contacts.map((c, i) => (
                        <div key={i} className="rounded-md border p-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                              <User className="h-3 w-3 text-muted-foreground" />
                              {c.name}
                            </div>
                            {c.role && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {c.role}
                              </Badge>
                            )}
                          </div>
                          {c.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                            </div>
                          )}
                          {c.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{c.phone}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {provider.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Notas</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">{provider.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
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
