import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIncidents } from "@/server/queries/incidents";
import { getDefaultPageSize } from "@/server/queries/settings";
import { getUserFilterOptions } from "@/server/queries/filter-options";
import { IncidentPageContent } from "@/components/incidents/incident-page-content";
import {
  OPEN_INCIDENT_STATUSES,
  CLOSED_INCIDENT_STATUSES,
} from "@/lib/constants/statuses";
import type { SortOrder } from "@/types";

export const metadata: Metadata = {
  title: "Incidencias",
};

const CLOSED_TABLE_PAGE_SIZE = 10;

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const defaultPageSize = await getDefaultPageSize().catch(() => 20);
  const search =
    typeof params.search === "string" && params.search ? params.search : undefined;

  // The page hosts two stacked tables: "Activas" (open) and "Cerradas"
  // (closed). Each one keeps its own paginación/sort in URL via the
  // `open_` / `closed_` prefixes (see use-table-search-params.ts).
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
    typeof params.closed_sortBy === "string" ? params.closed_sortBy : "resolvedAt";
  const closedSortOrder = (typeof params.closed_sortOrder === "string"
    ? params.closed_sortOrder
    : "desc") as SortOrder;

  // Shared filters (apply to both tables).
  // nuqs parseAsArrayOf serializes arrays as comma-separated single params
  // (e.g. ?priority=alta,critica), so we split on comma for plain strings.
  const toArray = (v: string | string[] | undefined): string[] | undefined => {
    if (!v) return undefined;
    if (Array.isArray(v)) return v;
    return v.includes(",") ? v.split(",") : [v];
  };
  const sharedFilters: Record<string, string | string[] | undefined> = {};
  if (params.priority) sharedFilters.priority = toArray(params.priority);
  if (params.category) sharedFilters.category = toArray(params.category);
  if (params.hardwareOrigin) sharedFilters.hardwareOrigin = toArray(params.hardwareOrigin);
  if (params.assignedUserId)
    sharedFilters.assignedUserId = toArray(params.assignedUserId);
  if (typeof params.dateRangeFrom === "string")
    sharedFilters.dateRangeFrom = params.dateRangeFrom;
  if (typeof params.dateRangeTo === "string")
    sharedFilters.dateRangeTo = params.dateRangeTo;

  const openFilters = {
    ...sharedFilters,
    status: [...OPEN_INCIDENT_STATUSES] as string[],
  };
  const closedFilters = {
    ...sharedFilters,
    status: [...CLOSED_INCIDENT_STATUSES] as string[],
  };

  const [userOptions, openInitial, closedInitial] = await Promise.all([
    getUserFilterOptions().catch(() => []),
    getIncidents({
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
    getIncidents({
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Incidencias</h1>
            <p className="text-sm text-muted-foreground">
              Gestión de tickets de soporte técnico
            </p>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/incidents/new">
            <Plus className="h-4 w-4 mr-1" />
            Nueva Incidencia
          </Link>
        </Button>
      </div>
      <IncidentPageContent
        openInitialData={openInitial}
        closedInitialData={closedInitial}
        defaultPageSize={defaultPageSize}
        userOptions={userOptions}
      />
    </div>
  );
}
