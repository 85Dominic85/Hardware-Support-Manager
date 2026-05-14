import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRmas } from "@/server/queries/rmas";
import { getDefaultPageSize } from "@/server/queries/settings";
import { getProviderFilterOptions } from "@/server/queries/filter-options";
import { RmaPageContent } from "@/components/rmas/rma-page-content";
import {
  OPEN_RMA_STATUSES,
  CLOSED_RMA_STATUSES,
} from "@/lib/constants/statuses";
import type { SortOrder } from "@/types";

export const metadata: Metadata = {
  title: "RMAs",
};

const CLOSED_TABLE_PAGE_SIZE = 10;

export default async function RmasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const defaultPageSize = await getDefaultPageSize().catch(() => 20);
  const search =
    typeof params.search === "string" && params.search ? params.search : undefined;

  // Two stacked tables: "Activos" (open workflow) and "Cerrados" (final
  // lifecycle: recibido_oficina / cerrado / cancelado). Each one keeps its
  // own pagination/sort in URL via `open_` / `closed_` prefixes.
  const openPage = Number(params.open_page) || 1;
  const openPageSize = Number(params.open_pageSize) || defaultPageSize;
  const openSortBy =
    typeof params.open_sortBy === "string" ? params.open_sortBy : "createdAt";
  const openSortOrder = (typeof params.open_sortOrder === "string"
    ? params.open_sortOrder
    : "desc") as SortOrder;

  const closedPage = Number(params.closed_page) || 1;
  const closedPageSize =
    Number(params.closed_pageSize) || CLOSED_TABLE_PAGE_SIZE;
  const closedSortBy =
    typeof params.closed_sortBy === "string"
      ? params.closed_sortBy
      : "stateChangedAt";
  const closedSortOrder = (typeof params.closed_sortOrder === "string"
    ? params.closed_sortOrder
    : "desc") as SortOrder;

  // Shared filters
  const toArray = (v: string | string[] | undefined): string[] | undefined => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v;
    return v.includes(",") ? v.split(",") : [v];
  };
  const sharedFilters: Record<string, string | string[] | undefined> = {};
  if (params.providerId) sharedFilters.providerId = toArray(params.providerId);
  if (typeof params.dateRangeFrom === "string")
    sharedFilters.dateRangeFrom = params.dateRangeFrom;
  if (typeof params.dateRangeTo === "string")
    sharedFilters.dateRangeTo = params.dateRangeTo;

  const openFilters = {
    ...sharedFilters,
    status: [...OPEN_RMA_STATUSES] as string[],
  };
  const closedFilters = {
    ...sharedFilters,
    status: [...CLOSED_RMA_STATUSES] as string[],
  };

  const [providerOptions, openInitial, closedInitial] = await Promise.all([
    getProviderFilterOptions().catch(() => []),
    getRmas({
      page: openPage,
      pageSize: openPageSize,
      search,
      sortBy: openSortBy,
      sortOrder: openSortOrder,
      filters: openFilters,
    }).catch(() => ({
      data: [],
      totalCount: 0,
      page: openPage,
      pageSize: openPageSize,
      totalPages: 0,
    })),
    getRmas({
      page: closedPage,
      pageSize: closedPageSize,
      search,
      sortBy: closedSortBy,
      sortOrder: closedSortOrder,
      filters: closedFilters,
    }).catch(() => ({
      data: [],
      totalCount: 0,
      page: closedPage,
      pageSize: closedPageSize,
      totalPages: 0,
    })),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">RMAs</h1>
            <p className="text-sm text-muted-foreground">
              Autorizaciones de devolución de mercancía
            </p>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/rmas/new">
            <Plus className="h-4 w-4 mr-1" />
            Nuevo RMA
          </Link>
        </Button>
      </div>
      <RmaPageContent
        openInitialData={openInitial}
        closedInitialData={closedInitial}
        defaultPageSize={defaultPageSize}
        providerOptions={providerOptions}
      />
    </div>
  );
}
