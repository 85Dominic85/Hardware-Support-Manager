"use client";

import { useMemo, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTableSearchParams } from "@/hooks/use-table-search-params";
import { DataTable } from "@/components/shared/data-table";
import { incidentColumns, INCIDENT_MOBILE_HIDDEN_COLUMNS } from "./incident-columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchIncidents } from "@/server/actions/incidents";
import {
  OPEN_INCIDENT_STATUSES,
  CLOSED_INCIDENT_STATUSES,
} from "@/lib/constants/statuses";
import type { PaginatedResult } from "@/types";
import type { IncidentRow } from "@/server/queries/incidents";
import type { SortOrder } from "@/types";

interface IncidentListProps {
  initialData: PaginatedResult<IncidentRow>;
  defaultPageSize?: number;
  search: string;
  filterValues: Record<string, string | string[] | undefined>;
  filterKey: string;
  searchAndFilters?: React.ReactNode;
  /**
   * Pre-applied status filter so the table only renders one lifecycle group.
   * - `"open"` → only active statuses, default sort `createdAt DESC`
   * - `"closed"` → only resolved/closed/cancelled, default sort `resolvedAt DESC`
   * - undefined → all incidents (legacy behaviour)
   */
  variant?: "open" | "closed";
  /**
   * Prefix for URL query params (page, pageSize, sortBy, sortOrder).
   * Required when two IncidentList instances coexist on the same page
   * to avoid pagination collisions. Example: "open" → `?open_page=2`.
   */
  paramPrefix?: string;
}

export function IncidentList({
  initialData,
  defaultPageSize,
  search,
  filterValues,
  filterKey,
  searchAndFilters,
  variant,
  paramPrefix,
}: IncidentListProps) {
  const isMobile = useIsMobile();

  // Default sort depends on variant: open uses createdAt (newest entries
  // first), closed uses resolvedAt (most recently closed first).
  const defaultSortBy =
    variant === "closed" ? "resolvedAt" :
    variant === "open" ? "createdAt" :
    "stateChangedAt";

  const { page, pageSize, sortBy, sortOrder, setPage, setPageSize, setSorting } =
    useTableSearchParams(defaultSortBy, defaultPageSize, paramPrefix);

  // Merge variant's pre-filter with whatever filterValues the user has set.
  // If the user explicitly filters status, we still constrain to the variant
  // group to keep both tables coherent.
  const effectiveFilters = useMemo(() => {
    if (!variant) return filterValues;

    const lifecycleStatuses =
      variant === "open"
        ? (OPEN_INCIDENT_STATUSES as readonly string[])
        : (CLOSED_INCIDENT_STATUSES as readonly string[]);

    const userStatus = filterValues.status;
    let statusFilter: string[];

    if (Array.isArray(userStatus) && userStatus.length > 0) {
      // Intersection: user's selection ∩ variant's group
      statusFilter = userStatus.filter((s) => lifecycleStatuses.includes(s));
      // If intersection is empty, fall back to the full variant group
      if (statusFilter.length === 0) statusFilter = [...lifecycleStatuses];
    } else {
      statusFilter = [...lifecycleStatuses];
    }

    return { ...filterValues, status: statusFilter };
  }, [filterValues, variant]);

  // Auto-reset page to 1 when search or filters change.
  const prevSearchRef = useRef(search);
  const prevFilterKeyRef = useRef(filterKey);
  let effectivePage = page;
  if (search !== prevSearchRef.current || filterKey !== prevFilterKeyRef.current) {
    effectivePage = 1;
    prevSearchRef.current = search;
    prevFilterKeyRef.current = filterKey;
  }

  const queryKeyPrefix = variant ? `incidents-${variant}` : "incidents";

  const { data: queryData, isLoading, isError, error, refetch } = useQuery({
    queryKey: [queryKeyPrefix, { page: effectivePage, pageSize, search, sortBy, sortOrder, filters: effectiveFilters }],
    queryFn: () =>
      fetchIncidents({
        page: effectivePage,
        pageSize,
        search: search || undefined,
        sortBy,
        sortOrder: sortOrder as SortOrder,
        filters: effectiveFilters,
      }),
    placeholderData: keepPreviousData,
  });

  const data = queryData ?? initialData;

  // Stale highlight: only for the "open" variant, when the incident has been
  // open for more than 7 days. Subtle red left border + tinted background.
  const STALE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;
  const stalePerRow =
    variant === "open"
      ? (row: IncidentRow) => {
          const ageMs = Date.now() - new Date(row.createdAt).getTime();
          return ageMs > STALE_THRESHOLD_MS
            ? "border-l-2 border-l-red-500/60 bg-red-500/[0.03]"
            : undefined;
        }
      : undefined;

  return (
    <DataTable
      columns={incidentColumns}
      columnVisibility={isMobile ? INCIDENT_MOBILE_HIDDEN_COLUMNS : undefined}
      data={data.data}
      totalCount={data.totalCount}
      page={data.page}
      pageSize={data.pageSize}
      totalPages={data.totalPages}
      isLoading={isLoading && !queryData}
      isError={isError}
      errorMessage={error?.message}
      onRetry={() => refetch()}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={setSorting}
      searchBar={searchAndFilters}
      rowClassName={stalePerRow}
    />
  );
}
